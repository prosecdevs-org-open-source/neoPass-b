const router = require('express').Router();
const Permissions = require('../../schema/base/permissions');
const Users = require('../../schema/base/users');
const Roles = require('../../schema/base/roles');
const permissionAuthorizationMiddleWare = require("../../mid/op_fun/permission/permissionAuthorization");
const {validId, validPage} = require('../../mid/validations/validations.js');
const size = require('../../mid/limiters/sizeLimiter.js');

router.get('/', async (req, res) => {
    const permissions = await Permissions.find();
    if (permissions.length === 0) {
        return res.status(404).send({ message: 'No permissions found' });
    }
    res.send(permissions);
}
);

router.get('/page/:page', validPage, async (req, res) => {
    const perPage = 10; // Number of documents per page
    const page = parseInt(req.params.page) || 1; // Current page, default is 1

    try {
    const totalPermissions = await Permissions.countDocuments();
    const totalPages = Math.ceil(totalPermissions / perPage);

    if (page > totalPages) {
        return res.status(400).send({ message: "Invalid page number" });
    }

    const permissions = await Permissions.find()
        .skip((perPage * page) - perPage)
        .limit(perPage);

    res.send({
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalPermissions,
        data: permissions
    });
    } catch (err) {
    res.status(500).send({ message: err.message });
    }
});

router.get('/:id', validId, async (req, res) => {
    const permission = await Permissions.findById(req.params.id);
    res.send(permission);
}
);

router.post('/', size(1024).limit, permissionAuthorizationMiddleWare, async(req, res) => {
    // if (req.body.userId === null || req.body.userId === undefined || req.body.roleId === null || req.body.roleId === undefined || req.body.userId === '' || req.body.roleId) {
    //     console.log(req.body);
    //     return res.status(400).send({ message: 'userId and roleId is required' });
        
    // }
    try {
        const user = await Users.findById(req.body.userId);
        if (!user) {
            return res.status(400).send({ message: 'userId is invalid' });
        }
        const role = await Roles.find({"id":req.body.roleId});
        if (role.length === 0) {
            return res.status(400).send({ message: 'roleId is invalid' });
        }
        const permission = await Permissions.create(req.body);
        res.status(201).send(permission);
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
    
} 
);

// PUT route to update a specific permission by ID
router.put('/:id', size(1024).limit, validId, permissionAuthorizationMiddleWare, async (req, res) => {
    try {
        const permissionId = req.params.id;
        const { userId, roleId } = req.body;

        // Verify if userId exists
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(400).send({ message: 'User with the provided ID does not exist' });
        }

        // Verify if roleId exists
        const role = await Roles.findOne({ id: roleId });
        if (!role) {
            return res.status(400).send({ message: 'Role with the provided ID does not exist' });
        }

        // Update the permission
        const updatedPermission = { userId, roleId }; // Construct updatedPermission
        const permission = await Permissions.findByIdAndUpdate(permissionId, updatedPermission, { new: true });

        if (!permission) {
            return res.status(404).send({ message: 'Permission not found' });
        }

        res.status(201).send(permission);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});


// DELETE route to delete a specific permission by ID
router.delete('/:id', validId, async (req, res) => {
    try {
        const permissionId = req.params.id;

        // Delete the permission
        const deletedPermission = await Permissions.findByIdAndDelete(permissionId);
        if (!deletedPermission) {
            return res.status(404).send({ message: 'Permission not found' });
        }

        res.send({ message: 'Permission deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


module.exports = router;
