import { test, expect, vi } from 'vitest';
import { AppSocket } from '../../types';
import * as events from '@planning-poker/events';

import onAssignAdmin from './index';

test('onAssignAdmin emits AdminAssigned event with correct adminId', async () => {
  const matchId = 'testMatchId';
  const playerId = 'testPlayerId';

  const socket = {
    data: {
      userId: 'testUserId',
    },
    rooms: {
      values: vi.fn().mockReturnValueOnce({
        next: vi.fn().mockReturnValueOnce({ value: 'testMatchId' }),
      }),
    },
    to: vi.fn().mockReturnThis(),
    emit: vi.fn(),
  }

  await onAssignAdmin(socket as any, matchId, playerId);

  expect(socket.to).toHaveBeenCalledWith(matchId);
  expect(socket.emit).toHaveBeenCalledWith(events.AdminAssigned, { adminId: playerId });
});