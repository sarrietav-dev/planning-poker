import joinMatch from './index';
import * as repo from '../../db/repository';
import * as events from '@planning-poker/events';
import { AppSocket } from '../../types';
import { vi, describe, beforeEach, it, expect, type Mock } from "vitest"
import { afterEach } from 'node:test';

vi.mock('../../db/repository');
vi.mock('../../log');
vi.mock('../../events');

const mockedRepo = vi.mocked(repo);
describe('joinMatch', () => {
    let socket: AppSocket;
    let callback: Mock;

    beforeEach(() => {
        socket = {
            data: {
                userId: 'user1',
            },
            to: vi.fn().mockReturnThis(),
            emit: vi.fn(),
            join: vi.fn(),
        } as unknown as AppSocket;
        callback = vi.fn();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should not join match if match does not exist', async () => {
        mockedRepo.doesMatchExist.mockResolvedValue(false);

        await joinMatch(socket, 'match1', 'name1', 'player', callback);

        expect(callback).toHaveBeenCalledWith(undefined, { message: "Match does not exist" });
    });

    it('should not join match if user is already in match', async () => {
        mockedRepo.doesMatchExist.mockResolvedValue(true);
        mockedRepo.isUserInMatch.mockResolvedValue(true);

        await joinMatch(socket, 'match1', 'name1', 'player', callback);

        expect(mockedRepo.addPlayer).not.toHaveBeenCalled();
        expect(mockedRepo.addSpectator).not.toHaveBeenCalled();
    });

    it('should join match as player', async () => {
        mockedRepo.doesMatchExist.mockResolvedValue(true);
        mockedRepo.isUserInMatch.mockResolvedValue(false);
        mockedRepo.getMatch.mockResolvedValue({} as any);

        await joinMatch(socket, 'match1', 'name1', 'player', callback);

        expect(mockedRepo.addPlayer).toHaveBeenCalledWith('match1', expect.any(String), 'name1');
        expect(socket.to).toHaveBeenCalledWith('match1');
        expect(socket.emit).toHaveBeenCalledWith(events.PlayerJoined, {
            matchId: 'match1',
            name: 'name1',
            id: expect.any(String)
        });
        expect(socket.join).toHaveBeenCalledWith('match1');
        expect(callback).toHaveBeenCalledWith({} as any);
    });

    it('should join match as spectator', async () => {
        mockedRepo.doesMatchExist.mockResolvedValue(true);
        mockedRepo.isUserInMatch.mockResolvedValue(false);
        mockedRepo.getMatch.mockResolvedValue({} as any);

        await joinMatch(socket, 'match1', 'name1', 'spectator', callback);

        expect(mockedRepo.addSpectator).toHaveBeenCalledWith('match1', expect.any(String), 'name1');
        expect(socket.to).toHaveBeenCalledWith('match1');
        expect(socket.emit).toHaveBeenCalledWith(events.SpectatorJoined, {
            matchId: 'match1',
            name: 'name1',
            id: expect.any(String)
        });
        expect(socket.join).toHaveBeenCalledWith('match1');
        expect(callback).toHaveBeenCalledWith({} as any);
    });

    it('should call callback if getMatch throws', async () => {
        mockedRepo.doesMatchExist.mockResolvedValue(true);
        mockedRepo.isUserInMatch.mockResolvedValue(false);
        mockedRepo.getMatch.mockImplementation(() => {
            return Promise.reject(new Error('test'));
        });

        await joinMatch(socket, 'match1', 'name1', 'spectator', callback);

        expect(callback).toHaveBeenCalledWith(undefined, { message: expect.any(String) });
    });

    it('should call callback if addPlayer throws', async () => {
        mockedRepo.doesMatchExist.mockResolvedValue(true);
        mockedRepo.isUserInMatch.mockResolvedValue(false);
        mockedRepo.addPlayer.mockImplementation(() => {
            return Promise.reject(new Error('test'));
        });

        await joinMatch(socket, 'match1', 'name1', 'player', callback);

        expect(callback).toHaveBeenCalledWith(undefined, { message: expect.any(String) });
    });
});
