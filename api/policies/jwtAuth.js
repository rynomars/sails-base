var jwt = require('jwt-simple');

module.exports = function (req, res, next) {
    // Make sure we have headers and an authorization header before we do anything.
    if (!req.headers || !req.headers.authorization) {
        return res.status(401).send({
            message: 'Authentication failed'
        });
    }

    //Just get the payload portion and elimiate the "Bearer" text
    var token = req.headers.authorization.split(' ')[1];

    var payload = jwt.decode(token, sails.config.jwtSecretKey); // jshint ignore:line

    if (!payload.sub) {
        return res.status(401).send({
            message: 'Authentication failed'
        });
    }
    next();
};
