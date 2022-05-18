import React, { memo } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import moment from "moment";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ShareIcon from '@mui/icons-material/Share';

const RoadTrip = ({ 
    editable,
    Id, 
    Name, 
    StartDate, 
    Stops, 
    expandedTrip, 
    setExpandedTrip,
    clearStop,
    RoadTripStopComponent,
    setDeleteModalIsOpen,
    openTrip,
    openShare
}) => (
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
                expandIcon={<ExpandMore />}
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
                {editable && 
                    <Typography 
                        sx={{ width: '33%', textAlign: "right" }}
                    >
                        <ShareIcon onClick={e => {
                            e.stopPropagation();
                            setExpandedTrip(Id);
                            openShare();
                        }}/>
                        <EditIcon onClick={e => {
                            e.stopPropagation();
                            setExpandedTrip(Id);
                            openTrip(Id, Name, StartDate)
                        }}/>
                        <DeleteForeverIcon onClick={(e) => {
                            e.stopPropagation();
                            setExpandedTrip(Id);
                            setDeleteModalIsOpen(true)
                        }}/>
                    </Typography>
                }
            </AccordionSummary>
            <AccordionDetails 
                sx={{ backgroundColor: "primary.main" }}
                color="secondary"
            >
                { Stops && 
                    Stops.map((stop) => <RoadTripStopComponent editable={editable} key={stop.Id} {...stop} />)
                }
                {
                    editable && 
                    <Button
                        fullWidth
                        color="secondary"
                        variant="contained"
                        onClick={clearStop}
                    >
                        Add Stop
                    </Button>
                }
            </AccordionDetails>
        </Accordion>
    )


export default memo(RoadTrip);