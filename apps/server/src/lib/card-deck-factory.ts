export default function cardDeckFactory(deckType: "fibonacci"): number[] {
  if (deckType === "fibonacci") return generateFibonacciDeck();

  throw new Error('Invalid card deck');
}

function generateFibonacciDeck(): number[] {
  return [1, 2, 3, 5, 8, 13, 21, 34, 55];
}