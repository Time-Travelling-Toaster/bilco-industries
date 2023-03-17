import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getRoadTripForUserById = async (userId, roadTripId) =>
    prisma.roadTrip.findUnique({
        select: {
            roadTripId: true,
        },
        where: {
            ownerId: userId,
            roadTripId: roadTripId,
        }
    });
// await get("SELECT Id FROM RoadTrip WHERE UserId = ? AND Id = ?", [userId, roadTripId]);

export const getRoadTripsByIds = async (roadTripIds) =>
    prisma.roadTrip.findMany({
        select: {
            roadTripId: true,
            name: true,
            startDate: true,
        },
        where: {
            roadTripId: {
                in: roadTripIds
            }
        }
    });
// await all("SELECT Id, Name, StartDate FROM RoadTrip WHERE Id IN (?)", [roadTripIds]);

export const addRoadTrip = async (userId, date, name) =>
    prisma.roadTrip.create({
        data: {
            ownerId: userId,
            name,
            startDate: date,
        }
    })
// await run("INSERT INTO RoadTrip (UserId, Name, StartDate) VALUES (?, ?, ?);", [userId, name, date]);

export const editRoadTrip = async (name, date, id) =>
    prisma.roadTrip.update({
        data: {
            name,
            startDate: date,
        },
        where: {
            roadTripId: id
        }
    })

// await run(`UPDATE 
//             RoadTrip 
//         SET 
//             Name = ?, 
//             StartDate = ? 
//         WHERE 
//             Id = ?`,
//     [name, date, id]
// );

export const deleteRoadTrip = async (id) =>
    prisma.roadTrip.delete({
        where: {
            roadTripId: id
        }
    });

// await run("DELETE FROM RoadTrip WHERE Id = ?", id);

export const loadRoadTrips = async (userId) =>
    prisma.roadTrip.findMany({
        select: {
            roadTripId: true,
            name: true,
            startDate: true,
        },
        where: {
            ownerId: userId
        }
    });
// await all("SELECT Id, Name, StartDate FROM roadtrip WHERE UserId=?", userId)
