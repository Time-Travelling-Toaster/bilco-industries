import React, { useState } from "react";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import moment from "moment";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FileModal from "./FileModal";
import AttachFileIcon from '@mui/icons-material/AttachFile';

const RoadTripStop = ({ Id, Location, Date, Details, setSelectedStop, setDeleteStopModalIsOpen, openStop, editable }) => {
    const [fileModalOpen, setFileModalOpen] = useState(false);

    return (
        <Box 
            sx={{ display: "flex", flexDirection: "row", border: "solid 3px secondary" }}
            key={Id}
        >
            <FileModal 
                isOpen={fileModalOpen}
                setIsOpen={setFileModalOpen}
                clearData
            />
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
            {editable && 
                <Typography 
                    sx={{ width: '33%', letterSpacing: "5px", textAlign: "right" }}
                >
                <EditIcon  onClick={() => openStop(Id, Location, Date, Details, true)} />
                <AttachFileIcon 
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStop(Id);
                        setFileModalOpen(true);
                    }}
                />
                <DeleteForeverIcon 
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStop(Id);
                        setDeleteStopModalIsOpen(true);
                    }} 
                />
                </Typography>
            }   
        </Box>
    )
}


export default RoadTripStop;