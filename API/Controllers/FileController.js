import { getAttachmentFromFileName, saveAttachment } from "../DAL/AttachmentDal.js";
import { read, writeUrl } from "../DAL/FileHandler.js";
import { randomUUID } from 'crypto'
import { BadRequest, Conflict, Created, InternalServerError, NotFound, OK } from "../Helpers/ResponseHelper.js";

export const getFile = async (req, res) => {
    const { query: { download }, params: { name }} = req;
    const file = await read(encodeURI(name));

    if (!file) {
        NotFound(res)
        res.send();
        return;
    }

    OK(res)
    res.send(download ? file : { file });
}

export const saveFile = async (req, res) => {
    const { body : { name, fileContent, userId, stopId } } = req;

    if (!name || !userId || !stopId || !fileContent) {
        BadRequest(res);
        res.send();
        return;
    };

    const attachmentRecord = await getAttachmentFromFileName(name, stopId, userId);

    if (attachmentRecord) {
        Conflict(res);
        res.send({ Id: attachmentRecord.Id });  
        return;
    }

    const [, extension] = name.split(".");
    var filePath = `${randomUUID()}.${extension}`;

    if (!await writeUrl(filePath, fileContent)) {
        InternalServerError(res);
        res.send();
        return;
    }

    const response = await saveAttachment(stopId, userId, name, filePath);
    
    Created(res);
    res.send({ Id: response.lastID, FileName: name, Path: filePath });
};

