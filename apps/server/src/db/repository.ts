import { Match } from "@planning-poker/models";
import redis from "./redis";
import log from "../lib/logger";
import cardDeckFactory from "../lib/card-deck-factory";

export async function createMatch(
  matchId: string,
  name: string,
  owner: string
) {
  const EXPECTED_FIELDS_ADDED = 3;

  const deck = cardDeckFactory("fibonacci")

  const rows = await redis.hSet(`match:${matchId}`, {
    name,
    owner,
    players: 0,
    cardDeck: JSON.stringify(deck),
  });

  if (rows !== EXPECTED_FIELDS_ADDED) {
    log.error(`Could not create match: ${matchId} ${name} ${owner}`);
  }
}

/**
 * Retrieves a match by its ID.
 * @param matchId The ID of the match to retrieve.
 * @returns A Promise that resolves to the Match object.
 * @throws Error if the match or deck cannot be found.
 */
export async function getMatch(matchId: string): Promise<Match> {
  const [name, deck] = await _getNameAndDeck(matchId);

  if (!name) {
    log.error(`Could not find match: ${matchId}`);
    throw new Error("Could not find match");
  }

  if (!deck) {
    log.error(`Could not find deck: ${matchId}`);
    throw new Error("Could not find deck");
  }

  const players = await _scanPlayers(matchId);
  const spectators = await _scanSpectators(matchId);

  const cardDeck = JSON.parse(deck) as number[];

  return {
    id: matchId,
    name: name,
    players,
    spectators,
    cardDeck,
  };
}

async function _getNameAndDeck(matchId: string): Promise<[string | undefined, string | undefined]> {
  const [name, deck] = await Promise.all([
    redis.hGet(`match:${matchId}`, "name"),
    redis.hGet(`match:${matchId}`, "cards"),
  ]);

  return [name, deck];
}

async function _scanPlayers(matchId: string): Promise<Match["players"]> {
  const players: Match["players"] = [];
  for await (const playerId of redis.scanIterator({
    MATCH: `match:${matchId}:player:*`,
  })) {
    const player = await redis.hGetAll(playerId);
    players.push({
      name: player.name,
      id: playerId,
      card: Number(player.card),
    });
  }

  return players
}

async function _scanSpectators(matchId: string): Promise<Match["spectators"]> {
  const spectators: Match["spectators"] = [];
  for await (const spectatorId of redis.scanIterator({
    MATCH: `match:${matchId}:spectator:*`,
  })) {
    const spectator = await redis.hGetAll(spectatorId);
    spectators.push({
      name: spectator.name,
      id: spectatorId,
    });
  }

  return spectators
}


/**
 * Deletes a match from the database.
 * @param matchId The ID of the match to delete.
 * @throws Error if the match could not be deleted.
 */
export async function deleteMatch(matchId: string) {
  const number = await redis.del(`match:${matchId}`);
  if (number !== 1) {
    log.error(`Could not delete match: ${matchId}`);
    throw new Error("Could not delete match");
  }
}

export async function doesMatchExist(matchId: string) {
  const result = await redis.exists(`match:${matchId}`);
  return result === 1
}

/**
 * Adds a player to a match.
 * @param matchId - The ID of the match.
 * @param playerId - The ID of the player.
 * @param name - The name of the player.
 * @throws Error if the match is already full.
 */
export async function addPlayer(
  matchId: string,
  playerId: string,
  name: string
) {
  const playerCount = await redis.hGet(`match:${matchId}`, "players");

  if (Number(playerCount) >= 10) {
    log.warn(`Match is full: ${matchId}`);
    throw new Error("Match is full");
  }

  await redis.hIncrBy(`match:${matchId}`, "players", 1);
  await redis.hSet(`match:${matchId}:player:${playerId}`, {
    name,
  });
}

/**
 * Adds a spectator to a match.
 * 
 * @param matchId - The ID of the match.
 * @param spectatorId - The ID of the spectator.
 * @param name - The name of the spectator.
 */
export async function addSpectator(
  matchId: string,
  spectatorId: string,
  name: string
) {
  await redis.hSet(`match:${matchId}:spectator:${spectatorId}`, {
    name: name,
  });
}

export async function isUserInMatch(matchId: string, id: string): Promise<boolean> {
  const existsPlayer = await redis.exists(`match:${matchId}:player:${id}`);
  const existsSpectator = await redis.exists(`match:${matchId}:spectator:${id}`);

  return existsPlayer === 1 || existsSpectator === 1;
}

export async function setCardDeck(matchId: string, cards: number[]) {
  await redis.hSet(`match:${matchId}`, {
    cardDeck: JSON.stringify(cards),
  });
}

export async function removePlayer(matchId: string, playerId: string) {
  await redis.hDel(`match:${matchId}`, `player:${playerId}`);
}

export async function chooseCard(matchId: string, id: string, card: number) {
  await redis.hSet(`match:${matchId}:player:${id}`, {
    card,
  });
}
export async function resetGame(matchId: string) {
  for await (const playerId of redis.scanIterator({
    MATCH: `match:${matchId}:player:*`,
  })) {
    await redis.hSet(`match:${matchId}:player:${playerId}`, {
      card: -1,
    });
  }
}

export async function isMatchAdmin(matchId: string, id: string) {
  const owner = await redis.hGet(`match:${matchId}`, "owner");
  return owner === id;
}

export async function getPlayerMode(
  matchId: string,
  id: string
): Promise<"player" | "spectator"> {
  const exists = await redis.exists(`match:${matchId}:player:${id}`);
  return exists ? "player" : "spectator";
}

export async function removeSpectator(matchId: string, id: string) {
  return await redis.hDel(`match:${matchId}`, `spectator:${id}`);
}

export async function getSession(sessionId: string) {
  return await redis.hGetAll(`session:${sessionId}`)
}

export async function createSession(sessionId: string, userId: string) {
  await redis.hSet(`session:${sessionId}`, {
    userId,
    sessionId,
  });
}

export async function removeSession(sessionId: string) {
  await redis.del(`session:${sessionId}`);
}
