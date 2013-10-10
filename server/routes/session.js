var User = require('../models/user');

module.exports = function(app, security, userRepo) {

  app.post('/session', function(req, res) {
    var login = req.param('login');
    var pass = req.param('password');
    userRepo.findByLoginAndPassword(login, pass, function(err, authUser) {
      if(err) res.send(401, {err: 'Invalid credentials'});
      req.session.regenerate(function() {
        req.session.user = authUser;
        res.send(authUser);
      });
    });
  });

  app.delete('/session', security.requiresLogin, function(req, res) {
    req.session.destroy(function() {
      res.send(200);
    });
  });

  app.get('/session', security.requiresLogin, function(req, res) {
    res.send(200, req.session.user);
  });

};