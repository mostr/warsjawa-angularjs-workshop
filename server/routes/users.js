var User = require('../models/user');

module.exports = function(app, security, userRepo) {

  function buildUser(req, res, next) {
    var user = new User(req.body);
    var errors = user.validate();
    if(errors.length) {
      return res.send(400, {err: errors});
    }
    req.user = user;
    next();
  }

  app.get('/users', function(req, res) {
    userRepo.findAll(function(err, all) {
      if(err) return res.send(400, {err: err});
      res.send(200, all);
    });
  });

  app.post('/users', buildUser, function(req, res) {
    userRepo.save(req.user, function(err, created) {
      if(err) return res.send(400, {err: err});
      res.send(200, {user: created});
    });
  });

};