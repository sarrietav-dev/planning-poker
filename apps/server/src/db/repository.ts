import { Match } from "@planning-poker/models";
import redis from "./redis";
import log from "../lib/logger";

export async function createMatch(
  matchId: string,
  name: string,
  owner: string
) {
  const rows = await redis.hSet(`match:${matchId}`, {
    name,
    owner,
    players: 0,
  });

  if (rows !== 3) {
    log.error(`Could not create match: ${matchId} ${name} ${owner}`);
  }
}

export async function getMatch(matchId: string): Promise<Match> {
  const [name, deck] = await Promise.all([
    redis.hGet(`match:${matchId}`, "name"),
    redis.hGet(`match:${matchId}`, "cards"),
  ]);

  if (!name) {
    log.error(`Could not find match: ${matchId}`);
  }
  if (!deck) {
    log.error(`Could not find deck: ${matchId}`);
  }

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
  const spectators: Match["spectators"] = [];

  for await (const spectatorId of redis.scanIterator({
    MATCH: `match:${matchId}:spectator:*`,
  })) {
    const spectator = await redis.hGetAll(spectatorId);
    spectators.push({
      id: spectatorId,
      name: spectator.name,
    });
  }

  const cardDeck = JSON.parse(deck!) as number[];

  return {
    id: matchId,
    name: name!,
    players,
    spectators,
    cardDeck,
  };
}

export async function deleteMatch(matchId: string) {
  const number = await redis.del(`match:${matchId}`);
  if (number !== 1) {
    log.error(`Could not delete match: ${matchId}`);
  }
}

export async function doesMatchExist(matchId: string) {
  return await redis.exists(`match:${matchId}`);
}

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

export async function addSpectator(
  matchId: string,
  spectatorId: string,
  name: string
) {
  await redis.hSet(`match:${matchId}:spectator:${spectatorId}`, {
    name: name,
  });
}

export async function setCardDeck(matchId: string, cards: number[]) {
  await redis.hSet(`match:${matchId}`, {
    cards: JSON.stringify(cards),
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
