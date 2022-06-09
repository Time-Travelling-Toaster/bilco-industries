import { useTheme } from "@emotion/react"
import { Typography } from "@mui/material"
import { Box } from "@mui/system"
import React from "react"

const Message = ({ isMine, message, from }) => {
    const theme = useTheme();

    const messageBaseStyle = {
        margin: "1vh", padding: "1vh", maxWidth: { md: "45%", xs: "70%"}, borderRadius: theme.shape.borderRadius, wordBreak: "break-all" 
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <Box sx={{ ...messageBaseStyle, textAlign:"left", borderBottomLeftRadius: 0, backgroundColor: !isMine ? "secondary.alt" : "", }}>
                { !isMine && 
                    <>    
                        <Typography variant="body1">
                            {from}
                        </Typography>
                        <Typography
                            variant="body2"
                        >
                            {message}
                        </Typography>    
                    </>
                }
            </Box>
            <Box sx={{ ...messageBaseStyle, backgroundColor: isMine ? "secondary.main" : "", textAlign:"right", borderBottomRightRadius: 0 }} >
                { isMine && 
                    <Typography
                        variant="body2"
                    >
                        {message}
                    </Typography>    
                }
            </Box>
        </Box>
    )
}

export default Message;