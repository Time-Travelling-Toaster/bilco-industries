import { all, get, run } from "./SqlLite.js"

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