import React, { useEffect, useState } from "react";
import { ImageList, ImageListItem, ImageListItemBar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import FileInput from "../Common/FileInput";
import ModalPopup from "../Modal/ModalPopup";

const FileModal = ({isOpen, setIsOpen}) => {
    const [files, setFiles] = useState([]);
    useEffect(() => console.log(files), [files])

    return (
        <ModalPopup
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            clearData={() => {}}
        >
            <Typography
                color="secondary" 
                variant="h4"
                component="h2"
                align="center"
                pb={2}
            >
                Files
            </Typography>
            <ImageList variant="masonry">
                {files.map(file => (
                    <ImageListItem>
                        <img 
                            key={file.name} 
                            src={URL.createObjectURL(file)} 
                            alt={file.name}
                            width={248}
                            loading="lazy"
                        />
                        <ImageListItemBar 
                            title={file.name}
                        />
                    </ImageListItem>
                ))}
            </ImageList>
            <Box width={"100%"} textAlign="center">
                <FileInput 
                    onChange={({ target: { files: picked }}) => setFiles([...picked])}
                    multi={true}
                />
            </Box>
        </ModalPopup>
    )
}

export default FileModal;