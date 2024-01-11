import { test, describe, expect, vi, beforeEach } from 'vitest'
import * as repo from "../../db/repository";
import * as events from "@planning-poker/events";
import onRevealCards from './index';

vi.mock("../../db/repository");
vi.mock("../../lib/logger");

const mockRepo = vi.mocked(repo);

describe('On reveal cards tests', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  })

  test('restarts game if the user is an admin', async () => {
    const mockSocket = {
      data: {
        userId: 'testUserId',
      },
      rooms: {
        values: vi.fn().mockReturnValue({
          next: vi.fn().mockReturnValue({ value: 'testMatchId' }),
        }),
      },
      to: vi.fn().mockReturnThis(),
      emit: vi.fn(),
    }
    mockRepo.isMatchAdmin.mockResolvedValue(true);

    await onRevealCards(mockSocket as any, 'testMatchId');

    expect(mockSocket.to).toHaveBeenCalledWith('testMatchId');
    expect(mockSocket.emit).toHaveBeenCalledWith(events.CardsRevealed);
  })

  test('does not restart game if the user is not an admin', async () => {
    const mockSocket = {
      data: {
        userId: 'testUserId',
      },
      rooms: {
        values: vi.fn().mockReturnValue({
          next: vi.fn().mockReturnValue({ value: 'testMatchId' }),
        }),
      },
      to: vi.fn().mockReturnThis(),
      emit: vi.fn(),
    }

    mockRepo.isMatchAdmin.mockResolvedValue(false);

    await onRevealCards(mockSocket as any, 'testMatchId');

    expect(mockSocket.to).not.toHaveBeenCalled();
    expect(mockSocket.emit).not.toHaveBeenCalled();
  })

})