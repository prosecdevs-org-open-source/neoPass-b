async function consoleLogger(req, res, next) {
    const loc = req.headers.location || req.url;
    //const host = req.headers.host || req.headers.Host;
    //const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    //const url = `${protocol}://${host}${loc}`;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const method = req.method;
    
    //console.log('url', url, 'loc', loc, 'host', host, 'protocol', protocol, 'ip', ip, 'method', method);   
    //console.log('protocol',protocol,'host',host,'loc',loc,'url',url); 
    console.log('userIp',ip,'method',method,'loc',loc);
    
    next();
};
//,checkRoleMiddleware

module.exports = consoleLogger;
