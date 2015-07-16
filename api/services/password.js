/* globals User, sails */
var crypto = require('crypto');
var validator = require('validator');
var fs = require('fs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

/**
 * password service
 *
 */
module.exports.forgot = function(req, res) {
    var username = req.body.username;
    var message = '';

    if (!(username)) {
        if (sails.config.app.requireUsername) {
            err ='username/email is required to reset password';
        } else {
            err = 'email is required to reset password';
        }
        return handleErr(res, err);
    }

    if (sails.config.app.requireUsername && !validator.isEmail(username)) {
        User.findOneByUsername(username, processUser);
    } else {
        User.findOneByEmail(username, processUser);
    }

    /** **/
    function processUser(err, user) {
        if (err) {
            return handleErr(res, 'Unable to retrieve user.');
        }
        if (!user) {
            return handleErr(res, 'Ther user was not found.');
        }
        createToken(user);
        return res.status(200).send({message: 'Request completed'});
    }

    /** **/
    function createToken(user) {

        crypto.randomBytes(20, function(err, buf) {
            if(err) {
                return;
            }
            var token = buf.toString('hex');
            saveUser(user, token);
        });
    }


    /** **/
    function saveUser(user, token) {
        console.log('saveUser');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err, user) {
            sendEmail(user, token);
        });
    }

    /** **/
    function sendEmail(user, token) {
        console.log('sendEmail');
        var transporter = nodemailer.createTransport(sails.config.email.transporter);

        var mailOptions = { 
            from: sails.config.app.name + '<' + sails.config.email.transporter.auth.user + '>', // sender address
            to: user.email, // list of receivers
            subject: 'Reset your ' + sails.config.app.name + ' password', // Subject line
            html: getHTML(token)
        }; 

        transporter.sendMail(mailOptions, function(err, info) { });

        function getHTML(token) {
            var path = './views/user/resetPassword.html';
            var encoding = 'utf8';
            /* If used in production, you should use an async method to get and open the file */
            var html = fs.readFileSync(path, encoding);
            var template = _.template(html);
            var model = {
                resetUrl: sails.config.client.domain + sails.config.app.resetPasswordUri,
                title: sails.config.app.name,
                subTitle: 'Reset your password!',
                body: 'Please follow the link below to reset your password.'
            };

            model.resetUrl += token;

            return template(model);
        }
    }
};

module.exports.reset = function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var token = req.body.token;
    var message = '';

    if ( !username || !password || !token ) {
        if (sails.config.app.requireUsername) {
            err = 'username/email, password and reset token is required';
        } else {
            err = 'email, password and reset token is required';
        }
        return handleErr(res, err);
    }

    if (sails.config.app.requireUsername && !validator.isEmail(username)) {
        User.findOneByUsername(username, processUserToken);
    } else {
        User.findOneByEmail(username, processUserToken); 
    }


    /** **/
    function processUserToken(err, user) {
        if (err) {
            return handleErr(res, 'Unable to retrieve user.');
        }
        if (!user) {
            return handleErr(res, 'The user was not found');
        }
        if (user.resetPasswordToken != token || user.resetPasswordExpires < Date.now()) {
            return handleErr(res, 'The reset token provided is invalid.');
        }
        getHash(user);
        return res.status(200).send({message: 'Password has been reset'});
    }

    /** **/
    function getHash(user) {
        encryptPassword(password, function(hash) {
            user.password = hash;
            saveUser(user);
        });
    }

    /** **/
    function saveUser(user) {
        user.resetPasswordToken = '';
        user.resetPasswordExpires = '';

        user.save(function(err, user) { });
    }
};

function handleErr(res, err) {
    return res.status(401).send({message: err});
}
