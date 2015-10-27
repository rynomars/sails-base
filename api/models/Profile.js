/* globals sails */
/**
* Profile.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
module.exports = {
    attributes: {
        name: {
            type: 'string',
            required: true,
            unique: false
        },
        bio: {
            type: 'string',
            required: false,
            unique: false
        },
        local: {
            type: 'string',
            required: false,
            unique: false
        },
        url: {
            type: 'string',
            required: false,
            unique: false
        },
        user: {
          model: 'user',
          required: true,
          unique: true
        }
    },
    // Lifecycle Callbacks
    afterCreate: function (values, cb) {
    }
};

