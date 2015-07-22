var assert = require('assert');

var users = [
    {
        username: 'ethancairns',
        email: 'ethan@ecairns22.com',
        password: 'testing123',
        emailVerified: false
    },
    {
        username: 'rynomars',
        email: 'rynomars@ecairns22.com',
        password: 'testing123',
        emailVerified: true
    }
]

describe.only('UserModel', function() {
  describe('#create()', function() {
    it('should create users', function (done) {
      User.create(users).exec(function(err, users) {
        assert.equal(users.length, 2);
        assert.equal((users[0].id>0), true);
        assert.equal((users[1].id>0), true);
        done()
      })
    });
  });
  describe('#find', function() {
    it('should find two users', function (done) {
      User.find()
        .then(function(users) {
          // some tests
          assert.equal(users.length, 2);
          done();
        })
        .catch(done);
    });
  });
  describe('#findOneByUsername()', function() {
    it('should check find function', function (done) {
      User.findOneByUsername( users[0].username )
        .then(function(user) {
          // some tests
          assert.equal(user.username, users[0].username);
          done();
        })
        .catch(done);
    });
  });
  describe('#updateUsernameNonUnique()', function() {
    it('should not allow username to be changed to a non unique', function (done) {
      User.update({username: users[0].username}, {username: users[1].username})
        .then(function(updates) {
          // some tests
          assert.fail(updates[0].username, users[0].username, 'Username changed to one that already exists');
          done();
        })
        .catch(function(err) {
            assert.equal(err.ValidationError.username[0].value, users[1].username);
            done();
        });
    });
  });
});

