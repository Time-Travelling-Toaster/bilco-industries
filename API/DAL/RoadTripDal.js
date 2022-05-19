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
