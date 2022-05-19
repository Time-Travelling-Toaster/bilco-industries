import { 
    addRoadTrip,
    deleteRoadTrip,
    editRoadTrip,
    getRoadTripForUserById,
    getRoadTripsByIds,
    loadRoadTrips,
} from "../DAL/RoadTripDal.js";
import { loadRoadTripSharesForViewer } from "../DAL/RoadTripShareDal.js"
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

export const loadSharedRoadTrips = async (req, res) => {
    const { body: { userId = 0 } } = req;

    const shares = await loadRoadTripSharesForViewer(userId);
    const trips = await getRoadTripsByIds(shares.map(({ RoadTripId }) => RoadTripId))
    OK(res);
    res.send(trips)
};