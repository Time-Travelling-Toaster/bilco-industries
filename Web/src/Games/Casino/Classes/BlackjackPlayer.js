class BlackjackPlayer {
    _strategy = ""
    _cards = []
    _balance = 100
    _draw = () => {};
    _save = () => {}
    _dealerUpcard = null;
    _total = 0;

    constructor({
        strategy = "",
        cards = [],
        balance = 0,
        total = 0,
    }, draw, save, dealerUpcard) {
        this._strategy = strategy;
        this._balance = balance;
        this._cards = cards;
        this._draw = draw;
        this._save = save;
        this._dealerUpcard = dealerUpcard;
        this._total = total;
    }

    getTotal = () => {
        let total = { min: 0, max: 0 };
        
        this._cards.forEach((card) => {
            const {min, max } = total;
            if (card.name === 'ace') {
                total = { min: min + 1, max: max + 11 > 21 ? max + 1 : max + 11 }
            } else {
                total = { min: min + card.value, max: max + card.value }
            }
        })

        return total;
    }

    toJson = () => ({
        strategy: this._strategy,
        cards: this._cards,
        balance: this._balance,
        dealerUpcard: this.dealerUpcard,
        total: this._total
    })
    
    play = () => {
        switch(this._strategy) {
            case "perfect":
                return this.perfectStrategy();
            case "simple":
                return this.simpleStrategy();
            case "dealer":
                return this.dealer();
            case "human":
                return this.human();

            default:
                return this.simpleStrategy()
        }
    }

    perfectStrategy = () => {
        // WIP needs to implement perfect strategy chart, could be a pain 
        const { min, max } = this.getTotal()
        if (max === 21) 
        return;
    }

    simpleStrategy = () => {
        // If your first cards total 12–16 you have a "stiff" hand (one that can be busted with a hit).
        // If the dealer's up card is a 2–6, it is a "stiff" hand for the dealer.
        // If you have 17 or better it is a pat hand, and you stand.
        // If the dealer shows a 7–ace, he or she has a pat hand.
        // If you and the dealer both have a stiff hand, you STAND.
        // If you have a stiff hand and the dealer has a pat hand you HIT.
        const dealerStiff = this._dealerUpcard.value > 1 && this._dealerUpcard.value < 7;
        let run = true;
        
        while (run) {
            const { min, max } = this.getTotal()
            const playerStiff = min > 11;

            if ((playerStiff && dealerStiff) || min > 16 || max === 21) break;

            this.draw();
            continue;
        }

        this.save();
    }

    dealer = () => {
        let run = true;
        while (run) {
            let { min, max } = this.getTotal()

            if (min < 12 || (min < 16 && (max < 16 || max > 21)) ) {
                this.draw();
                continue;
            }

            break;
        };
        
        this.save();
    }

    human = () => {

    }

    draw = () => {
        this._cards.push(this._draw());
        const { max, min } = this.getTotal();
        this._total = max <= 21 ? max : min;
    }

    save = () => this._save(this.toJson());
}

export default BlackjackPlayer;