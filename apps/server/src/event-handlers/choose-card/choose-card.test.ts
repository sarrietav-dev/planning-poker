// FILEPATH: /c:/Users/ASUS/Development/pragma-poker/apps/server/src/event-handlers/choose-card/index.spec.ts

import { test, describe, expect, vi } from 'vitest'
import onChooseCard from './index'
import * as repo from "../../db/repository";
import * as events from "@planning-poker/events";

vi.mock("../../db/repository");

const mockRepo = vi.mocked(repo);

describe('onChooseCard', () => {
  test('onChooseCard', async () => {
    const mockSocket = {
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
    const mockCard = 5

    mockRepo.chooseCard.mockResolvedValue()

    await onChooseCard(mockSocket as any, mockCard)

    expect(repo.chooseCard).toHaveBeenCalledWith('testMatchId', mockSocket.data.userId, mockCard)
    expect(mockSocket.to).toHaveBeenCalledWith('testMatchId')
    expect(mockSocket.emit).toHaveBeenCalledWith(events.PlayerSelectedCard, { playerId: mockSocket.data.userId, card: mockCard })
  })
})