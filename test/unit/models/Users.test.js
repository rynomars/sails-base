var users = [{
    username: 'ethancairns',
    email: 'ethan@ecairns22.com',
    password: 'testing123',
    emailVerified: false
}]
describe.only('UserModel', function() {
  describe('#find()', function() {
    it('should create a user', function (done) {
      console.log('1)-------------------------------------');
      User.create(users[0]).exec(function(err, user) {
        console.log('2)-------------------------------------');
        console.log('err', err);
        console.log('user', user);
        done()
      })
    });
    it('should check find function', function (done) {
      User.findOne({username: users[0].username})
        .then(function(user) {
          // some tests
          console.log(user);
          expect(user.username, users[0].username);
          done();
        })
        .catch(done);
    });
  });
});

