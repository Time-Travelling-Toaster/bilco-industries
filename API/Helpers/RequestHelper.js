export const parseBody = async (req) => {
    try{
        console.log(req.json)

        return JSON.parse(req.body);
    } catch (e) {
        console.log(e)
        return false;
    }
}