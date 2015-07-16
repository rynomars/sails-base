var jwt = require('jwt-simple');
var m = require('moment');

module.exports = function (user, res) {
    var payload = {
        sub: user.id,
        exp: m().add(10, 'days').unix()
    };

    var token = jwt.encode(payload, sails.config.jwtSecretKey); // jshint ignore:line
    delete user.password;

    res.status(200).send({
        user: user.toJSON(),
        token: token
    });
};
