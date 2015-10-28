/* globals sails */
/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
module.exports = {
    attributes: {
        username: {
            type: 'string',
            required: true,
            unique: true
        },
        email: {
            type: 'string',
            required: true,
            unique: true
        },
        password: {
            type: 'string',
            minLength: 8,
            required: true
        },
        emailVerified: {
            type: 'boolean',
            required: true
        },
        resetPasswordToken: {
            type: 'string',
            required: false,
            unique: true
        },
        profile: {
          model: 'profile'
       },
       toJSON: function() {
        var obj = this.toObject();
        delete obj.password;
        return obj;
      }
    },
    beforeCreate: function(attributes, next) {
        if (!sails.config.app.requireUsername) {
            attributes.username = attributes.email;
        }

        EncryptPasswordService(attributes.password, function(hash) {
            attributes.password = hash;
            next();
        });
    }
};

