import React from "react";
import {Button, ButtonGroup, Typography } from "@mui/material";
import ModalPopup from "../Modal/ModalPopup";
import { Box } from "@mui/system";

const DeleteModal = ({isOpen, setIsOpen, confirmCallback}) =>             
    <ModalPopup
        isOpen={isOpen}
        setIsOpen={setIsOpen}
    >
       <Box sx={{ textAlign: "center" }}>
            <Typography     
                color="secondary" 
                variant="h4"
                component="h2"
            >
                Confirm
            </Typography>
            <Typography     
                variant="h6"
                component="h2"
            >
                Are you sure you want to delete this? 
            </Typography>
            <ButtonGroup variant="contained" orientation="horizontal" fullWidth pt="10px" >
                <Button
                    onClick={() => {
                        setIsOpen(false);
                        confirmCallback();
                    }}
                >
                    Yes
                </Button>
                <Button
                    onClick={() => setIsOpen(false)}
                >
                    No
                </Button>
            </ButtonGroup>
        </Box>
    </ModalPopup>

export default DeleteModal