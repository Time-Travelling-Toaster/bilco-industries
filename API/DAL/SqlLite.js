import { open } from "sqlite";
import sqlite3 from "sqlite3";

const db = 'BilcoDb.db';

const connect = async () => {
    try {
        const connection = await open({
            filename: db,
            driver: sqlite3.Database
        });

        return connection;
    } catch (e) {
        console.log("Error while connecting to Sqlite DB");
        console.log(e)
        return null;
    }
}

export const get = async (query, params) => {
    try {
        const connection = await connect();
        if (!connection) return false;
    
        const response = await connection.get(query, params);
    
        return response;
    } catch(e) {
        console.log("Error while getting from sqlite" + e)
    }
    await connection.close();
}

export const all = async (query, params) => {
    try {
        const connection = await connect();
        if (!connection) return false;

        const response = await connection.all(query, params);

        return response;
    } catch(e) {
        console.log("Error while running query on sqlite" + e)
    }
    await connection.close();
}

export const run = async (query, params) => {
    try {
        const connection = await connect();
        if (!connection) return false;

        const response = await connection.run(query, params);

        return response;
    } catch(e) {
        console.log("Error while running query on sqlite" + e)
    }
    await connection.close();
}