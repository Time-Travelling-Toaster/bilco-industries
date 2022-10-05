import { useTheme } from "@emotion/react";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import FlagIcon from '@mui/icons-material/Flag';
import FlareIcon from '@mui/icons-material/Flare';
import { Typography } from "@mui/material";

const Tile = ({columns, toggleClicked, isClicked, isBomb, toggleFlagged, isFlagged, adjacentBombs}) => {
    const theme = useTheme();
    const [background, setBackground] = useState(theme.palette.background.paper);

    useEffect(() => {
        let backgroundColor;
        if (isBomb && isClicked) backgroundColor = "red";
        else if (isClicked) backgroundColor = theme.palette.secondary.main;
        else if (isFlagged) backgroundColor = theme.palette.secondary.alt;
        else backgroundColor =theme.palette.background.paper;

        setBackground(backgroundColor)
    }, [isBomb, isClicked, isFlagged, theme])

    return (
        <Box 
            onMouseOver={() => {if (!isClicked && !isFlagged) setBackground(theme.palette.secondary.main)}} 
            onMouseOut={() => {if (!isClicked && !isFlagged) setBackground(theme.palette.background.paper)}}
            onContextMenu={(e) => {
                e.preventDefault();
                if (!isClicked) toggleFlagged();
            }}
            style={{ 
                backgroundColor: background, 
                border:"solid 1px", 
                width:( 100 / columns) + "%",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
            }}
            onClick={() => {if (!isClicked) toggleClicked()}}
        >
            <Typography
                sx={{ fontSize: { md: "5em", xs: "2em"} }}
            >
                {isClicked && !isBomb ? adjacentBombs : ""}
            </Typography>
            <Typography>
                {!isClicked && isFlagged && <FlagIcon sx={{ fontSize: { md: "5em", xs: "2em"} }} />}
                {isBomb && isClicked && <FlareIcon sx={{ fontSize: { md: "5em", xs: "2em"} }} />}
            </Typography>
        </Box>
    )
}

export default Tile;