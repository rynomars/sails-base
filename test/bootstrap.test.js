var Sails = require('sails'),
    Barrels = require('barrels');

before(function (done) {
    Sails.lift({
      log: {
        level: 'error'
      },
      models: {
        connection: 'test',
        migrate: 'drop'
      }
    }, function(err) {
      if (err)
        return done(err);

      // Load fixtures
      var barrels = new Barrels();

      // Populate the DB
      barrels.populate(function(err) {
        done(err);
      });
    });
  });

after(function(done) {
  // here you can clear fixtures, etc.
  Sails.lower(done);
});
