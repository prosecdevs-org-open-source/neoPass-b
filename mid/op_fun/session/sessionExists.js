const Sessions = require('../../../schema/sessions');



function sessionExists(req, res, next) {
    const session = Sessions.findById(req.params.id);
    if (!session) {
        res.status(404).send('Session not found');
    } else {
        req.session = session;
        next();
    }
}