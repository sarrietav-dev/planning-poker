export interface Match {
  id: string;
  name: string;
  players: { name: string; card?: number; id: string }[];
  spectators: { name: string }[];
  cardDeck: number[];
}
