//const router = require('express').Router();
const permission = require("../../../schema/permissions");


function checkUserExists(req, res, next) {
    const permission = permission.findById(req.params.id);
    if (!permission) {
        res.status(404).send('permission not found');
    } else {
        req.user = user;
        next();
    }
}

exports.checkUserExists = checkUserExists;
//module.exports = router;