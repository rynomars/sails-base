/* globals User, sails */
var crypto = require('crypto');
var validator = require('validator');
var async = require('async');
var fs = require('fs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var createSendToken = require('../services/createSendToken.js');
var emailVerification = require('../services/emailVerification.js');
var password = require('../services/password.js');

/**
 * PasswordController
 *
 * @description :: Server-side logic for managing passwords
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * Forgot Password
     */
    forgot: password.forgot,

    /**
     * Reset a users password
     */
    reset: password.reset,

    /**
     * Validate the accounts email address.
     */
    verifyEmail: emailVerification.verify
};
