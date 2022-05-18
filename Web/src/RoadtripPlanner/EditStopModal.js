import React, { useState } from "react";
import { Button, Grid, TextField, Typography } from "@mui/material";
import ModalPopup from "../Modal/ModalPopup";
import { MobileDatePicker } from '@mui/x-date-pickers';
import './Roadtrip.css';
import { Box } from "@mui/system";

const EditStopModal = ({
        editable,
        isOpen, 
        setIsOpen, 
        stopLocation, 
        setStopLocation, 
        stopDate, 
        setStopDate, 
        stopDetails, 
        setStopDetails, 
        stopId,
        saveCallback,
        clearData
    }) => {
        const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false)
        return (
            <>    
                <ModalPopup
                    isOpen={detailsModalIsOpen}
                    setIsOpen={setDetailsModalIsOpen}
                    clearData={clearData}
                >
                    <Box sx={{ textAlign: "center" }}>
                        <Typography     
                            color="secondary" 
                            variant="h4"
                            component="h2"
                        >
                            Edit details
                        </Typography>
                        <TextField
                            label="Details"
                            margin="normal"
                            color="secondary"
                            fullWidth
                            multiline
                            minRows={10}
                            value={stopDetails}
                            onChange={({ target: { value } }) => setStopDetails(value)}
                        />
                        { editable ?
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ mt: 3, mb: 2 }}
                                onClick={saveCallback}
                            >
                                Save
                            </Button> 
                            :
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ mt: 3, mb: 2 }}
                                onClick={() => setIsOpen(false)}
                            >
                                Close
                            </Button> 
                        }
                    </Box>
                </ModalPopup>
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
                            { !editable ? "View" : !!stopId ? "Edit" : "Add" } stop
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item >
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="Location"
                                    label="Location"
                                    name="Location"
                                    color="secondary"
                                    value={stopLocation}
                                    onChange={({ target: { value } }) => setStopLocation(value)}
                                />
                                <MobileDatePicker 
                                    label="Stop Date" 
                                    required
                                    value={stopDate}
                                    color="secondary"
                                    onChange={setStopDate}
                                    inputFormat="DD/MM/YYYY"
                                    renderInput={(params) =>
                                        <TextField
                                            color="secondary"
                                            margin="normal"
                                            fullWidth
                                            {...params}  
                                        />
                                    }
                                />
                                <TextField
                                    label="Details"
                                    margin="normal"
                                    fullWidth
                                    color="secondary"
                                    multiline
                                    rows={8}
                                    value={stopDetails}
                                    onChange={({ target: { value } }) => setStopDetails(value)}
                                    sx={{ display: { xs: "none", md: "block" }}}
                                />
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{ display: { xs: "block", md: "none" }, mt: 3, mb: 2 }}
                                    onClick={async () => setDetailsModalIsOpen(true)}
                                >
                                    details
                                </Button>
                                { editable ?
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{ mt: 3, mb: 2 }}
                                        onClick={saveCallback}
                                    >
                                        Save
                                    </Button> 
                                    :
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{ mt: 3, mb: 2 }}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Close
                                    </Button> 
                                }
                            </Grid>
                        </Grid>
                    </Box>
                </ModalPopup>
            </>
        )
    }  

export default EditStopModal;