/* globals User, sails */
var crypto = require('crypto');
var validator = require('validator');
var async = require('async');
var fs = require('fs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports = {

    /** Forgot Password **/
    forgot: Forgot,

    /** Reset a users password **/
    reset: Reset,

    /** Validate the accounts email address. **/
    verifyEmail: EmailVerificationService.verify
};

/**
 *  Forgot password implementation
 *  @params req
 *  @params res
 */
function Forgot(req, res) {
    var username = req.body.username;

    PasswordService.forgot(username,function(err, results) {
        if (err) {
            return res
                    .status(401)
                    .send({message: err});
        } else {
            return res
                    .status(200)
                    .send({message: results});
        }
    })
}

/**
 *  Reset password implementation
 *  @params req
 *  @params res
 */
function Reset(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var token = req.body.token;

    PasswordService.reset(username, password, token, function(err, results) {
        if (err) {
            return res
                    .status(401)
                    .send({message: err});
        } else {
            return res
                    .status(200)
                    .send({message: results});
        }
    });
}

/**
 * PasswordController
 *
 * @description :: Server-side logic for managing passwords
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
