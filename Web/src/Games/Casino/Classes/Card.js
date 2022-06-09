import React from "react";

class Card {
    suit = null;
    value = null;
    name = null;
    constructor(suit, name, isBlackjack) {
        this.suit = suit;
        this.name = name;
        if (isNaN(Number(name))) {
            if (name === "ace") this.value = 1
            else if (isBlackjack) this.value = 10;
            else if (name === "jack") this.value = 11;
            else if (name === "queen") this.value = 12;
            else if (name === "king") this.value = 13;
        }
        else this.value = name
    }

    getImage = ({ className, width, height}) => <img width={width} height={height} className={className} src={require(`../Images/Cards/${this.name}_of_${this.suit}.png`)}></img>;
    getBackImage = ({ className, width, height}) => <img width={width} height={height} className={className} src={require(`../Images/Cards/back.png`)}></img>
 }

 export default Card;