var User = require('../models/user');

var UserRepository = function(db) {

  this.save = function(user, callback) {
    db.users.insert(user, function(err, created) {
      if(err) return callback('Login already taken');
      callback(null, User.toView(created));
    });
  };

  this.findAll = function(callback) {
    db.users.find({}, function(err, all) {
      if(err) return callback(err);
      var users = all.map(function(u) {
        return User.toView(new User(u));
      });
      callback(null, users);
    });
  };

  this.findById = function(id, callback) {
    db.users.findOne({_id: id}, function(err, found) {
      if(err) return callback(err);
      if(!found) return callback(new Error('Cannot find user'));
      callback(null, User.toView(found));
    });
  };

  this.findByLoginAndPassword = function(login, password, callback) {
    db.users.findOne({login: login, password: password}, function(err, found) {
      if(err) return callback(err);
      if(!found) return callback('No such user');
      callback(null, User.toView(found));
    });
  };

};

module.exports = function(db) {
  return new UserRepository(db);
};