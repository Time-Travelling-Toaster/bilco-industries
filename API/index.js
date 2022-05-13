import express, {request, response} from "express";
import { read, writeStream } from "./DAL/FileHandler.js";
import { checkToken, login, signUp } from "./Controllers/LoginController.js";
import { BadRequest } from "./Helpers/ResponseHelper.js";
import { addStop, addTrip, deleteStop, editStop, loadStopsforTrip, loadTrips } from "./Controllers/RoadTripController.js";
import cors from "cors";
const bilco = express();
const port = 1337;

bilco.use(express.json());
bilco.use(cors({
    origin: ["bilcoindustries.asuscomm.com", '*']
}));

bilco.get('/', (req, res) => {
    res.send("API is up")
});

//////////////////////////////////////////////////
// File Handler API

bilco.get('/file/:name', async (req, res) => {
    const file = await read(encodeURI(req.params.name));
    console.log(file);
    const response = OK
    response.file = file;
    res.send(response);
});

bilco.put('/file/:name', async (req, res) => {
    const file = req.pipe();
    const response = await writeStream(file, req.params.name)
    response.send();
})

//////////////////////////////////////////////////
// Road Trip API 

bilco.post('/roadtrip/add', addTrip)

bilco.post('/roadtrip/all', loadTrips);

bilco.post('/roadtrip/stops/add', addStop);

bilco.post('/roadtrip/stops/edit', editStop);

bilco.post('/roadtrip/stops/get', loadStopsforTrip);

bilco.post('/roadtrip/stops/delete', deleteStop);

//////////////////////////////////////////////////
// Login API

bilco.post('/login', login);

bilco.post('/signup', signUp);

bilco.post('/token', checkToken)

//////////////////////////////////////////////////
// COUCH DB API

bilco.listen(port, () => console.log("API is listening on port " + port));