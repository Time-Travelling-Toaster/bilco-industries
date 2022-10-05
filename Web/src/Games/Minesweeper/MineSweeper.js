import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { RandomInRange } from "../../Common/Random";
import Tile from "./Tile";

const MineSweeper = () => {
    const [bombCount, setBombCount] = useState(10)
    const [board, setBoard] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [flaggedBombs, setFlaggedBombs] = useState(0);

    const width = 8;
    const height = 8;

    const getAdjacentCells = (x, y) => {
        const allowedX = [x]
        if (x !== width - 1) allowedX.push(x + 1) 
        if (x !== 0) allowedX.push(x - 1);
        
        const allowedY = [y];
        if (y !== height - 1) allowedY.push(y + 1);
        if (y !== 0) allowedY.push(y - 1);

        return allowedX.flatMap(xValue => allowedY.map(yValue => [xValue, yValue])) 
    }

    useEffect(() => {
        if (!gameOver) return;
        const b = [...board].map(row => row.map((tile) => ({...tile, isClicked: true, isFlagged: false})));

        setBoard(b);
    }, [board, gameOver])

    const onStart = () => {
        let newBoard = [];
        setGameOver(false);
        setFlaggedBombs(0);

        if (bombCount > width * height) {
            setBombCount(width * height);
            return;
        }
        // Create board with blank cells
        for (let x = 0; x < height; x ++) {
            const row = [];
            
            for (let y = 0; y < width; y ++) {
                row.push({
                    isBomb: false,
                    isClicked: false,
                    isFlagged: false,
                    adjacentBombs: 0
                })
            }

            newBoard.push(row);
        }

        // place bombs
        let bombsPlaced = 0;
        while (bombsPlaced < bombCount) {
            const x = RandomInRange(width);
            const y = RandomInRange(height);
    
            const selected = newBoard[y][x];
            if (!selected.isBomb) {
                newBoard[y][x] = {
                    ...selected,
                    isBomb: true,
                };

                bombsPlaced ++;
            }
        }
        
        // add count of adjacent bombs 
        for (let x = 0; x < height; x ++) {
            for (let y = 0; y < width; y ++) {
                const cell = newBoard[y][x];
                const adjacentCells = getAdjacentCells(x, y);

                const adjacentBombs = adjacentCells.reduce((reducer, [x, y]) => {
                    const { isBomb } = newBoard[y][x];
                    if (isBomb) return reducer += 1;
                    else return reducer
                }, 0);

                newBoard[y][x] = { 
                    ...cell,
                    adjacentBombs
                };
            }
        }

        setBoard(newBoard);
    }
    
    const setClicked = (x, y) => {
        const tempBoard = [...board];
        const { isClicked, isFlagged, isBomb, adjacentBombs, ...rest } = tempBoard[y][x];
        if (isFlagged) return;
        
        tempBoard[y][x] = {
            ...rest,
            isBomb,
            adjacentBombs,
            isClicked: true
        };

        if (isBomb) {
            setGameOver(true)
            alert("Game over");
        };

        if (adjacentBombs === 0 && !isBomb) {
            let adjacent = getAdjacentCells(x,y);
            const alreadyProcessed = [];
            
            while (adjacent.length !== 0) {
                const [xIndex, yIndex] = adjacent.pop();
                const tile = tempBoard[yIndex][xIndex];

                if (!tile.isFlagged) tile.isClicked = true;
                if (tile.adjacentBombs === 0) {
                    const newAdjacent = getAdjacentCells(xIndex, yIndex);
                        
                    adjacent = new Set([
                        ...newAdjacent.map(x => JSON.stringify(x)),
                        ...adjacent.map(x => JSON.stringify(x))
                    ]);
    
                    alreadyProcessed.push(JSON.stringify([xIndex, yIndex]))
                    adjacent = [...adjacent].reduce((reducer, coOrdinate) => {
                        if (alreadyProcessed.includes(coOrdinate)) return reducer;
                        return [...reducer, JSON.parse(coOrdinate)];
                    }, []);
                }
            };
        }

        if (tempBoard.flat().filter(({isFlagged, isClicked, isBomb}) => isClicked || (isFlagged && isBomb)).length ===  width * height - (+bombCount)) {
            setGameOver(true);
            alert("you win")
        }

        setBoard(tempBoard);
    }

    const toggleFlagged = (x, y) => {
        const tempBoard = [...board];
        let cell = tempBoard[y][x];
        cell = {
            ...cell,
            isFlagged: !cell.isFlagged
        }

        tempBoard[y][x] = {
            ...cell
        };

        if (cell.isBomb) {
            if (cell.isFlagged) {
                if (flaggedBombs + 1 === +bombCount) {
                    setGameOver(true);
                    alert("You Win")
                }
                setFlaggedBombs(x => x + 1);
            } else {
                setFlaggedBombs(x => x - 1);
            }
        }

        setBoard(tempBoard);
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent:"center", height: "100%"}}>
            <Box sx={{ width: {xs: "80%", md:"50%"}}}>
                <Box sx={{ 
                    backgroundColor:"primary.main", 
                    border:"solid 5px", 
                    color: "primary.main", 
                    mt:"2vh", 
                    width: "100%",
                    height: "80vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                }}>
                    {board.map((row, yIndex) => 
                        <Box key={"row-" + yIndex} sx={{ display:"flex", flexDirection:"row", justifyContent:"space-evenly", height: (100/ height) + "%" }}>
                            {
                                row.map(({isBomb, isFlagged, isClicked, adjacentBombs}, xIndex) => 
                                <Tile 
                                    key={`${yIndex}-${xIndex}`} 
                                    columns={width}
                                    isBomb={isBomb} 
                                    isFlagged={isFlagged}
                                    isClicked={isClicked}
                                    toggleClicked={() => setClicked(xIndex, yIndex)}
                                    toggleFlagged={() => toggleFlagged(xIndex, yIndex)}
                                    adjacentBombs={adjacentBombs}
                                />)
                            }
                        </Box>
                    )}
                </Box>
                <Box sx={{ display:"flex", justifyContent:"center", pt:"2vh"}}>
                    <TextField 
                        label="Number of bombs" 
                        value={bombCount} 
                        onChange={({target:{value }}) => setBombCount(value)} 
                        inputprops={{ inputProps: { min: 1, max: 20 }}} 
                        type={"number"} 
                    />
                    <Button
                        color="secondary"
                        variant={"outlined"}
                        onClick={onStart}
                    >
                        Start
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default MineSweeper;