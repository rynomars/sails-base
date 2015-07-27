/* globals User, sails */
var bcrypt = require('bcrypt-nodejs');
var validator = require('validator');

/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * Log an existing user in and generate a jwt token that is sent back with the request.
     * The token will then be used to authenticate the user for future requests.
     */
    login: function(req, res) {
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var message = '';

        //If username is not passed, use email as the username
        if (!username) {
            username = email;
        }

        if (!(username) && !password) {
            if (sails.config.app.requireUsername) {
                message = 'username/email and password required';
            } else {
                message = 'email and password required';
            }

            return res.status(401).send({
                message: message
            });
        }

        if (sails.config.app.requireUsername && !validator.isEmail(username)) {
            User.findOneByUsername(username, validateUser);
        } else {
            User.findOneByEmail(username, validateUser);
        }

        function validateUser(err, foundUser) {
            var message = '';
            if (!foundUser) {
                if (sails.config.app.requireUsername) {
                    message = 'username/email and password is invalid';
                } else {
                    message = 'email and password is invalid';
                }

                return res.status(401).send({
                    message: message
                });
            }

            //bcrypt
            bcrypt.compare(password, foundUser.password, function(err, valid) {
                if (err) {
                    return res.status(403);
                }

                if (!valid) {
                    return res.status(401).send({
                        message: 'Username or Password invalid'
                    });
                }

                CreateSendTokenService(foundUser, res);
            });
        }
    },

    /**
     * Register a user with system a jwt token will be generate and returned with newly created user.
     */
    register: function(req, res) {
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
        var message = '';

        if ((sails.config.app.requireUsername && !username) || !email || !password) {
            if (sails.config.app.requireUsername) {
                message = 'username/email and password is required';
            } else {
                message = 'email and password is required';
            }

            return res.status(401).send({
                message: message
            });
        }
        User.findOne({
              or : [
                { username: username },
                { email: email }
          ]
        }).then(function(user) {
            if(user) {
                message = "An account already exists with this username or email";
                return res.status(401).send({
                    message: message
                });
             }

            User.create({
                username: username,
                email: email,
                password: password,
                emailVerified: false
            }).then(function (user) {
                EmailVerificationService.send(user.email);
                CreateSendTokenService(user, res);
            }).catch(function(err) {
                var message = "";
                if (err.error == "E_VALIDATION") {
                    message = "Data Validation Error!";
                } else {
                    console.log(err);
                    message = "An error occurred while trying to create account!"
                }
                return res.status(401).send({
                    message: message
                });
            });
        });
    },
    /**
     * Validate the accounts email address.
     */
    verifyEmail: EmailVerificationService.verify
};
