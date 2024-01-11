import { Awk } from '@planning-poker/events';
import * as repo from '../../db/repository';

export default async function onDoesMatchExist(matchId: string, callback: Awk<boolean>) {
  const exists = await repo.doesMatchExist(matchId);
  callback(exists === 1);
}