// FILEPATH: /c:/Users/ASUS/Development/pragma-poker/apps/server/src/event-handlers/create-match/index.spec.ts

import createMatch from './index';
import { nanoid } from 'nanoid';
import * as repo from '../../db/repository';
import { vi, describe, it, expect } from 'vitest';

vi.mock('../../db/repository');
vi.mock('../../lib/logger');
vi.mock('../../events');
vi.mock('nanoid');

const mockedRepo = vi.mocked(repo);
const mockedNanoid = vi.mocked(nanoid);

describe('createMatch', () => {
  it('should create a match and call the callback with the matchId', async () => {
    const mockSocket = {
      data: {
        userId: 'testUserId',
      },
    };
    const mockName = 'testName';
    const mockMatchId = 'testMatchId';
    const mockCallback = vi.fn();

    mockedNanoid.mockReturnValue(mockMatchId);
    mockedRepo.createMatch.mockResolvedValue(undefined);

    await createMatch(mockSocket as any, mockName, mockCallback);

    expect(nanoid).toHaveBeenCalled();
    expect(repo.createMatch).toHaveBeenCalledWith(mockMatchId, mockName, mockSocket.data.userId);
    expect(mockCallback).toHaveBeenCalledWith(mockMatchId);
  });
});