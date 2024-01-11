import {test, describe, expect, vi, beforeEach} from 'vitest'
import * as repo from "../../db/repository";
import * as events from "@planning-poker/events";
import onResetGame from './index';

vi.mock("../../db/repository");

const mockRepo = vi.mocked(repo);

describe('On reset game tests', () => {

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
                    next: vi.fn().mockReturnValue({value: 'testMatchId'}),
                }),
            },
            to: vi.fn().mockReturnThis(),
            emit: vi.fn(),
        }
        mockRepo.isMatchAdmin.mockResolvedValue(true);

        await onResetGame(mockSocket as any, 'testMatchId');

        expect(mockRepo.resetGame).toHaveBeenCalledWith('testMatchId');
        expect(mockSocket.to).toHaveBeenCalledWith('testMatchId');
        expect(mockSocket.emit).toHaveBeenCalledWith(events.MatchRestarted);
    })

    test('does not restart game if the user is not an admin', async () => {
        const mockSocket = {
            data: {
                userId: 'testUserId',
            },
            rooms: {
                values: vi.fn().mockReturnValue({
                    next: vi.fn().mockReturnValue({value: 'testMatchId'}),
                }),
            },
            to: vi.fn().mockReturnThis(),
            emit: vi.fn(),
        }

        mockRepo.isMatchAdmin.mockResolvedValue(false);

        await onResetGame(mockSocket as any, 'testMatchId');

        expect(mockRepo.resetGame).not.toHaveBeenCalled();
        expect(mockSocket.to).not.toHaveBeenCalled();
        expect(mockSocket.emit).not.toHaveBeenCalled();
    })

})