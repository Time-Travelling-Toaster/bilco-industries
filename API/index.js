import express from "express";
import fs from "fs";
import cors from "cors";

import * as LoginController from "./Controllers/LoginController.js";
import * as RoadTripController from "./Controllers/RoadTripController.js";
import * as StopController from "./Controllers/StopController.js";
import * as ShareController from "./Controllers/ShareController.js";
import * as FileController from "./Controllers/FileController.js";

const bilco = express();

const environment = process.env.REACT_APP_ENVIRONMENT;
const appConfig = JSON.parse(fs.readFileSync(`./Appsettings.${environment === "production" ? "production" : "development"}.json`));

const { port, allowedRoutes } = appConfig;

bilco.use(cors({ origin: allowedRoutes }));

bilco.use(express.json({
    limit: "10mb"
}));

bilco.get('/', (req, res) => {
    res.send("API is up");
});

//////////////////////////////////////////////////
// File Handler API

bilco.get('/file/:name', FileController.getFile);

bilco.post('/file', FileController.saveFile)

//////////////////////////////////////////////////
// Road Trip API 

bilco.post('/roadtrip/add', RoadTripController.addTrip)

bilco.post('/roadtrip/edit', RoadTripController.editTrip)

bilco.post('/roadtrip/all', RoadTripController.loadTrips);

bilco.post('/roadtrip/delete', RoadTripController.deleteTrip);

bilco.post('/roadtrip/shared', RoadTripController.loadSharedRoadTrips);

    // ROAD TRIP STOPS API
    bilco.post('/roadtrip/stops/add', StopController.addStop);

    bilco.post('/roadtrip/stops/edit', StopController.editStop);

    bilco.post('/roadtrip/stops/get', StopController.loadStopsforTrip);

    bilco.post('/roadtrip/stops/delete', StopController.deleteStop);


    // ROAD TRIP SHARES API
    bilco.post('/roadtrip/share/add', ShareController.addShare);

    bilco.post('/roadtrip/share/get', ShareController.loadShares);

    bilco.post('/roadtrip/share/delete', ShareController.deleteShare);

//////////////////////////////////////////////////
// Login API

bilco.post('/login', LoginController.login);

bilco.post('/signup', LoginController.signUp);

bilco.post('/token', LoginController.checkToken)

bilco.post('/users/get', LoginController.loadUsers)

/////////////////////////////////////////////////
// Start the server

bilco.listen(port, () => console.log("API is listening on port " + port));