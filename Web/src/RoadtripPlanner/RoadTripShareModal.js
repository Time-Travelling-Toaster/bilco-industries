import React, { useEffect, useState } from "react";
import { Button, Typography, ButtonGroup } from "@mui/material";
import ModalPopup from "../Modal/ModalPopup";
import { useLogin } from "../Login/LoginContext";
import { useConfig } from "../Config/ConfigContext";
import { Box } from "@mui/system";
import MultiSelectChip from "../Common/MultiSelectChip";

const RoadTripShareModal = ({isOpen, setIsOpen, expandedTrip, shares, setShares}) => {
    const { user, isAuthenticated } = useLogin();
    const { appConfig : { connectionStrings: { API } }, cookies } = useConfig();   
    const [users, setUsers] = useState();
    const [sharedUserIds, setSharedUserIds] = useState([]);

    const saveShare = async (share) => {
        const response = await fetch(API + "/roadtrip/share/add", {
            method: "POST", 
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ roadTripId: expandedTrip, ownerId: user.userId, viewerId: share.viewerId})
        });

        if (response.ok) {
            const json = await response.json();
            return { Id: json.shareId, ...share}
        }
    }

    const deleteShare = (Id) => 
        fetch(API + "/roadtrip/share/delete", {
            method: "POST", 
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ roadTripId: expandedTrip, ownerId: user.userId, shareId: Id})
        })
    
    const save = async () => {
        let tempShares = [...shares];
        const newShares = sharedUserIds.map((viewerId) => {
            if (tempShares.find(({ViewerId}) => ViewerId === viewerId)) return null;
            return { RoadTripId: expandedTrip, OwnerId: user.userId, ViewerId: viewerId }; // share already exists so don't create it 
        }).filter(x => !!x);
        console.log("newShares", newShares)
        tempShares = tempShares.concat(newShares);

        // handle deleted shares
        console.log("tempShares", tempShares)
        const deletedShares = tempShares.map(({ViewerId, Id }, index) => {
            if (sharedUserIds.findIndex(id => id === ViewerId) === -1) {
                console.log(ViewerId)
                tempShares.splice(index, 1);
                return { roadTripId: expandedTrip, ownerId: user.userId, shareId: Id}
            } 
            return null;
        }).filter(x => !!x);

        // console.log(deletedShares);
        setShares(tempShares);
        setIsOpen(false);
    }

    useEffect(() => {
        let cancel = false;
        if (!isAuthenticated || cancel || !user || !isOpen || users) return;

        const load = async () => {
            const response = await fetch(API + "/users/get", {
                method: "POST", 
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ userId: user.userId })
            })

            if (response.ok) {
                const json = await response.json();
                setUsers([
                    { UserName: "Public", Id: 0 },
                    ...json
                ]);
            }
        }
 
        load();
        return () => {
            cancel = true
        }
    }, [API, cookies, isAuthenticated, isOpen, users, user])

    useEffect(() => setSharedUserIds(shares.map(({ ViewerId }) => ViewerId)), [shares])

    return (
        <ModalPopup
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            clearData={() => {
                setSharedUserIds([])
            }}
        >
            <Box>
                <Typography 
                    color="secondary" 
                    variant="h4"
                    component="h2"
                    align="center"
                    pb={2}
                >
                    Share a trip
                </Typography>
                {
                    users ?  
                        <MultiSelectChip
                            items={users.map(({ UserName, Id }) => ({ name: UserName, id: Id}))}
                            selectedItems={sharedUserIds}
                            setSelectedItems={setSharedUserIds}
                            label="Users"
                        />
                        : null
                }
                <ButtonGroup  variant="contained" orientation="horizontal" fullWidth >
                    <Button
                        onClick={save}
                    >
                        Save
                    </Button>
                    <Button
                        onClick={() => setIsOpen(false)}
                    >
                        Close
                    </Button>
                </ButtonGroup>
            </Box>
        </ModalPopup>
    )
}
export default RoadTripShareModal;