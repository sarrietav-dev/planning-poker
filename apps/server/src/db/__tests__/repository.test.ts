import { describe, expect, vi, it, beforeEach } from "vitest";
import redis from "../redis";
import * as repo from "../repository";
import cardDeckFactory from "../../lib/card-deck-factory";

vi.mock("../redis");
vi.mock("../../lib/logger");

const redisMock = vi.mocked(redis);

describe("Repository tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  describe('createMatch', () => {
    const fibCardDeck = cardDeckFactory('fibonacci')

    it('should create a match', async () => {
      redisMock.hSet.mockResolvedValueOnce(3);

      await repo.createMatch("1", "test", "test");

      expect(redisMock.hSet).toHaveBeenCalledWith("match:1", {
        name: "test",
        owner: "test",
        players: 0,
        cardDeck: JSON.stringify(fibCardDeck),
      });
    })

    it('should create a match with a custom deck', async () => {
      redisMock.hSet.mockResolvedValueOnce(3);

      await repo.createMatch("1", "test", "test");

      expect(redisMock.hSet).toHaveBeenCalledWith("match:1", {
        name: "test",
        owner: "test",
        players: 0,
        cardDeck: JSON.stringify(fibCardDeck),
      });
    })

    it('should log an error if it fails', async () => {
      redisMock.hSet.mockResolvedValueOnce(2);

      await repo.createMatch("1", "test", "test");

      expect(redisMock.hSet).toHaveBeenCalledWith("match:1", {
        name: "test",
        owner: "test",
        players: 0,
        cardDeck: JSON.stringify(fibCardDeck),
      });
    })
  })

  describe('getMatch', () => {
    it('should get a match', async () => {
      const matchId = "1";

      // Mock the calls in _getNameAndDeck
      redisMock.hGet.mockResolvedValueOnce("test");
      redisMock.hGet.mockResolvedValueOnce("[1, 2, 3]");

      // Mock the calls in _scanPlayers
      redisMock.scanIterator.mockImplementationOnce(async function* () {
        yield "1"
      });
      redisMock.hGetAll.mockResolvedValueOnce({ id: "1", name: "test_player", cards: "" });

      // Mock the calls in _scanSpectators
      redisMock.scanIterator.mockImplementationOnce(async function* () {
        yield "2"
      });
      redisMock.hGetAll.mockResolvedValueOnce({ id: "2", name: "test_spectator" });

      // Mock the call to JSON.parse
      vi.spyOn(JSON, "parse").mockReturnValueOnce([1, 2, 3]);

      const match = await repo.getMatch(matchId);

      expect(match).toEqual({
        id: matchId,
        name: "test",
        players: [{ id: "1", name: "test_player", card: NaN }],
        spectators: [{ id: "2", name: "test_spectator" }],
        cardDeck: [1, 2, 3],
      });
    })

    it('should throw an error if the match is not found', async () => {
      const matchId = "1";

      // Mock the calls in _getNameAndDeck
      redisMock.hGet.mockResolvedValueOnce(undefined);

      await expect(repo.getMatch(matchId)).rejects.toThrow("Could not find match");
    })

    it('should throw an error if the deck is not found', async () => {
      const matchId = "1";

      // Mock the calls in _getNameAndDeck
      redisMock.hGet.mockResolvedValueOnce("test");
      redisMock.hGet.mockResolvedValueOnce(undefined);

      await expect(repo.getMatch(matchId)).rejects.toThrow("Could not find deck");
    })
  })

  describe('deleteMatch', () => {
    it('should delete a match', async () => {
      const matchId = "1";

      redisMock.del.mockResolvedValueOnce(1);

      await repo.deleteMatch(matchId);

      expect(redisMock.del).toHaveBeenCalledWith(`match:${matchId}`);
    })

    it('should log an error if it fails', async () => {
      const matchId = "1";

      redisMock.del.mockResolvedValueOnce(0);

      expect(repo.deleteMatch(matchId)).rejects.toThrow("Could not delete match");
    })
  })

  describe('doesMatchExist', () => {
    it('should return true if the match exists', async () => {
      const matchId = "1";

      redisMock.exists.mockResolvedValueOnce(1);

      const result = await repo.doesMatchExist(matchId);

      expect(result).toEqual(true);
    })

    it('should return false if the match does not exist', async () => {
      const matchId = "1";

      redisMock.exists.mockResolvedValueOnce(0);

      const result = await repo.doesMatchExist(matchId);

      expect(result).toEqual(false);
    })
  })

  describe('addPlayer', () => {
    it('should add a player', async () => {
      const matchId = "1";
      const playerId = "2";
      const playerName = "test";

      redisMock.hGet.mockResolvedValueOnce("1");
      redisMock.hSet.mockResolvedValueOnce(1);

      const newPlayer = await repo.addPlayer(matchId, playerId, playerName);

      expect(newPlayer).toEqual({
        id: playerId,
        name: playerName,
        card: -1,
      });

      expect(redisMock.hSet).toHaveBeenCalledWith(`match:${matchId}:player:${playerId}`, {
        name: playerName,
        id: playerId,
        card: -1,
      });
      expect(redisMock.hIncrBy).toHaveBeenCalledWith(`match:${matchId}`,
        "players", 1
      );
    })

    it('should throw an error if there are more than 10 players', async () => {
      const matchId = "1";
      const playerId = "2";
      const playerName = "test";

      redisMock.hGet.mockResolvedValueOnce("11");

      expect(repo.addPlayer(matchId, playerId, playerName)).rejects.toThrow("Match is full");
    })
  })

  describe('addSpectator', () => {
    it('should add a spectator', async () => {
      const matchId = "1";
      const spectatorId = "2";
      const spectatorName = "test";

      redisMock.hSet.mockResolvedValueOnce(1);

      const newSpectator = await repo.addSpectator(matchId, spectatorId, spectatorName);

      expect(newSpectator).toEqual({
        id: spectatorId,
        name: spectatorName,
      });

      expect(redisMock.hSet).toHaveBeenCalledWith(`match:${matchId}:spectator:${spectatorId}`, {
        name: spectatorName,
        id: spectatorId,
      });
    })
  })

  describe('isUserInMatch', () => {
    it('should return true if the user is a player', async () => {
      const matchId = "1";
      const playerId = "2";

      redisMock.exists.mockResolvedValueOnce(1);
      redisMock.exists.mockResolvedValueOnce(0);

      const result = await repo.isUserInMatch(matchId, playerId);

      expect(result).toEqual(true);
    })

    it('should return true if the user is a spectator', async () => {
      const matchId = "1";
      const spectatorId = "2";

      redisMock.exists.mockResolvedValueOnce(0);
      redisMock.exists.mockResolvedValueOnce(1);

      const result = await repo.isUserInMatch(matchId, spectatorId);

      expect(result).toEqual(true);
    })

    it('should return false if the user is not a player or spectator', async () => {
      const matchId = "1";
      const playerId = "2";

      redisMock.exists.mockResolvedValueOnce(0);
      redisMock.exists.mockResolvedValueOnce(0);

      const result = await repo.isUserInMatch(matchId, playerId);

      expect(result).toEqual(false);
    })
  })

  describe('setCardDeck', () => {
    it('should set the card deck', async () => {
      const matchId = "1";
      const cards = [1, 2, 3];

      redisMock.hSet.mockResolvedValueOnce(1);

      await repo.setCardDeck(matchId, cards);

      expect(redisMock.hSet).toHaveBeenCalledWith(`match:${matchId}`, {
        cardDeck: JSON.stringify(cards),
      });
    })
  })

  describe('removePlayer', () => {
    it('should remove a player', async () => {
      const matchId = "1";
      const playerId = "2";

      redisMock.hDel.mockResolvedValueOnce(1);

      await repo.removePlayer(matchId, playerId);

      expect(redisMock.hDel).toHaveBeenCalledWith(`match:${matchId}`, `player:${playerId}`);
    })
  })

  describe('chooseCard', () => {
    it('should choose a card', async () => {
      const matchId = "1";
      const playerId = "2";
      const card = 1;

      redisMock.hSet.mockResolvedValueOnce(1);

      await repo.chooseCard(matchId, playerId, card);

      expect(redisMock.hSet).toHaveBeenCalledWith(`match:${matchId}:player:${playerId}`, {
        card,
      });
    })
  })

  describe('resetGame', () => {
    it('should reset the game', async () => {
      const matchId = "1";

      redisMock.scanIterator.mockImplementationOnce(async function* () {
        yield "1"
      });
      redisMock.hSet.mockResolvedValueOnce(1);

      await repo.resetGame(matchId);

      expect(redisMock.hSet).toHaveBeenCalledWith(`match:${matchId}:player:1`, {
        card: -1,
      });
    })
  })

  describe('isMatchAdmin', () => {
    it('should return true if the user is the match admin', async () => {
      const matchId = "1";
      const userId = "2";

      redisMock.hGet.mockResolvedValueOnce(userId);

      const result = await repo.isMatchAdmin(matchId, userId);

      expect(result).toEqual(true);
    })

    it('should return false if the user is not the match admin', async () => {
      const matchId = "1";
      const userId = "2";

      redisMock.hGet.mockResolvedValueOnce("3");

      const result = await repo.isMatchAdmin(matchId, userId);

      expect(result).toEqual(false);
    })
  })

  describe('getPlayerMode', () => {
    it('should return player if the user is a player', async () => {
      const matchId = "1";
      const userId = "2";

      redisMock.exists.mockResolvedValueOnce(1);

      const result = await repo.getPlayerMode(matchId, userId);

      expect(result).toEqual("player");
    })

    it('should return spectator if the user is a spectator', async () => {
      const matchId = "1";
      const userId = "2";

      redisMock.exists.mockResolvedValueOnce(0);

      const result = await repo.getPlayerMode(matchId, userId);

      expect(result).toEqual("spectator");
    })
  })

  describe('removeSpectator', () => {
    it('should remove a spectator', async () => {
      const matchId = "1";
      const spectatorId = "2";

      redisMock.hDel.mockResolvedValueOnce(1);

      await repo.removeSpectator(matchId, spectatorId);

      expect(redisMock.hDel).toHaveBeenCalledWith(`match:${matchId}`, `spectator:${spectatorId}`);
    })
  })

  describe('getSession', () => {
    it('should get a session', async () => {
      const sessionId = "1";

      redisMock.hGetAll.mockResolvedValueOnce({ id: "test" });

      const result = await repo.getSession(sessionId);

      expect(result).toEqual({ id: "test" });
    })
  })

  describe('createSession', () => {
    it('should create a session', async () => {
      const sessionId = "1";
      const userId = "2";

      redisMock.hSet.mockResolvedValueOnce(1);

      await repo.createSession(sessionId, userId);

      expect(redisMock.hSet).toHaveBeenCalledWith(`session:${sessionId}`, {
        userId,
        sessionId
      });
    })
  })

  describe('removeSession', () => {
    it('should delete a session', async () => {
      const sessionId = "1";

      redisMock.del.mockResolvedValueOnce(1);

      await repo.removeSession(sessionId);

      expect(redisMock.del).toHaveBeenCalledWith(`session:${sessionId}`);
    })
  })
})
