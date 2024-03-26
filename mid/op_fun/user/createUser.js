const router = require('express').Router();
const User = require('../../../schema/users');
const checkUserExists = require('./userExists');


function createUser(req,res,next){
    const user = User.create(req.body);
    next();
}