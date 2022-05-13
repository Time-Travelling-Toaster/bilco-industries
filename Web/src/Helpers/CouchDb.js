
const couchAuth = "Basic YWRtaW46RGFuZ2VybTB1c3s=";
const couchAddress = "https://bilcoIndustries.asuscomm.com:5984"

const couchCommand = ({ method, suffix, db, body }) => 
    fetch(`${couchAddress}/${db}${suffix}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            authorization: couchAuth,
        },
        body: body ? JSON.stringify(body) : undefined
    });

export const Get = ({ suffix, db }) => {
    if (!db ) return {error: "missing Parameters"}
    return couchCommand({method: "GET", suffix, db});
}

export const Post = ({ suffix, db, body }) => {
    if (!db || !body) return {error: "missing Parameters"}
    return couchCommand({method: "POST", suffix, db, body});
}
