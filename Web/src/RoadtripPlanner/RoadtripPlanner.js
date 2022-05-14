import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useLogin } from "../Login/LoginContext";
import { Box } from "@mui/system";
import { useConfig } from "../Config/ConfigContext";
import DeleteModal from "./DeleteModal";
import RoadTripModal from "./RoadTripModal";
import EditStopModal from "./EditStopModal";
import RoadTripStop from "./RoadTripStop";
import RoadTrip from "./RoadTrip";

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

    const sortTrips = useCallback((trips) => trips.sort((trip, prevTrip) => trip.Id - prevTrip.Id), [])

    const addTrip = async () => {
        const response = await fetch(API + "/roadtrip/add", {
            method: "POST", 
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({name: tripName, date: new Date(tripDate).toUTCString(), userId })
        });

        if (response.ok) {
            const { tripId } = await response.json();
            setTrips(t => sortTrips([
                ...t, 
                {
                    Id: tripId,
                    Name: tripName,
                    Date: tripDate,
                }
            ]))
        }
    }

    const deleteTrip = async () => {
        const response = await fetch(API + "/roadtrip/delete", {
            method: "POST", 
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ tripId: expandedTrip, userId })
        });

        if (response.ok) {
            setTrips(t => sortTrips(t.filter(trip => trip.Id !== expandedTrip)))
        }
    }

    const editTrip = async () => {
        const response = await fetch(API + "/roadtrip/edit", {
            method: "POST", 
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({name: tripName, date: tripDate, userId, tripId: expandedTrip })
        });

        if (response.ok) {
            const roadTrip = {
                Name: tripName, StartDate: tripDate.toString(), Id: expandedTrip
            }

            setTrips(t => sortTrips([
                ...t.filter(trip => trip.Id !== expandedTrip),
                roadTrip
            ]));
            console.log(trips)
            console.log(roadTrip)
        }

        setSelectedStop(null);
        setStopModalIsOpen(false);
    };

    const editStop = async () => {
        const response = await fetch(API + "/roadtrip/stops/edit", {
            method: "POST", 
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({location: stopLocation, date: stopDate, userId, roadTripId: expandedTrip, details: stopDetails, stopId: selectedStop })
        });

        if (response.ok) {
            const roadTrip = trips.find(({ Id }) => Id === expandedTrip)
            const { Stops } = roadTrip;

            setTrips(t => sortTrips([
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

            setTrips(t => sortTrips([
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

            setTrips(t => sortTrips([
                ...t.filter(trip => trip.Id !== expandedTrip),
                { ...roadTrip, Stops: Stops.filter(stop => stop.Id !== selectedStop) }
            ]))
        }

        setSelectedStop(null);
        setDeleteStopModalIsOpen(false);
    };

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
            const x = await response.json();
            console.log(sortTrips(x))
            console.log(x)
            setTrips(sortTrips(x));
        }
        load();

        return () => {
            cancel = true;
        }
    }, [API, sortTrips, userId]);

    return (
        <Box style={{ display:"flex", justifyContent: "center" }}>
            <DeleteModal
                isOpen={deleteTripModalIsOpen}
                setIsOpen={setDeleteTripModalIsOpen}
                confirmCallback={deleteTrip}
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
                tripId={expandedTrip}
                saveCallback={async () => {
                    if (expandedTrip === 0) await addTrip();
                    else await editTrip();
                    setTripDate("")
                    setTripName("")
                    setTripModalIsOpen(false);
                }}
                clearTrip={() => {
                    setTripDate("");
                    setTripName("");
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
                    if (selectedStop) await editStop();
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
                {trips.map((trip) => 
                    <RoadTrip
                        key={trip.Id}
                        {...trip}
                        trips={trips}
                        setTrips={setTrips}
                        expandedTrip={expandedTrip}
                        setExpandedTrip={setExpandedTrip}
                        clearStop={() => {
                            setStopDate("")
                            setStopLocation("")
                            setStopDetails("")
                            setSelectedStop("")
                            setStopModalIsOpen(true);
                        }}
                        openTrip={(tripId, name, date) => {
                            setTripName(name)
                            setTripDate(date);
                            setExpandedTrip(tripId)
                            setTripModalIsOpen(true);
                        }}
                        setDeleteModalIsOpen={setDeleteTripModalIsOpen}
                        RoadTripStopComponent={(props) => <RoadTripStop 
                            {...props}
                            setSelectedStop={setSelectedStop} 
                            setDeleteStopModalIsOpen={setDeleteStopModalIsOpen} 
                            openStop={(stopId, location, date, details) => {
                                setStopLocation(location);
                                setStopDate(date);
                                setSelectedStop(stopId);
                                setStopDetails(details)
                                setStopModalIsOpen(true);
                            }}
                        />}
                    />
                )}
                <Button
                    disabled={!isAuthenticated}
                    onClick={() => {
                        setExpandedTrip(0)
                        setTripModalIsOpen(true)
                    }}
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