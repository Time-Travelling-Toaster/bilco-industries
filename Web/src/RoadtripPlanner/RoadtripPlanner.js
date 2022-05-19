import React, { useCallback, useEffect, useState } from "react";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useLogin } from "../Login/LoginContext";
import { Box } from "@mui/system";
import { useConfig } from "../Config/ConfigContext";
import DeleteModal from "./DeleteModal";
import RoadTripModal from "./RoadTripModal";
import EditStopModal from "./EditStopModal";
import RoadTripStop from "./RoadTripStop";
import RoadTrip from "./RoadTrip";
import RoadTripShareModal from "./RoadTripShareModal";
import FileModal from "./FileModal"

const RoadtripPlanner = () => {
    const { isAuthenticated, user: { userId } } = useLogin();
    const { appConfig : { connectionStrings: { API } } } = useConfig();   

    const [showMine, setShowMine] = useState(isAuthenticated || false);

    const [trips, setTrips] = useState([]);
    const [sharedTrips, setSharedTrips] = useState([]);

    const [tripModalIsOpen, setTripModalIsOpen] = useState(false);
    const [deleteTripModalIsOpen, setDeleteTripModalIsOpen] = useState(false)

    const [deleteStopModalIsOpen, setDeleteStopModalIsOpen] = useState(false)
    const [stopModalIsOpen, setStopModalIsOpen] = useState(false);
    const [shareModalIsOpen, setShareModalIsOpen] = useState(false)
    const [expandedTrip, setExpandedTrip] = useState(0);

    const [tripName, setTripName] = useState("");
    const [tripDate, setTripDate] = useState("");
    
    const [stopLocation, setStopLocation] = useState("");
    const [stopDate, setStopDate] = useState("");
    const [stopDetails, setStopDetails] = useState("");
    const [selectedStop, setSelectedStop] = useState();

    const [shares, setShares] = useState([]);
    const [fileModalIsOpen, setFileModalIsOpen] = useState(false);

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

            if (response.ok) {
                const json = await response.json();
                if (!json) return;
                setTrips(sortTrips(json));
            }
        }

        load();

        return () => {
            cancel = true;
        }
    }, [API, sortTrips, userId]);

    useEffect(() => {
        let cancel = false;
        if (cancel) return;

        const load = async () => {
            const response = await fetch(API + "/roadtrip/shared", {
                method: "POST", 
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ userId })
            });

            if (response.ok) {
                const json = await response.json();
                if (!json.length) return;
                setSharedTrips(sortTrips(json));
            }
        }

        load();

        return () => {
            cancel = true;
        }
    }, [API, sortTrips, userId]);

    useEffect(() => {
        let cancel = false;
        const roadTrip = (showMine ? trips : sharedTrips).find(({ Id }) => Id === expandedTrip);
        if (cancel || !expandedTrip || !roadTrip || roadTrip.Stops) return;

        const load = async () => {
            const response = await fetch(API + "/roadtrip/stops/get", {
                method: "POST", 
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ userId, roadTripId: expandedTrip })
            });
    
            if (response.ok) {
                const data = await response.json();
                if (showMine) {
                    setTrips(t => sortTrips([
                        ...t.filter(trip => trip.Id !== expandedTrip),
                        { ...roadTrip, Stops: data }
                    ]))
                } else {
                    setSharedTrips(t => sortTrips([
                        ...t.filter(trip => trip.Id !== expandedTrip),
                        { ...roadTrip, Stops: data }
                    ]));
                }
            }
        }

        load();

        return () => {
            cancel = true;
        }
    }, [API, expandedTrip, sharedTrips, showMine, sortTrips, trips, userId])

    useEffect(() => {
        let cancel = false;
        if (cancel || !expandedTrip || !userId) return;

        const load = async () => {
            const response = await fetch(API + "/roadtrip/share/get", {
                method: "POST", 
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ roadTripId: expandedTrip, ownerId: userId })
            })

            if (response.ok) {
                const json = await response.json();
                setShares(json);
            }
        }

        load();
        return () => {
            cancel = true
        }
    }, [API, expandedTrip, userId]);

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
                editable={showMine}
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
                clearData={() => {
                    setTripDate("")
                    setTripName("")
                    setSelectedStop("")
                    setTripModalIsOpen(false);
                }}
            />
            <RoadTripShareModal 
                isOpen={shareModalIsOpen}
                setIsOpen={setShareModalIsOpen}
                expandedTrip={expandedTrip}
                shares={shares}
                setShares={setShares}
            />
            <FileModal 
                isOpen={fileModalIsOpen}
                setIsOpen={setFileModalIsOpen}
                stopId={selectedStop}
                canEdit={showMine}
            />
            <Box
                orientation="vertical"
                sx={{ width: { xs: '95%', md: "40%" }}}
                pt="1vh"
                display="flex"
                flexDirection="column"
            >   
                {
                    isAuthenticated && 
                        <ToggleButtonGroup fullWidth>
                            <ToggleButton onClick={() => setShowMine(true)} value={showMine} disabled={!isAuthenticated || showMine} color="primary" >My Trips</ToggleButton>
                            <ToggleButton onClick={() => setShowMine(false)} value={!showMine} disabled={!showMine} color="primary" >Shared With Me</ToggleButton>
                        </ToggleButtonGroup>
                }
                {(showMine ? trips : sharedTrips).map((trip) => 
                    <RoadTrip
                        editable={showMine}
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
                        openShare={() => setShareModalIsOpen(true)}
                        setDeleteModalIsOpen={setDeleteTripModalIsOpen}
                        RoadTripStopComponent={(props) => <RoadTripStop 
                            {...props}
                            setSelectedStop={setSelectedStop} 
                            setDeleteStopModalIsOpen={setDeleteStopModalIsOpen} 
                            setFileModalOpen={setFileModalIsOpen}
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
                {showMine && 
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
                }
            </Box>
        </Box>
    )
}

export default RoadtripPlanner;