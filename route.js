const router = require('express').Router();

const users = require('./routes/base/users');
const roles = require('./routes/base/roles');
const permissions = require('./routes/base/permissions');
const auth = require('./routes/auth/users');


router.use('/users', users);
router.use('/roles', roles);
router.use('/permissions', permissions);
router.use('/auth', auth);





module.exports = router;


