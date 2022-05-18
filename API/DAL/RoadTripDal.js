import { all, get, run } from "./SqlLite.js"

export const getRoadTripForUserById = async (userId, roadTripId) => 
    await get("SELECT Id FROM RoadTrip WHERE UserId = ? AND Id = ?", [userId, roadTripId]);

export const getRoadTripsByIds = async (roadTripIds) => 
    await all("SELECT Id, Name, StartDate FROM RoadTrip WHERE Id IN (?)", [roadTripIds]);

export const addRoadTrip = async (userId, date, name) => 
    await run("INSERT INTO RoadTrip (UserId, Name, StartDate) VALUES (?, ?, ?);", [userId, name, date]);

export const editRoadTrip = async (name, date, id) => 
    await run(`
        UPDATE 
            RoadTrip 
        SET 
            Name = ?, 
            StartDate = ? 
        WHERE 
            Id = ?`,
        [name, date, id]
    );

export const deleteRoadTrip = async (id) => 
    await run("DELETE FROM RoadTrip WHERE Id = ?", id);

export const loadRoadTrips = async (userId) => 
    await all("SELECT Id, Name, StartDate FROM roadtrip WHERE UserId=?", userId)

export const addRoadTripStop = async (userId, date, location, details) => 
    await run("INSERT INTO RoadTripStop (RoadTripId, Location, Date, Details) VALUES (?, ?, ?, ?);", [userId, location, date, details]);

export const editRoadTripStop = async (stopId, date, location, details) => 
    await run(`
        UPDATE 
            RoadTripStop 
        SET 
            Date = ?,
            Location = ?,
            Details = ?
        WHERE 
            Id = ?`, 
        [date, location, details, stopId]
    );

export const getRoadTripStopsByRoadTripId = async (roadTripId) => 
    await all("SELECT Id, Location, Details, Date FROM RoadTripStop WHERE RoadTripId = ?", [roadTripId]);

export const deleteRoadTripStop = async (stopId) => 
    await run("DELETE FROM RoadTripStop WHERE Id = ?", stopId);

export const getShareByTripId = async (ownerId, tripId) => 
    await get("SELECT Id FROM RoadTripShare WHERE RoadTripId = ? AND OwnerId = ? ", [tripId, ownerId])

export const addRoadTripShare = async (roadTripId, ownerId, viewerId) => 
    await run("INSERT INTO RoadTripShare (RoadTripId, OwnerId, ViewerId) VALUES (?, ?, ? );", [roadTripId, ownerId, viewerId])

export const loadRoadTripShares = async (ownerId, tripId) => 
    await all("SELECT Id, RoadTripId, OwnerId, ViewerId FROM RoadTripShare WHERE RoadTripId = ? AND OwnerId = ? AND (ViewerId = ? OR ViewerId = 0) ", [tripId, ownerId, ownerId])

export const loadRoadTripSharesForViewer = async (viewerId) => 
    await all("SELECT RoadTripId FROM RoadTripShare WHERE (ViewerId = ? OR ViewerId = 0) AND OwnerId != ?", [viewerId, viewerId])

export const deleteRoadTripShare = async (id) => 
    await run("DELETE FROM RoadTripShare WHERE Id = ?", id);