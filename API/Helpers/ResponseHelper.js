const statusCodes = {
    OK: 200,
    Created: 201,
    Bad_Request: 400,
    Unauthorised: 401,
    Not_Found: 404,
    conflict: 409,
    Internal_Server_Error: 500,
}

const ok = {
    Status: statusCodes.OK,
    Message: "OK"
} 

const created = {
    Status: statusCodes.Created,
    Message: "Created"
}

const badRequest = {
    Status: statusCodes.Bad_Request,
    Message: "Bad Request"
}

const unauthorised = {
    Status: statusCodes.Unauthorised,
    Message: "Unauthorised"
}

const notFound = {
    Status: statusCodes.Not_Found,
    Message: "Not Found"
}

const internalServerError = {
    Status: statusCodes.Internal_Server_Error,
    Message: "Internal Server Error"
}

const conflict = {
    Status: statusCodes.conflict,
    Message: "The resource could not be created because it already exists",
}

export const BadRequest = (res) => {
    res.statusCode = badRequest.Status;
    res.statusMessage = badRequest.Message;
}

export const OK = (res) => {
    res.statusCode = ok.Status;
    res.statusMessage = ok.Message;
}

export const Unauthorised = (res) => {
    res.statusCode = unauthorised.Status;
    res.statusMessage = unauthorised.Message;
}

export const InternalServerError = (res) => {
    res.statusCode = internalServerError.Status;
    res.statusMessage = internalServerError.Message;   
}

export const Created = (res) => {
    res.statusCode = created.Status;
    res.statusMessage = created.Message;
}

export const Conflict = (res) => {
    res.statusCode = conflict.Status;
    res.statusMessage = conflict.Message;
}

export const NotFound = (res) => {
    res.statusCode = notFound.Status;
    res.statusMessage = notFound.Message;
}