const getUserRoleAndRoleId = require("../../rbac/getUserRoleAndRoleId");

async function permissionAuthorizationMiddleware(req, res, next) {
    try {
        // Get the session ID from the request
        const sessionId = req.headers['id'];

        // role id to assign
        const role = req.body.roleId;

        const userRoleId = await getUserRoleAndRoleId(sessionId);

        // Check if the user can add this permission
        if (userRoleId.length>0 && role>=userRoleId[0].roleId) {
            // User has privileges to add this permission
            next();
        } else {
            res.status(403).json({ error: 'Permission denied. Insufficient privileges to assign role.' });
        }
    } catch (error) {
        console.error(error);
        // Handle any errors that occurred during the processing
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = permissionAuthorizationMiddleware;

