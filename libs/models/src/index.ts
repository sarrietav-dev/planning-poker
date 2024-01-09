export interface Match {
  id: string;
  name: string;
  players: { name: string; card?: number; id: string }[];
  spectators: { id: string, name: string }[];
  cardDeck: number[];
}
