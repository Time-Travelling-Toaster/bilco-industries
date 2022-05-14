import { all, get, run } from "./SqlLite.js"

export const getRoadTripById = async (userId, roadTripId) => 
    await get("SELECT Id FROM RoadTrip WHERE UserId = ? AND Id = ?", [userId, roadTripId]);

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