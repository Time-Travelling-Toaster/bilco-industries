import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAttachmentFromFileName = async (fileName, stopId, userId) =>
    prisma.attachment.findMany({
        select: {
            attachmentId: true,
        },
        where: {
            fileName,
            roadTripStopId: stopId,
            ownerId: userId,
        }
    })
// get("SELECT Id FROM Attachment WHERE FileName = ? AND RoadTripStopId = ? AND OwnerId = ?", [fileName, stopId, userId]);

export const getAttachmentForUser = async (attachmentId, userId, stopId) =>
    prisma.attachment.findUnique({
        select: {
            attachmentId: true,
            path: true,
        },
        where: {
            ownerId: userId,
            attachmentId: attachmentId,
            roadTripStopId: stopId,
        }
    })
// get("SELECT Id, Path FROM Attachment WHERE OwnerId = ? AND Id = ? AND RoadTripStopId = ?", [userId, attachmentId, stopId]);

export const deleteAttachmentForUser = async (attachmentId, userId, stopId) =>
    prisma.attachment.delete({
        where: {
            ownerId: userId,
            attachmentId,
            stopId: roadTripStopId,
        }
    });
// run("DELETE FROM Attachment WHERE OwnerId = ? AND Id = ? AND RoadTripStopId = ?", [userId, attachmentId, stopId]);

export const getAttachmentsByStopId = async (stopId) =>
    prisma.attachment.findMany({
        select: {
            attachmentId: true,
            path: true,
            fileName: true
        },
        where: {
            roadTripStopId: stopId
        }
    });
// all("SELECT Id, Path, FileName FROM Attachment WHERE RoadTripStopId = ?;", [stopId]);

export const saveAttachment = async (stopId, userId, fileName, path) =>
    prisma.attachment.create({
        data: {
            roadTripStopId: stopId,
            ownerId: userId,
            fileName,
            path,
        }
    })
// run("INSERT INTO Attachment (RoadTripStopId, OwnerId, FileName, Path) VALUES (?, ?, ?, ?);", [stopId, userId, fileName, path]);
