import { deleteAttachmentForUser, getAttachmentForUser, getAttachmentsByStopId } from "../DAL/AttachmentDal.js";
import { deleteFile } from "../DAL/FileHandler.js";
import { BadRequest, InternalServerError, OK, Unauthorised } from "../Helpers/ResponseHelper.js";

export const getAttachmentsForStop = async (req, res) => {
    const { params : { stopId } } = req;

    if (!stopId ) {
        BadRequest(res);
        res.send();
        return;
    };

    const attachments = await getAttachmentsByStopId(stopId);
    OK(res);
    res.send(attachments);
}

export const deleteAttachment = async (req, res) => {
    const { params : { stopId, userId, attachmentId } } = req;

    if (!stopId || ! userId || !attachmentId) {
        BadRequest(res);
        res.send();
        return;
    };

    const attachment = await getAttachmentForUser(attachmentId, userId, stopId)
    if (!attachment) {
        Unauthorised(res);
        res.send();
        return;
    }

    await deleteAttachmentForUser(attachmentId, userId, stopId);
    const success = await deleteFile(attachment.Path)

    if (!success) InternalServerError(res);    
    else OK(res);
    
    res.send();
}