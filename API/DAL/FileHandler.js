import fs from "fs/promises";
import { InternalServerError, OK, Unauthorised } from "../Helpers/ResponseHelper.js";

export const read = async (name, res) => {
    try {
        await fs.access('./Files/' + name)
    } catch {
        console.log(`File ${ name } not found or doesn't have permissions`);
        Unauthorised(res);
        return res;
    }
    console.log('./Files/' + name);
    res.write(fs.readFile('./files/' + name))
    return res;
}

export const writeStream = async (stream, name, res) => {
    try {
        await fs.writeFile(name, stream);
    } catch {
        InternalServerError(res)
        return 500;
    }
    OK(res);
    return res;
}