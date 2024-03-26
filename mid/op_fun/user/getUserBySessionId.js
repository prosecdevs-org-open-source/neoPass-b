const Session = require("../../../schema/auth/sessions");

async function getUserBySessionId(req, res, next) {
    const user = await Session.findById(req.headers["id"]);
    if (!user) {
        res.status(404).send("User not found");
    } else {
        req.user = user;
        next();
    }
}

module.exports = getUserBySessionId;
