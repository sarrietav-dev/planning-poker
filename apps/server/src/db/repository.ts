import { Match } from "@planning-poker/models";
import redis from "./redis";

export async function createMatch(
  matchId: string,
  name: string,
  owner: string
) {
  await redis.hSet(`match:${matchId}`, {
    name,
    owner,
    players: 0,
  });
}

export async function getMatch(matchId: string): Promise<Match> {
  const [name, deck] = await Promise.all([
    redis.hGet(`match:${matchId}`, "name"),
    redis.hGet(`match:${matchId}`, "cards"),
  ]);
  const players: {
    name: string;
    card?: number;
  }[] = [];
  for await (const playerId of redis.scanIterator({
    MATCH: `match:${matchId}:player:*`,
  })) {
    const player = await redis.hGetAll(playerId);
    players.push({
      name: player.name,
      card: Number(player.card),
    });
  }
  const spectators: { name: string }[] = [];

  for await (const spectatorId of redis.scanIterator({
    MATCH: `match:${matchId}:spectator:*`,
  })) {
    const spectator = await redis.hGetAll(spectatorId);
    spectators.push({
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
  await redis.del(`match:${matchId}`);
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
  await redis.hSet(`match:${matchId}:player:${spectatorId}`, {
    name: name,
  });
}

export async function setCardDeck(matchId: string, cards: number[]) {
  await redis.hSet(`match:${matchId}`, {
    cards: JSON.stringify(cards),
  });
}
