import fs from "fs/promises";

export const read = async (name) => {
    try {
        await fs.access('./Files/' + name)
    } catch (e) {
        console.log(`File ${ name } not found or doesn't have permissions`);
        console.log(e);
        return false;
    }

    return fs.readFile('./files/' + name);
}

export const writeUrl = async (name, fileUrl) => {
    const [, file] = fileUrl.split(',')
    try {
        await fs.writeFile("./Files/" + name, file, "base64");
        return true;
    } catch (e) {
        console.log(`Could not create file ${name}`);
        console.log(e)
        return false;
    }
}

export const deleteFile = async (path) => {
    try {
        await fs.unlink("./Files/" + path);
        return true;
    } catch (e) {
        console.log(`Could not delete file at ${path}`);
        console.log(e)
        return false;
    }
}