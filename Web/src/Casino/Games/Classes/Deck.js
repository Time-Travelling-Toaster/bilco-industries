import Card from "./Card";

class Deck {
    deck = null;
    constructor (isBlackjack) {
        const suits = ["hearts", "diamonds", "clubs", "spades"];
        const values = ["ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king"];
        this.deck = suits.flatMap(suit => values.map(value => new Card(suit, value, isBlackjack)));
    }
}

export default Deck;
