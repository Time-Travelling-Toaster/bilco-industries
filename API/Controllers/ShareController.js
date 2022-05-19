import { 
    addRoadTripShare,
    deleteRoadTripShare,
    getShareByTripId,
    loadRoadTripShares
} from "../DAL/RoadTripShareDal.js";
import { Created, OK, Unauthorised, BadRequest} from "../Helpers/ResponseHelper.js";

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
