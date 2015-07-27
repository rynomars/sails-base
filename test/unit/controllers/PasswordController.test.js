var request = require('supertest');
var assert = require('assert');

var token = '';

describe('PasswordController', function() {
  describe('#forgot()', function() {
    it('should get 200 "Request completed"', function (done) {
      var prefix = sails.config.blueprints.prefix;

      request(sails.hooks.http.app)
        .post( prefix + '/password/forgot')
        .send({username: 'ethancairns'})
        .expect(200)
        .end(function(err, res){
            if (err) throw err;

            assert.equal(res.body.message, 'Request completed');
            done();
        });
    });
    it('resetPasswordExpires should be reset to now', function (done) {
      var prefix = sails.config.blueprints.prefix;

      User.findOneByUsername('ethancairns')
        .then(function(user) {
          // some tests
          var now = new Date().getTime();
          assert.equal(now - user.resetPasswordExpires < 5000, true);
          token = user.resetPasswordToken;
          done();
        });
    });
    it('password should be reset to testisfun', function (done) {
      var prefix = sails.config.blueprints.prefix;

      request(sails.hooks.http.app)
        .post( prefix + '/password/reset')
        .send({username: 'ethancairns', token: token, password: 'testingisfun'})
        .expect(200)
        .end(function(err, res){
            if (err) throw err;

            assert.equal(res.body.message, 'Password has been reset');
            done();
        });
    });
    it('should login with new password', function (done) {
      var prefix = sails.config.blueprints.prefix;

      request(sails.hooks.http.app)
        .post( prefix + '/auth/login')
        .send({username: 'ethancairns', password: 'testingisfun'})
        .expect(200)
        .end(function(err, res){
            if (err) throw err;

            assert.equal(res.body.token.length > 0, true);
            done();
        });
    });
  });

});
