import React from "react";
import AddIcon from '@mui/icons-material/Add';
import {Fab} from "@mui/material";

const FileInput = ({ onChange, multi }) => {
    return (
        <label htmlFor="upload-photo" >
            <input
                style={{ display: 'none' }}
                id="upload-photo"
                name="upload-photo"
                type="file"
                onChange={onChange}
                multiple={multi}
                accept="image/*"
            />
            <Fab
                color="secondary"
                size="small"
                component="span"
                aria-label="add"
                variant="extended"
            >
                <AddIcon /> Upload File
            </Fab>
        </label>
    )
}

export default FileInput;