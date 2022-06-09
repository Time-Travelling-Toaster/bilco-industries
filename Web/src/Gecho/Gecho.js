import { useTheme } from "@emotion/react";
import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import SendIcon from '@mui/icons-material/Send';
import React, { useState } from "react";
import Message from "./Message";
import { useLogin } from "../Login/LoginContext";

const Gecho = () => {
    const theme = useTheme();
    const { user } = useLogin();
    const [message, setMessage] = useState();
    const [ messages, setMessages ] = useState([{
            from: "admin",
            message: "Hello world this is a message sent from me",
        },
        {
            from: "someone else",
            message: "Hello world this is a message sent from another person",
        }
    ]);

    const sendMessage = () => {
        console.log(message)
        setMessages(m => [
            ...m,
            {
                from: user.username,
                message,
            }
        ]);

        setMessage("");
    }

    return (
        <>
            {
                theme.palette ? 
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
                            <Box sx={ {display: "flex", flexDirection: "column", overflowX: "auto" }}>
                                {messages.map(({ from, message }, index) => 
                                    <Message isMine={from === user.username} key={from + index} message={message} from={from}/>
                                )}
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "row"}}>
                                <TextField
                                    placeholder="Type your message here"
                                    color="secondary"
                                    sx={{width: "90%"}}
                                    inputProps={{ style: { color: theme.palette.secondary.main }}}
                                    multiline
                                    rows={4}
                                    value={message}
                                    onChange={({target: { value }}) => setMessage(value)}
                                    variant="filled"
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ width: "10%" }}
                                    onClick={sendMessage}
                                >
                                    <SendIcon />
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                : 
                <>
                </>
            }
        </>
    )
}

export default Gecho;