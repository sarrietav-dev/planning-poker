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
