var bcrypt = require('bcrypt-nodejs');

module.exports = function (password, next) {
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(password, salt, null, function(err, hash) {
            if(err) return next(err);
            next(hash);
        })  
    })  
};
