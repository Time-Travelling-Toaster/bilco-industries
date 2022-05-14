import React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from "@mui/material";
import { useLogin } from "../Login/LoginContext";
import { useConfig } from "../Config/ConfigContext";
import ExpandMore from "@mui/icons-material/ExpandMore";
import moment from "moment";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const RoadTrip = ({ 
    Id, 
    Name, 
    StartDate, 
    Stops, 
    trips, 
    setTrips, 
    expandedTrip, 
    setExpandedTrip,
    clearStop,
    RoadTripStopComponent,
    setDeleteModalIsOpen,
    openTrip
}) => {
    const { user: { userId } } = useLogin();
    const { appConfig : { connectionStrings: { API } } } = useConfig();   
    const sortTrips = (trips) => trips.sort((trip, prevTrip) => trip.Id - prevTrip.Id)

    const loadStops = async (roadTripId) => {
        const roadTrip = trips.find(({ Id }) => Id === roadTripId);
        if (!roadTripId || !roadTrip || roadTrip.Stops) return;

        const response = await fetch(API + "/roadtrip/stops/get", {
            method: "POST", 
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ userId, roadTripId })
        });

        const data = await response.json();
        setTrips(t => sortTrips([
            ...t.filter(trip => trip.Id !== roadTripId),
            { ...roadTrip, Stops: data }
        ]));
    }

    return (
        <Accordion 
            sx={{ color: "secondary.main", borderColor: "secondary.main" }} 
            key={Id} 
            expanded={expandedTrip === Id} 
            onChange={() => setExpandedTrip(expanded => expanded === Id ? 0 : Id)}
        >
            <AccordionSummary 
                sx={{ backgroundColor: "primary.main" }} 
                key={Id}
                color="secondary" 
                expandIcon={<ExpandMore />} onClick={() => loadStops(Id)} 
            >
                <Typography 
                    sx={{ width: '33%', flexShrink: 0, textTransform: "capitalize" }}
                >
                    <strong>{Name}</strong>
                </Typography>  
                <Typography
                    sx={{ width: '33%', flexShrink: 0, textTransform: "capitalize" }}
                >
                    { moment(StartDate).format("DD/MM/YYYY") }
                </Typography>
                <Typography 
                    sx={{ width: '33%', textAlign: "right" }}
                >
                    <EditIcon onClick={e => {
                        e.stopPropagation();
                        openTrip(Id, Name, StartDate)
                    }}/>
                    <DeleteForeverIcon onClick={(e) => {
                        e.stopPropagation();
                        setExpandedTrip(Id)
                        setDeleteModalIsOpen(true)
                    }}/>
                </Typography>
            </AccordionSummary>
            <AccordionDetails 
                sx={{ backgroundColor: "primary.main" }}
                color="secondary"
            >
                { Stops && 
                    Stops.map((stop) => <RoadTripStopComponent key={stop.Id} {...stop} />)
                }
                <Button
                    fullWidth
                    color="secondary"
                    variant="contained"
                    onClick={clearStop}
                >
                    Add Stop
                </Button>
            </AccordionDetails>
        </Accordion>
    )
}

export default RoadTrip;