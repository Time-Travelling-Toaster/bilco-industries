import { all, get, run } from "./SqlLite.js"

export const getUser = async (username) => 
    await get("SELECT Id, UserName, PasswordHash FROM Users WHERE Username = ?", username);

export const getUserByToken = async (token) => 
    await get("SELECT Id, UserName, TokenExpiry FROM Users WHERE Token = ?", token)

export const getUserById = async (userId) =>
    await get("SELECT Id, UserName FROM Users WHERE Id = ?", userId)

export const saveUser = async (username, password) => 
    await run("INSERT INTO Users (UserName, PasswordHash) VALUES (?, ?)", [username, password]);
    
export const createToken = async (userId, token, expiryDate) => 
    await run("UPDATE Users SET Token = ?, TokenExpiry = ? WHERE Id = ?", [token, expiryDate, userId])

export const getUsers =  async () => 
    await all("SELECT Id, UserName FROM Users")