import React, { memo } from "react";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import moment from "moment";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const RoadTripStop = ({ Id, Location, Date, Details, setSelectedStop, setDeleteStopModalIsOpen, openStop, editable, setFileModalOpen }) => (
        <Box 
            sx={{ display: "flex", flexDirection: "row", border: "solid 3px secondary" }}
            key={Id}
            onClick={(e) => {
                e.stopPropagation();
                openStop(Id, Location, Date, Details, true);
            }}
        >
            <Typography 
                sx={{ width: '33%', flexShrink: 0, textTransform: "capitalize" }}
            >
                <strong>{Location}</strong>
            </Typography>  
            <Typography 
                sx={{ width: '33%', flexShrink: 0, textTransform: "capitalize" }}
            >
                { moment(Date).format("DD/MM/YYYY") }
            </Typography>
                <Typography 
                    sx={{ width: '33%', letterSpacing: "5px", textAlign: "right" }}
                >
                    {editable && 
                        <>
                            <EditIcon />
                            <DeleteForeverIcon 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedStop(Id);
                                    setDeleteStopModalIsOpen(true);
                                }} 
                            />
                        </>
                    }   
                    <AttachFileIcon 
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStop(Id);
                            setFileModalOpen(true);
                        }}
                    />
                </Typography>
        </Box>
    )

export default memo(RoadTripStop);