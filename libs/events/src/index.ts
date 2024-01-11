import {Match} from "@planning-poker/models";

export const JoinMatchCommand = "join-match" as const;
export const CreateMatchCommand = "create-match" as const;
export const PlayerJoined = "player-joined" as const;
export const PlayerLeft = "player-left" as const;
export const SpectatorJoined = "spectator-joined" as const;
export const SpectatorLeft = "spectator-left" as const;
export const DoesMatchExist = "does-match-exist" as const;
export const PlayerSelectedCard = "player-selected-card" as const;
export const MatchRestarted = "match-restarted" as const;
export const CardsRevealed = "cards-revealed" as const;
export const AdminAssigned = "admin-assigned" as const;
export const CardsChanged = "cards-changed" as const;
export const ChooseCardCommand = "choose-card" as const;
export const ResetGameCommand = "reset-game" as const;
export const RevealCardsCommand = "reveal-cards" as const;
export const AssignAdminCommand = "assign-admin" as const;
export const ChangeCardModeCommand = "change-card-mode" as const;

export interface ClientToServerEvents {
    [PlayerJoined]: (args: { matchId: string, name: string, id: string }) => void;
    [PlayerLeft]: (args: { playerId: string }) => void;
    [SpectatorJoined]: (args: { matchId: string, name: string, id: string }) => void;
    [SpectatorLeft]: (args: { spectatorId: string }) => void;
    [MatchRestarted]: () => void;
    [CardsRevealed]: () => void;
    [AdminAssigned]: (args: { adminId: string }) => void;
    [CardsChanged]: (args: { cards: number[] }) => void;
    [PlayerSelectedCard]: (args: { playerId: string, card: number }) => void;
    "session": (args: SocketData) => void
}

export type Awk<T> = (response?: T, error?: { message: string }) => void;

export interface ServerToClientEvents {
    [JoinMatchCommand]: (matchId: string, name: string, mode: "spectator" | "player", callback: Awk<Match>) => Promise<void>;
    [CreateMatchCommand]: (name: string, callback: Awk<string>) => Promise<void>;
    [DoesMatchExist]: (matchId: string, callback: Awk<boolean>) => Promise<void>;
    [ChooseCardCommand]: (matchId: string, card: number) => Promise<void>;
    [ResetGameCommand]: (matchId: string) => Promise<void>;
    [RevealCardsCommand]: (matchId: string) => Promise<void>;
    [AssignAdminCommand]: (playerId: string) => Promise<void>;
    [ChangeCardModeCommand]: (mode: "show" | "hide") => Promise<void>;
}

export interface SocketData {
    sessionId: string;
    userId: string;
    username: string;
}