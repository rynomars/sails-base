/* globals sails */
var jwt = require('jwt-simple');
var fs = require('fs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var model = {
    verifyUrl: sails.config.client.domain + sails.config.app.accountVerifyUri,
    title: sails.config.app.name,
    subTitle: 'Thanks for sigining up!',
    body: 'Please confirm your email by clicking the button below.'
};

exports.send = function(email) {
    var payload = {
        sub: email
    };

    var token = jwt.encode(payload, sails.config.jwtSecretKey);

    if (!sails.config.email || !sails.config.email.transporter) return null;

    var transporter = nodemailer.createTransport(sails.config.email.transporter);

    var mailOptions = {
        from: sails.config.app.name + '<' + sails.config.email.transporter.auth.user + '>', // sender address
        to: email, // list of receivers
        subject: sails.config.app.name + ' Email Verification', // Subject line
        html: getHTML(token)
    };

    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log('Error', err);
            return err;
        } else {
            console.log('Info', info);
            return info;
        }
    });
};

exports.verify = function (req, res) {
    var token = req.query.token;
    
    if (!token) {
        res.status(400).send({
            message: 'Invalid token provided'
        });
    }

    var payload = jwt.decode(token, sails.config.jwtSecretKey);
    var email = payload.sub;

    if (!email) {
        return res.status(401).send({
            message: 'Authentication failed, unable to verify email.'
        });
    }

    User.findOneByEmail(email, function(err, foundUser) {
        if (err) {
            return res.status(500);
        }

        if (!foundUser) {
            return res.status(401).send({
                message: 'Authentication failed, unable to verify email.'
            });
        }

        if (!foundUser.emailVerified) {
            foundUser.emailVerified = true;
            foundUser.save(function(err) {
                if (err) {
                    return res.status(500);
                }
            });
        }

        return createSendToken(foundUser, res);
    });
};

function getHTML(token) {
    var path = './views/user/verifyEmail.html';
    var encoding = 'utf8';
    /* If used in production, you should use an async method to get and open the file */
    var html = fs.readFileSync(path, encoding);

    var template = _.template(html);

    model.verifyUrl += token;
    

    return template(model);
}

_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};
