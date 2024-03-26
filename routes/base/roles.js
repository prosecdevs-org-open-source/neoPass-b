const router = require('express').Router();
const Role = require('../../schema/base/roles');
const {validRoleId, validRole, validPage} = require('../../mid/validations/validations.js')
const size = require('../../mid/limiters/sizeLimiter.js')
// GET all roles
router.get('/', async(req, res) => {
    try{
    const roles = await Role.find();
    res.send(roles);

    }catch(err){
        res.status(500).json({message: err.message});
    }

});

router.get('/page/:page', validPage, async (req, res) => {
    const perPage = 10; // Number of documents per page
    const page = parseInt(req.params.page) || 1; // Current page, default is 1

    try {
    const totalRoles = await Role.countDocuments();
    const totalPages = Math.ceil(totalRoles / perPage);

    if (page > totalPages) {
        return res.status(400).send({ message: "Invalid page number" });
    }

    const roles = await Role.find()
        .sort({ id: 1 }) // Sort roles by Higher Priority to Lower Priority
        .skip((perPage * page) - perPage)
        .limit(perPage);

    res.send({
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalRoles,
        data: roles
    });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// POST a new role
router.post('/', size(1024).limit, validRole, async (req, res) => {
    try{
    const newRole = req.body;
    const role = await Role.create(newRole);
    res.send(role);
    }catch(err){
        res.status(500).json({message: err.message});
    }

});

// GET a specific role by ID
router.get('/:id', validRoleId ,async (req, res) => {
    const roleId = req.params.id;
    try{
        const roles = await Role.find({"id":roleId});
        res.send(roles);
    
        }catch(err){
            res.status(500).json({message: err.message});
        }
});

// PUT update an existing role
router.put('/:id', size(1024).limit, validRoleId, validRole, async (req, res) => {
    const roleId = parseInt(req.params.id)
    const updatedRole = req.body;
    try {
        const role = await Role.findOneAndUpdate({id: roleId}, updatedRole, {new:true});
        if(!role){
            return res.status(404).send({ message: 'Role not found' });
        }
        res.send(role);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// DELETE a role
router.delete('/:id', validRoleId, async (req, res) => {
    const roleId = parseInt(req.params.id)
    try {
        const role = await Role.deleteOne({ id: roleId });
        if (!role.deletedCount) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.send({ message: 'Role deleted successfully'});
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

module.exports = router;
