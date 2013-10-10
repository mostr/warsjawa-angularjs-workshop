module.exports.requiresLogin = function(req, res, next) {
  if(req.session.user) {
    next();
  } else {
    res.send(401, {err: 'User not authenticated'});
  }
};
