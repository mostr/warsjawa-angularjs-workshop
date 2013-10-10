var Validator = require('../lib/batch-validator');

var User = function(params) {
  this._id = params._id;
  this.login = params.login;
  this.realName = params.realName;
  this.password = 'secret';
};

User.prototype = {

  validate: function() {
    v = new Validator();
    v.check(this.login, 'Login is required').notEmpty();
    v.check(this.realName, 'Real name is required').notEmpty();
    return v.getErrors();
  }

};

User.toView = function(src) {
  var jsoned = JSON.parse(JSON.stringify(src));
  var secure = new User(jsoned);
  delete secure.password;
  return secure;
};

module.exports = User;