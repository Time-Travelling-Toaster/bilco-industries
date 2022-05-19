import { getRoadTripForUserById } from "../DAL/RoadTripDal.js";
import {
    addRoadTripStop,
    deleteRoadTripStop,
    editRoadTripStop,
    getRoadTripStopsByRoadTripId,
} from "../DAL/RoadTripStopDal.js";
import { Created, OK, Unauthorised, BadRequest} from "../Helpers/ResponseHelper.js";

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