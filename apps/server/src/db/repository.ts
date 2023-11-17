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

export async function deleteMatch(matchId: string) {
  await redis.del(`match:${matchId}`);
}

export async function doesMatchExist(matchId: string) {
  return await redis.exists(`match:${matchId}`);
}

export async function addPlayer(
  matchId: string,
  playerId: string,
  playerName: string
) {
  const playerCount = await redis.hGet(`match:${matchId}`, "players");

  if (Number(playerCount) >= 10) {
    throw new Error("Match is full");
  }

  await redis.hIncrBy(`match:${matchId}`, "players", 1);
  await redis.hSet(`player:${playerId}`, {
    matchId,
    name: playerName,
  });
}

export async function addSpectator(
  matchId: string,
  spectatorId: string,
  name: string
) {
  await redis.hSet(`spectator:${spectatorId}`, {
    matchId,
    name,
  });
}
