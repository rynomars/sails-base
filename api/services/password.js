/* globals User, sails */
var crypto = require('crypto');
var validator = require('validator');
var fs = require('fs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

/**
 * Password Service Interface
 */
module.exports = {
    forgot: Forgot,
    reset: Reset
}

/** ************************ **/
/**      Implementation      **/
/** ************************ **/

/**
 *  Forgot password implementation
 *  @param string username
 *  @param function done
 */
function Forgot(username, done) {
    if (!username) {
        err = (sails.config.app.requireUsername)?
                    'username/email is required to reset password':
                    'email is required to reset password';

        return done(err);
    }

    if (sails.config.app.requireUsername && !validator.isEmail(username)) {
        User.findOneByUsername(username, processUser);
    } else {
        User.findOneByEmail(username, processUser);
    }

    /**
     *  Process User
     **/
    function processUser(err, user) {
        if (err) {
            return done('Unable to retrieve user.');
        }
        if (!user) {
            return done('Ther user was not found.');
        }

        createToken(user);

        done(null, 'Request completed');
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

/**
 *  Reset password using a token
 *  @param string username
 *  @param string password
 *  @param string token
 *  @param function done
 *
 */
function Reset(username, password, token, done) {
    if ( !username || !password || !token ) {
        if (sails.config.app.requireUsername) {
            err = 'username/email, password and reset token is required';
        } else {
            err = 'email, password and reset token is required';
        }

        return done(err);
    }

    if (sails.config.app.requireUsername && !validator.isEmail(username)) {
        User.findOneByUsername(username, processUserToken);
    } else {
        User.findOneByEmail(username, processUserToken); 
    }

    /** **/
    function processUserToken(err, user) {
        if (err) {
            return done('Unable to retrieve user.');
        }
        if (!user) {
            return done('The user was not found');
        }
        if (user.resetPasswordToken != token || user.resetPasswordExpires < Date.now()) {
            return done('The reset token provided is invalid.');
        }
        getHash(user);

        return done(null, 'Password has been reset');
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
}
