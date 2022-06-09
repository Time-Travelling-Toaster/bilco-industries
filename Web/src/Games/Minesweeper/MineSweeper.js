import { useTheme } from "@emotion/react";
import { Box } from "@mui/system";
import React from "react";

const MineSweeper = () => {
    const theme = useTheme();
    return (
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent:"center", height: "100%"}}>
            <Box sx={{ 
                backgroundColor:"primary.main", 
                border:"solid 5px", 
                color: "primary.main", 
                mt:"2vh", 
                width: {xs: "80%", md:"50%"}, 
                height: "88vh",
                borderRadius: theme.shape.borderRadius,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}>

            </Box>
        </Box>
    )
}

export default MineSweeper;