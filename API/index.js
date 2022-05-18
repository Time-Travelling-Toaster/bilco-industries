import express from "express";
import fs from "fs"
import { read, writeStream } from "./DAL/FileHandler.js";
import { checkToken, loadUsers, login, signUp } from "./Controllers/LoginController.js";
import { addShare, addStop, addTrip, deleteShare, deleteStop, deleteTrip, editStop, editTrip, loadSharedRoadTrips, loadShares, loadStopsforTrip, loadTrips } from "./Controllers/RoadTripController.js";
import cors from "cors";
const bilco = express();

const environment = process.env.REACT_APP_ENVIRONMENT;
const appConfig =JSON.parse(fs.readFileSync(`./Appsettings.${environment === "production" ? "production" : "development"}.json`));

const { port, allowedRoutes } = appConfig;

bilco.use(cors({ origin: allowedRoutes }));

bilco.use(express.json());

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

bilco.post('/roadtrip/edit', editTrip)

bilco.post('/roadtrip/all', loadTrips);

bilco.post('/roadtrip/delete', deleteTrip);

bilco.post('/roadtrip/shared', loadSharedRoadTrips);

bilco.post('/roadtrip/stops/add', addStop);

bilco.post('/roadtrip/stops/edit', editStop);

bilco.post('/roadtrip/stops/get', loadStopsforTrip);

bilco.post('/roadtrip/stops/delete', deleteStop);

bilco.post('/roadtrip/share/add', addShare);

bilco.post('/roadtrip/share/get', loadShares);

bilco.post('/roadtrip/share/delete', deleteShare);


//////////////////////////////////////////////////
// Login API

bilco.post('/login', login);

bilco.post('/signup', signUp);

bilco.post('/token', checkToken)

bilco.post('/users/get', loadUsers)

//////////////////////////////////////////////////
// COUCH DB API

bilco.listen(port, () => console.log("API is listening on port " + port));