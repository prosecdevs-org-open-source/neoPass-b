const roleConfig = {
    "/users": ["superadmin", "admin"],
    "/permissions": ["superadmin", "admin"],
    "/roles": ["superadmin", "admin"],
    "/auth": ["superadmin", "admin", "manager", "user"],
    "/stage1": ["superadmin", "admin", "manager"],
    "/stage2": ["superadmin", "admin", "manager"],
    "/careers": ["superadmin", "admin", "manager"],
    "/profile": ["user", "superadmin", "admin", "manager"],
    "/apply": ["user", "superadmin", "admin", "manager"],
    "/round": ["superadmin", "admin", "manager"],
};

module.exports = roleConfig;
