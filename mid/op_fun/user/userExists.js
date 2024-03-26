const router = require('express').Router();
const User = require('../../../schema/users');


function checkUserExists(req, res, next) {
    const user = User.findById(req.params.id);
    if (!user) {
        res.status(404).send('User not found');
    } else {
        req.user = user;
        next();
    }
}

exports.checkUserExists = checkUserExists;
//module.exports = router;