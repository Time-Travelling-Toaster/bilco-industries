import React, { useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from "@mui/material";
import { useLogin } from "../Login/LoginContext";
import { Box } from "@mui/system";
import { useConfig } from "../Config/ConfigContext";
import ExpandMore from "@mui/icons-material/ExpandMore";
import moment from "moment";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteModal from "./DeleteModal";
import RoadTripModal from "./RoadTripModal";
import EditStopModal from "./EditStopModal";

const RoadtripPlanner = () => {
    const { isAuthenticated, user: { userId } } = useLogin();
    const { appConfig : { connectionStrings: { API } } } = useConfig();   
    const [trips, setTrips] = useState([]);

    const [tripModalIsOpen, setTripModalIsOpen] = useState(false);
    const [deleteTripModalIsOpen, setDeleteTripModalIsOpen] = useState(false)

    const [deleteStopModalIsOpen, setDeleteStopModalIsOpen] = useState(false)
    const [stopModalIsOpen, setStopModalIsOpen] = useState(false);
    const [expandedTrip, setExpandedTrip] = useState(0);

    const [tripName, setTripName] = useState("");
    const [tripDate, setTripDate] = useState("");
    
    const [stopLocation, setStopLocation] = useState("");
    const [stopDate, setStopDate] = useState("");
    const [stopDetails, setStopDetails] = useState("");
    const [selectedStop, setSelectedStop] = useState();

    const addTrip = async () => await fetch(API + "/roadtrip/add", {
        method: "POST", 
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({name: tripName, date: new Date(tripDate).toUTCString(), userId })
    });

    const editStop = async () => {
        const response = await fetch(API + "/roadtrip/stops/edit", {
            method: "POST", 
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({location: stopLocation, date: new Date(stopDate).toUTCString(), userId, roadTripId: expandedTrip, details: stopDetails, stopId: selectedStop })
        });

        if (response.ok) {
            const roadTrip = trips.find(({ Id }) => Id === expandedTrip)
            const { Stops } = roadTrip;
            console.log(Stops.filter(stop => stop.Id !== selectedStop));
            setTrips(t => ([
                ...t.filter(trip => trip.Id !== expandedTrip),
                { ...roadTrip, Stops: [ 
                    ...Stops.filter(stop => stop.Id !== selectedStop),
                    {
                        Id: selectedStop,
                        Location: stopLocation,
                        Date: stopDate,
                        Details: stopDetails
                    }
                ] }
            ]));
        }

        setSelectedStop(null);
        setStopModalIsOpen(false);
    };

    const addStop = async () => {
        const response = await fetch(API + "/roadtrip/stops/add", {
            method: "POST", 
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({location: stopLocation, date: new Date(stopDate).toUTCString(), userId, roadTripId: expandedTrip, details: stopDetails })
        })

        if (response.ok) {
            const { stopId } = await response.json()
            const roadTrip = trips.find(({ Id }) => Id === expandedTrip)
            const { Stops } = roadTrip;

            setTrips(t => ([
                ...t.filter(trip => trip.Id !== expandedTrip),
                { ...roadTrip, Stops: [ 
                    ...Stops,
                    {
                        Id: stopId,
                        Location: stopLocation,
                        Date: stopDate,
                        Details: stopDetails
                    }
                ] }
            ]));
        };

        setStopModalIsOpen(false);
    };

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
        setTrips(t => ([
            ...t.filter(trip => trip.Id !== roadTripId),
            { ...roadTrip, Stops: data }
        ]));
    }

    const deleteStop = async () => {
        const response = await fetch(API + "/roadtrip/stops/delete", {
            method: "POST", 
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ userId, roadTripId: expandedTrip, stopId: selectedStop })
        });

        if (response.ok) {
            const roadTrip = trips.find(({ Id }) => Id === expandedTrip)
            const { Stops } = roadTrip;

            setTrips(t => ([
                ...t.filter(trip => trip.Id !== expandedTrip),
                { ...roadTrip, Stops: Stops.filter(stop => stop.Id !== selectedStop) }
            ]))
        }

        setSelectedStop(null);
        setDeleteStopModalIsOpen(false);
    };

    const openStop = (stopId, location, date, details) => {
        setStopLocation(location);
        setStopDate(date);
        setSelectedStop(stopId);
        setStopDetails(details)
        setStopModalIsOpen(true);
    }

    useEffect(() => {
        let cancel = false;
        if (cancel || !userId) return;

        const load = async () => {
            const response = await fetch(API + "/roadtrip/all", {
                method: "POST", 
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ userId })
            });

            setTrips(await response.json());
        }
        load();

        return () => {
            cancel = true;
        }
    }, [API, userId]);

    return (
        <Box style={{ display:"flex", justifyContent: "center" }}>
            <DeleteModal
                isOpen={deleteTripModalIsOpen}
                setIsOpen={setDeleteTripModalIsOpen}
            />
            <DeleteModal
                isOpen={deleteStopModalIsOpen}
                setIsOpen={setDeleteStopModalIsOpen}
                confirmCallback={deleteStop}
            />
            <RoadTripModal
                isOpen={tripModalIsOpen}
                setIsOpen={setTripModalIsOpen}
                tripDate={tripDate}
                setTripDate={setTripDate}
                tripName={tripName}
                setTripName={setTripName}
                saveCallback={async () => {
                    await addTrip();
                    setTripDate("")
                    setTripName("")
                    setTripModalIsOpen(false);
                }}
            />   
            <EditStopModal 
                isOpen={stopModalIsOpen}
                setIsOpen={setStopModalIsOpen}
                stopLocation={stopLocation}
                setStopLocation={setStopLocation}
                stopDate={stopDate}
                setStopDate={setStopDate}
                stopDetails={stopDetails}
                setStopDetails={setStopDetails}
                stopId={selectedStop}
                saveCallback={async () => {
                    if (selectedStop) await editStop()
                    else await addStop();
                    setTripDate("")
                    setTripName("")
                    setSelectedStop("")
                    setTripModalIsOpen(false);
                }}
            />
            <Box
                orientation="vertical"
                sx={{ width: { xs: '95%', md: "40%" }}}
                pt="1vh"
                display="flex"
                flexDirection="column"
            >   
                {trips.map(({ Id, Name, StartDate, Stops }) => 
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
                                <EditIcon />
                                <DeleteForeverIcon />
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails 
                            sx={{ backgroundColor: "primary.main" }}
                            color="secondary"
                        >
                            { Stops && 
                                Stops.map(({Id: stopId, Location, Date: stopDate, Details}) => 
                                    <Box 
                                        sx={{ display: "flex", flexDirection: "row", border: "solid 3px secondary" }}
                                        key={stopId}
                                        onClick={() => openStop(stopId, Location, stopDate, Details, true)}
                                    >
                                        <Typography 
                                            sx={{ width: '33%', flexShrink: 0, textTransform: "capitalize" }}
                                        >
                                            <strong>{Location}</strong>
                                        </Typography>  
                                        <Typography 
                                            sx={{ width: '33%', flexShrink: 0, textTransform: "capitalize" }}
                                        >
                                            { moment(stopDate).format("DD/MM/YYYY") }
                                        </Typography>
                                        <Typography 
                                            sx={{ width: '33%', letterSpacing: "5px", textAlign: "right" }}
                                        >
                                            <EditIcon />
                                            <DeleteForeverIcon 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedStop(stopId);
                                                    setDeleteStopModalIsOpen(true);
                                                }} 
                                            />
                                        </Typography>
                                    </Box>
                                )
                            }
                            <Button
                                fullWidth
                                color="secondary"
                                variant="contained"
                                onClick={() => {
                                    setStopDate("")
                                    setStopLocation("")
                                    setStopDetails("")
                                    setSelectedStop("")
                                    setStopModalIsOpen(true);
                                }}
                            >
                                Add Stop
                            </Button>
                        </AccordionDetails>
                    </Accordion>
                )}
                <Button
                    disabled={!isAuthenticated}
                    onClick={() => setTripModalIsOpen(true)}
                    variant="contained"
                    sx={{ mt: "1vh"}}
                >
                    {isAuthenticated ? "Add Trip" : "Please login to add a trip"}
                </Button>
            </Box>
        </Box>
    )
}

export default RoadtripPlanner;