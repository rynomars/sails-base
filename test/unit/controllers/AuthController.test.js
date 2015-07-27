var request = require('supertest');
var assert = require('assert');

var token = '';

describe('AuthController', function() {
  describe('#auth()', function() {
    it('should get status 401 Unauthorized', function (done) {
      var prefix = sails.config.blueprints.prefix;

      request(sails.hooks.http.app)
        .post( prefix + '/auth/login')
        .send({ email: 'ethan@ecairns22.com', password: 'thisisabadpassword' })
        .expect(401)
        .end(function(err, res){
            if (err) throw err;
            done();
        });
    });
    it('should get status 200, return body with user and token', function (done) {
      var prefix = sails.config.blueprints.prefix;

      request(sails.hooks.http.app)
        .post( prefix + '/auth/login')
        .send({ email: 'ethan@ecairns22.com', password: 'testing123' })
        .expect(200)
        .end(function(err, res){
            if (err) throw err;

            assert(res.body.user.id, 1);
            assert(res.body.token.length > 0, true);

            //save token
            token = res.body.token;
            done();
        });
    });
  });

});
