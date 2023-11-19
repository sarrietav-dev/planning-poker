export interface Match {
  id: string;
  name: string;
  players: { name: string; card?: number }[];
  spectators: { name: string }[];
  cardDeck: number[];
}