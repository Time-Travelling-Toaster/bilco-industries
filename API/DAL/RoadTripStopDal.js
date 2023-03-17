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