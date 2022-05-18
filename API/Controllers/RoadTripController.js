import { 
    addRoadTrip,
    addRoadTripShare,
    addRoadTripStop,
    deleteRoadTrip,
    deleteRoadTripShare,
    deleteRoadTripStop,
    editRoadTrip,
    editRoadTripStop,
    getRoadTripForUserById as getRoadTripForUserById,
    getRoadTripsByIds,
    getRoadTripStopsByRoadTripId,
    getShareByTripId,
    loadRoadTrips,
    loadRoadTripShares,
    loadRoadTripSharesForViewer
} from "../DAL/RoadTripDal.js";
import { getUserById } from "../DAL/UserDal.js";
import { Created, OK, Unauthorised, BadRequest} from "../Helpers/ResponseHelper.js";

export const addTrip = async (req, res) => {
    const { body: { date, name, userId } } = req;
    
    if (!date || !name || !userId) {
        BadRequest(res);
        res.send();
        return;
    };

    const user = await getUserById(userId);
    
    if (!user?.UserName) {
        Unauthorised(res);
        res.send();
        return;
    };
    
    const response = await addRoadTrip(userId, date, name)

    Created(res);
    res.send({ tripId: response.lastID });
}

export const editTrip = async (req, res) => {
    const { body: { date, name, userId, tripId } } = req;
    
    if (!date || !name || !userId || !tripId) {
        BadRequest(res);
        res.send();
        return;
    };

    const user = await getUserById(userId);
    
    if (!user?.UserName) {
        Unauthorised(res);
        res.send();
        return;
    };

    await editRoadTrip(name, date, tripId);

    OK(res);
    res.send();
}

export const deleteTrip = async (req, res) => {
    const { body: { userId, tripId } } = req;
    
    if (!userId  || !tripId) {
        BadRequest(res);
        res.send();
        return;
    };

    const trip = await getRoadTripForUserById(userId, tripId);
    
    if (trip?.id) {
        Unauthorised(res);
        res.send();
        return;
    };

    await deleteRoadTrip(tripId);
    OK(res);
    res.send();
}

export const loadTrips = async (req, res) => {
    const { body: { userId } } = req;

    if (!userId) {
        BadRequest(res);
        res.send();
        return;
    };

    const user = await getUserById(userId);
    
    if (!user?.UserName) {
        Unauthorised(res);
        res.send();
        return;
    };
    
    const response = await loadRoadTrips(userId);

    OK(res);
    res.send(response)
}

export const addStop = async (req, res) => {
    const { body: { date, location, details, userId, roadTripId } } = req;

    if (!date || !location || !userId || !roadTripId) {
        BadRequest(res);
        res.send();
        return;
    };

    const trip = await getRoadTripForUserById(userId, roadTripId);

    if (trip?.id) {
        Unauthorised(res);
        res.send();
        return;
    };
    
    const response = await addRoadTripStop(roadTripId, date, location, details);

    Created(res);
    res.send({ stopId: response.lastID });
}

export const editStop = async (req, res) => {
    const { body: { date, location, details, userId, roadTripId, stopId } } = req;

    if (!date || !location || !userId || !details || !roadTripId || !stopId) {
        BadRequest(res);
        res.send();
        return;
    };

    const trip = await getRoadTripForUserById(userId, roadTripId);
    
    if (trip?.id) {
        Unauthorised(res);
        res.send();
        return;
    };
    await editRoadTripStop(stopId, date, location, details);

    OK(res);
    res.send();
}

export const loadStopsforTrip = async (req, res) => {
    const { body: { userId, roadTripId } } = req;

    if (!roadTripId) {
        BadRequest(res);
        res.send();
        return;
    };

    if (userId) {
        const trip = await getRoadTripForUserById(userId, roadTripId);
        
        if (trip?.id) {
            Unauthorised(res);
            res.send();
            return;
        };
    }

    const response = await getRoadTripStopsByRoadTripId(roadTripId);

    OK(res);
    res.send(response);
}

export const deleteStop = async (req, res) => {
    const { body: { userId, roadTripId, stopId } } = req;
    
    if (!userId  || !roadTripId || !stopId) {
        BadRequest(res);
        res.send();
        return;
    };

    const trip = await getRoadTripForUserById(userId, roadTripId);
    
    if (trip?.id) {
        Unauthorised(res);
        res.send();
        return;
    };

    await deleteRoadTripStop(stopId);
    OK(res);
    res.send();
}

export const addShare = async (req, res) => {
    const { body: { roadTripId, ownerId, viewerId } } = req;

    if (!roadTripId || !ownerId) {
        BadRequest(res);
        res.send();
        return;
    };

    const share = await getShareByTripId(ownerId, roadTripId);
    viewerId === 0 ? null : viewerId;

    if (share?.id) {
        Unauthorised(res);
        res.send();
        return;
    };
    
    const response = await addRoadTripShare(roadTripId, ownerId, viewerId);

    Created(res);
    res.send({ shareId: response.lastID });
}

export const loadShares = async (req, res) => {
    const { body: { roadTripId, ownerId } } = req;

    if (!roadTripId || !ownerId) {
        BadRequest(res);
        res.send();
        return;
    };

    const response = await loadRoadTripShares(ownerId, roadTripId);

    OK(res);
    res.send(response);
}

export const deleteShare = async (req, res) => {
    const { body: { shareId, ownerId, roadTripId } } = req;

    if (!roadTripId || !ownerId || !shareId) {
        BadRequest(res);
        res.send();
        return;
    };

    const share = await getShareByTripId(ownerId, roadTripId);
    
    if (share?.id) {
        Unauthorised(res);
        res.send();
        return;
    };

    await deleteRoadTripShare(shareId);
    OK(res);
    res.send();
}

export const loadSharedRoadTrips = async (req, res) => {
    const { body: { userId = 0 } } = req;

    const shares = await loadRoadTripSharesForViewer(userId);
    const trips = await getRoadTripsByIds(shares.map(({ RoadTripId }) => RoadTripId))
    OK(res);
    res.send(trips)
};