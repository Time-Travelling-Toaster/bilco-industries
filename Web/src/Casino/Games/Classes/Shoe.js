import Deck from "./Deck";

class Shoe {
    cards = [];
    discard = [];
    blackjackCount = 0;

    constructor(deckCount, isBlackjack, defaultShuffle) {
        for (let i = 0; i < deckCount; i++) {
            this.cards = [...this.cards, ...new Deck(isBlackjack).deck]
        }
        console.log(defaultShuffle)
        if(defaultShuffle) this.shuffle()
    }

    shuffle = () => {
        this.cards = this.cards
            .map(value => ({ ...value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ sort, ...rest }) => rest)
    }

    draw = () => {
        var card = this.cards.pop();
        this.discard.push(card);

        if (this.cards.length === 0) {
            this.cards = this.discard;
            this.shuffle();
        };

        switch (card.value) {
            case card.value < 7 && card.value > 1:
                this.blackjackCount += 1
                break;
            case card.value > 9:
                this.blackjackCount -= 1;
                break;
            default:
                break;

        }
        console.log(this.blackjackCount)
        return card;
    }
}

export default Shoe;