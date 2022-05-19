import React, { useEffect, useState } from "react";
import { ImageList, ImageListItem, ImageListItemBar, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import FileInput from "../Common/FileInput";
import ModalPopup from "../Modal/ModalPopup";
import { useConfig } from "../Config/ConfigContext";
import { useLogin } from "../Login/LoginContext";
import { readAsDataURL } from "promise-file-reader";
import DeleteForever from "@mui/icons-material/DeleteForever";
import DownloadIcon from '@mui/icons-material/Download';

const FileModal = ({isOpen, setIsOpen, stopId, canEdit}) => {
    const [newFiles, setNewFiles] = useState([]);
    const [files, setFiles] = useState([]);
    const { user: { userId } } = useLogin();
    const { appConfig : { connectionStrings: { API } } } = useConfig(); 

    const deleteFile = async (attachmentId) => {
        const response = await fetch(`${API}/attachments/${userId}/${stopId}/${attachmentId}`, {
            method: "delete"
        });

        if (!response.ok) return;

        setFiles(f => {
            const tempFiles = [...f]
            const fileIndex = tempFiles.findIndex(file => file.Id === attachmentId);
            console.log(fileIndex);
            tempFiles.splice(fileIndex, 1);
            return tempFiles;
        })
    }

    useEffect(() => {
        let cancel = false;
        if (cancel || !userId || !newFiles.length || !stopId) return;
        const added = [...newFiles];
        const save = async () => {
            const responses = await Promise.all(newFiles.map( async file => {
                
                const dataUrl = await readAsDataURL(file);
                console.log(dataUrl);
                const response = await fetch(API + "/file/", {
                    method: "post",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        name: file.name,
                        fileContent: dataUrl,
                        userId,
                        stopId
                    })
                });
                const json = await response.json()
                return { json, status: response.status, fileName: file.name };
            }));
            
            responses.forEach(({json, status, fileName}) => {
                if (status === 201) setFiles(f => [...f, json]);
                const fileIndex = added.findIndex(f => f.name === fileName);
                added.splice(fileIndex, 1);
            })
            setNewFiles(added)
        }

        save();
        return () => {
            cancel = false;
        }
    }, [API, newFiles, stopId, userId])

    useEffect(() => {
        let cancel = false;
        console.log(stopId)
        if (cancel || !stopId) return;

        const load = async () => {
            const response = await fetch(API + "/attachments/" + stopId)
            if (!response.ok) return;

            const fileResponse = await response.json();
            setFiles(fileResponse);
        }

        load();

        return () => {
            cancel = true;
        }
    }, [API, stopId]);

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
                    <ImageListItem
                        key={file.Id} 
                    >
                        <img 
                            src={`${API}/file/${file.Path}?w=248fit=crop&auto=format&download=true`} 
                            srcSet={`${API}/file/${file.Path}?download=true&w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt={file.FileName}
                            loading="lazy"
                        />
                        <ImageListItemBar 
                            title={file.FileName}
                            actionIcon={
                                <>
                                    {canEdit && <DeleteForever onClick={() => deleteFile(file.Id)} />}
                                    <a
                                        href={`${API}/file/${file.Path}?w=248fit=crop&auto=format&download=true`}
                                        download
                                    >
                                        <DownloadIcon/>
                                    </a>
                                </>
                            }
                        >
                        </ImageListItemBar>
                    </ImageListItem>
                ))}
            </ImageList>
            <Box width={"100%"} textAlign="center">
                <FileInput 
                    onChange={({ target: { files: picked }}) => setNewFiles([...picked])}
                    multi={true}
                />
            </Box>
        </ModalPopup>
    )
}

export default FileModal;