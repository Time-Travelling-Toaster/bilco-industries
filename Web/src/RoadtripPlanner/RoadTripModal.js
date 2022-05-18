import React, { memo } from "react";
import {Button, Grid, Typography, TextField } from "@mui/material";
import ModalPopup from "../Modal/ModalPopup";
import { MobileDatePicker } from '@mui/x-date-pickers';
import { Box } from "@mui/system";

const RoadTripModal = ({isOpen, setIsOpen, tripName, setTripName, tripDate, setTripDate, saveCallback, tripId, clearTrip}) =>             
    <ModalPopup
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        clearData={clearTrip}
    >
      <Box sx={{ textAlign: "center" }}>
            <Typography 
                color="secondary" 
                variant="h4"
                component="h2"
            >
                {tripId ? "Edit" : "Create"} a trip
            </Typography>
            <Grid container spacing={2}>
                <Grid item >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="TripName"
                        label="Trip Name"
                        name="TripName"
                        color="secondary"
                        value={tripName}
                        onChange={({ target: { value } }) => setTripName(value)}
                    />
                    <MobileDatePicker 
                        label="Trip Date" 
                        required
                        fullWidth
                        value={tripDate}
                        onChange={setTripDate}
                        renderInput={(params) =>
                            <TextField 
                                color="secondary"
                                margin="normal"
                                fullWidth
                                {...params}  
                            />
                        }
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3, mb: 2 }}
                        onClick={saveCallback}
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>
        </Box>
    </ModalPopup>

export default memo(RoadTripModal)