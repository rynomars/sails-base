'use strict';

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon');

describe('UserModel', function() {
  describe('Attributes', function() {

    describe('username', function() {
      it('should have the correct attributes', function () {
        expect(User.attributes.username).to.exist;
        expect(User.attributes.username.required).to.be.true;
        expect(User.attributes.username.type).to.be.equal('string');
        expect(User.attributes.username.unique).to.be.true;
      });
    });

    describe('email', function() {
      it('should have the correct attributes', function () {
        expect(User.attributes.email).to.exist;
        expect(User.attributes.email.required).to.be.true;
        expect(User.attributes.email.type).to.be.equal('string');
        expect(User.attributes.email.unique).to.be.true;
      });
    });

    describe('password', function() {
      it('should have the correct attributes', function () {
        expect(User.attributes.password).to.exist;
        expect(User.attributes.password.required).to.be.true;
        expect(User.attributes.password.type).to.be.equal('string');
        expect(User.attributes.password.minLength).to.be.equal(8);
      });
    });
      
    describe('emailVerified', function() {
      it('should have the correct attributes', function () {
        expect(User.attributes.emailVerified).to.exist;
        expect(User.attributes.emailVerified.required).to.be.true;
        expect(User.attributes.emailVerified.type).to.be.equal('boolean');
      });
    });

    describe('resetPasswordToken', function() {
      it('should have the correct attributes', function () {
        expect(User.attributes.resetPasswordToken).to.exist;
        expect(User.attributes.resetPasswordToken.required).to.be.false;
        expect(User.attributes.resetPasswordToken.type).to.be.equal('string');
        expect(User.attributes.resetPasswordToken.unique).to.be.true;
      });
    });

    it.skip('should remove the password attribute when sent to Json', function () {
    });
  });

  describe('BeforeCreate', function() {
    var sandbox, MockSails;

    beforeEach(function() {
      sandbox = sinon.sandbox.create();

      MockSails = {
        config: {
          app: {
            requireUsername: false
          }
        }
      };
    });

    afterEach(function() {
      sandbox.restore();
    });

    it('should set the username equal to emal if config requireUsername is not true', function (done) {
      var attributes = {
          username: '', 
          email: 'test@mail.com', 
          password: 'junkpassword'
      };
      
      sails.config.app.requireUsername = false;


      var spyEncryptPasswordService = sandbox.spy(EncryptPasswordService);

      User.beforeCreate(attributes, function() {
        expect(spyEncryptPasswordService.called).to.be.true;
        done();
      });

      expect(attributes.username).to.be.equal(attributes.email);

    });

    it('should encrypt the password', function () {
    });
  });
});

