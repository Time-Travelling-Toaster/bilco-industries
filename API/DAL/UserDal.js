import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const getUser = async (username) =>
    prisma.user.findUnique({
        select: {
            userId: true,
            userName: true,
            passwordHash: true,
        },
        where: {
            userName: username,
        }
    });
// await get("SELECT Id, UserName, PasswordHash FROM Users WHERE Username = ?", username);

export const getUserByToken = async (token) =>
    prisma.user.findUnique({
        select: {
            userid: true,
            userName: true,
            tokenExpiry: true,
        },
        where: {
            token,
        }
    });
// await get("SELECT Id, UserName, TokenExpiry FROM Users WHERE Token = ?", token)

export const getUserById = async (userId) =>
    prisma.user.findUnique({
        select: {
            userId: true,
            userName: true,
        },
        where: {
            userId
        },
    });

// await get("SELECT Id, UserName FROM Users WHERE Id = ?", userId)

export const saveUser = async (username, password) =>
    prisma.user.create({
        data: {
            userName: username,
            passwordHash: password
        }
    });
// await run("INSERT INTO Users (UserName, PasswordHash) VALUES (?, ?)", [username, password]);

export const createToken = async (userId, token, expiryDate) =>
    prisma.user.update({
        data: {
            token,
            userId,
            tokenExpiry: expiryDate,
        },
        where: {
            userId
        }
    });
// await run("UPDATE Users SET Token = ?, TokenExpiry = ? WHERE Id = ?", [token, expiryDate, userId])

export const getUsers = async () =>
    prisma.user.findMany({
        select: {
            userId: true,
            userName: true
        }
    });
// await all("SELECT Id, UserName FROM Users")