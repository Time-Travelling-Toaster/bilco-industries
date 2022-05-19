import { all, get, run } from "./SqlLite.js"

export const getAttachmentFromFileName = async (fileName, stopId, userId) => 
    get("SELECT Id FROM Attachment WHERE FileName = ? AND RoadTripStopId = ? AND OwnerId = ?", [fileName, stopId, userId]);

export const getAttachmentForUser = async (attachmentId, userId, stopId) => 
    get("SELECT Id, Path FROM Attachment WHERE OwnerId = ? AND Id = ? AND RoadTripStopId = ?", [userId, attachmentId, stopId]);

export const deleteAttachmentForUser = async (attachmentId, userId, stopId) => 
    run("DELETE FROM Attachment WHERE OwnerId = ? AND Id = ? AND RoadTripStopId = ?", [userId, attachmentId, stopId]);

export const getAttachmentsByStopId = async (stopId) => 
    all("SELECT Id, Path, FileName FROM Attachment WHERE RoadTripStopId = ?;", [stopId]);

export const saveAttachment = async (stopId, userId, fileName, path) => 
    run("INSERT INTO Attachment (RoadTripStopId, OwnerId, FileName, Path) VALUES (?, ?, ?, ?);", [stopId, userId, fileName, path]);