import argon2 from "argon2";
import { Conflict, Created, OK, Unauthorised, BadRequest } from "../Helpers/ResponseHelper.js";
import { getUser, saveUser, createToken, getUserByToken, getUsers, getUserById } from "../DAL/UserDal.js";
import { randomUUID } from 'crypto'
const defaultHash = "$argon2i$v=19$m=16,t=2,p=1$T0QzeEFGalIzejFGZWR3RQ$4nlIO8TZwyjtS36hhXFGrA";
const tokenLifetime = 604800 * 1000; // 1 week

export const login = async (req, res) => {
    const { body: { username, password, remember } } = req;

    if (!username || !password) {
        BadRequest(res);
        res.send();
        return;
    };

    const user = await getUser(username);
    const { Id, PasswordHash = defaultHash } = (user || {});
    console.log(PasswordHash)

    const valid = await argon2.verify(PasswordHash, password);

    if (valid) {
        OK(res);
        if (remember) {
            const token = randomUUID();
            var expiryDate = Date.now();
            expiryDate = new Date(expiryDate + tokenLifetime).toUTCString();

            await createToken(Id, token, expiryDate);
            res.send({ userId: Id, token, expiryDate })
        } else {
            res.send({ userId: Id })
        }
        return;
    };

    Unauthorised(res);
    res.send({ error: "Bad username or password" });
}

export const signUp = async (req, res) => {
    const { body: { username, password } } = req;
    if (!username || !password) {
        BadRequest(res);
        res.send();
        return;
    };

    const existingUser = await getUser(username);
    if (existingUser?.UserName) {
        Conflict(res);
        res.send();
        return;
    };

    const hash = await argon2.hash(password);
    const response = await saveUser(username, hash)
    Created(res);
    res.send({ userId: response.lastID });
}

export const checkToken = async (req, res) => {
    const { body: { token } } = req;
    if (!token) {
        BadRequest(res);
        res.send();
        return;
    };

    const existingUser = await getUserByToken(token);

    if (!existingUser?.UserName) {
        Unauthorised(res);
        res.send();
        return;
    };

    const { UserName, ExpiryDate, Id } = existingUser;

    if (new Date(ExpiryDate).getTime() > new Date().getTime()) {
        Unauthorised(res);
        res.send();
        return;
    }
    OK(res)
    res.send({ username: UserName, userId: Id });
}

export const loadUsers = async (req, res) => {
    const { body: { userId } } = req;

    if (!userId) {
        BadRequest(res);
        res.send();
        return;
    };

    const existingUser = await getUserById(userId);
    if (!existingUser?.UserName) {
        Unauthorised(res);
        res.send();
        return;
    };

    const response = await getUsers();
    OK(res);
    res.send(response);
}