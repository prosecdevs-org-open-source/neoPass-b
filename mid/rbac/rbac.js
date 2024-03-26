const mongoose = require('mongoose');
const sessions = require('../../schema/auth/sessions');
const roleConfig = require("./roleConfig");
const getUserRoleAndRoleId = require("./getUserRoleAndRoleId");

async function checkRoleMiddleware(req, res, next) {
    try {
        // Get the session ID from the request
        const sessionId = req.headers['id'];

        if (!sessionId) {
            // Session ID is not present, send an error response
            res.status(400).json({ error: 'Session ID is required' });
            return;
        }

        // Use async/await to handle the asynchronous database query
        const userRoles = await getUserRoleAndRoleId(sessionId);
        
        // list of allowed roles for this route
        const allowedRoles = roleConfig[req.baseUrl];
        // Check if the user has the required role
        if (userRoles.length > 0 && allowedRoles.includes(userRoles[0].role)) {
            //console.log('userRoles', userRoles);
            // User has the required role, proceed to the next middleware
            next();
        } else {
            //console.log('userRoles', userRoles);
            // User does not have the required role, send an error response
            res.status(403).json({ error: 'Access denied' });
        }
    } catch (error) {
        console.error(error);
        // Handle any errors that occurred during the processing
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = checkRoleMiddleware;