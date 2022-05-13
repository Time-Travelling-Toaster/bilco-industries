import React, { useState } from "react";
import Shoe from "../Classes/Shoe";
import { Button, ButtonGroup } from "@mui/material";
import BlackjackPlayer from '../Classes/BlackjackPlayer.js'
import "../../Blackjack.css"

const Blackjack = () => {
    const initPlayer = (strategy) => ({
        strategy,
        cards: [],
        total: 0
    });

    const [shoe] = useState(new Shoe(6, true, true));
    const [playerOne, setPlayerOne] = useState(() => initPlayer("simple"));
    const [playerTwo, setPlayerTwo] = useState(() => initPlayer("human"));
    const [playerThree, setPlayerThree] = useState(() => initPlayer("simple"));
    const [dealer, setDealer] = useState(() => initPlayer("dealer"));
    const [isStarted, setIsStarted] = useState(false);
    const [showDealer, setShowDealer] = useState(false);
    const humanPlayer = {value: playerTwo, set: setPlayerTwo};
    
    const players = [ 
        { value: playerOne, set: setPlayerOne},
        ...humanPlayer,
        { value: playerThree, set: setPlayerThree},
        { value: dealer, set: setDealer},
    ]

    const reset = () => {
        players.forEach(({ value, set }) => {
            set({...value, cards: []})
        })
    }

    const draw = ({value, set}) => {
        const player = new BlackjackPlayer(value, shoe.draw);
        player.draw();
        set(player.toJson());
    };

    const deal = () => {
        console.log("isWinner", checkWinner()); 
        reset();
        setShowDealer(false)
        players.forEach((player) => {
            player.value.cards = []
            draw(player);
            draw(player);
        });
        setIsStarted(true);
    };

    const RenderCards = ({ player, isDealer }) => <>
        {(player.cards || []).map((card, index) => isDealer && !showDealer && index === 0 ? card.getBackImage({className: "card"}) : card.getImage({className: "card"}))}
        {(!isDealer || showDealer) && player.total ? <p>Total: {player.total > 21 ? "Bust": player.total}</p> : null}
    </>

    const play = () => {
        players.forEach(({ value, set }) => {
            const player = new BlackjackPlayer(value, shoe.draw, set, dealer.cards[0]);
            player.play();
            console.log(player)
            set(player.toJson());
        });

        setShowDealer(true);
        setIsStarted(false);
    }

    const checkWinner = () => {
        const playerTotal = humanPlayer.value.total;
        return playerTotal < 22 && (dealer.total > 21 || playerTotal > dealer.total);
    }

    return (
        <div className="table">
            <div className="playerOne">
                <div>
                    <p className="playerLabel">Player One</p>
                    <RenderCards player={playerOne} />
                </div>
            </div>
            <div className="playerTwo">
                <div>
                    <p className="playerLabel">Your Hand</p>
                    <RenderCards player={playerTwo} />
                    <div>
                        <ButtonGroup>
                            {isStarted ? 
                                <>
                                    <Button>Split</Button>
                                    <Button>Raise</Button>
                                    <Button onClick={() => draw(humanPlayer)}>Hit</Button>
                                    <Button onClick={play}>Stand</Button>
                                </>
                                : <Button onClick={deal}>Deal</Button>
                                }
                        </ButtonGroup>
                    </div>
                </div>
            </div>
            <div className="playerThree">
                <div>
                    <p className="playerLabel">Player Two</p>
                    <RenderCards player={playerThree} />
                </div>
            </div>
            <div className="dealer">
                <p className="playerLabel">Dealer</p>
                <RenderCards player={dealer} isDealer />
            </div>
        </div>
    )
}

export default Blackjack;