const router = require('express').Router();
const roles = require('../../../schema/roles');


function checkUserExists(req, res, next) {
    const role = roles.findById(req.params.id) || role.find({ name: req.body.id });
    if (!role) {
        res.status(404).send('User not found');
    } else {
        req.role = role;
        next();
    }
}

exports.checkUserExists = checkUserExists;
//module.exports = router;