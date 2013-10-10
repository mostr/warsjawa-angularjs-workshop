var Restaurant = require('../models/restaurant').Restaurant;
var Review = require('../models/restaurant').Review;

module.exports = function(app, security, restaurantRepo) {

  function buildRestaurant(req, res, next) {
    var restaurant = new Restaurant(req.body);
    var errors = restaurant.validate();
    if(errors.length) {
      return res.send(400, {err: errors});
    }
    req.restaurant = restaurant;
    next();
  }

  function loadRestaurant(req, res, next) {
    restaurantRepo.findById(req.params.restaurantId, function(err, found) {
      if(err) return res.send(400, {err: err.message});
      if(!found) return res.send(404, {err: 'Cannot find restaurant'});
      req.restaurant = found;
      next();
    });
  }

  function buildReview(req, res, next) {
    var review = new Review(req.body);
    review.author = req.session.user;
    var errors = review.validate();
    if(errors.length) {
      return res.send(400, {err: errors});
    }
    req.review = review;
    next();
  }

  app.get('/restaurants', function(req, res) {
    restaurantRepo.findAll(function(err, all) {
      if(err) return res.send(400, {err: err.message});
      res.send(200, {restaurants: all});
    });
  });

  app.get('/restaurants/:restaurantId', loadRestaurant, function(req, res) {
    res.send(200, {restaurant: req.restaurant});
  });

  app.post('/restaurants', security.requiresLogin, buildRestaurant, function(req, res) {
    restaurantRepo.save(req.restaurant, function(err, created) {
      if(err) return res.send(400, {err: err.message});
      res.send(200, created);
    });
  });

  app.post('/restaurants/:restaurantId/reviews', security.requiresLogin, loadRestaurant, buildReview, function(req, res) {
    if(req.restaurant.addReview(req.review)){
      return restaurantRepo.update(req.restaurant, function(err) {
        if(err) return res.send(400, {err: err.message});
        res.send(200, req.restaurant);
      });
    } else {
      res.send(400, {err: 'Could not add review to restaurant'});
    }
  });

};
