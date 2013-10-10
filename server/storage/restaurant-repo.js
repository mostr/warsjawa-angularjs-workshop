var Restaurant = require('../models/restaurant').Restaurant;

var RestaurantRepository = function(db) {

  this.findById = function(id, callback) {
    db.restaurants.findOne({_id: id}, function(err, found) {
      if(err) return callback(err);
      if(!found) return callback(null, found);
      callback(null, new Restaurant(found));
    });
  };

  this.findAll = function(callback) {
    db.restaurants.find({}, function(err, all) {
      if(err) return callback(err);
      var restaurants = all.map(function(r) {
        return new Restaurant(r);
      });
      callback(null, restaurants);
    });
  };

  this.save = function(restaurant, callback) {
    db.restaurants.insert(restaurant, function(err, created) {
      if(err) return callback(err);
      callback(null, new Restaurant(created));
    });
  };

  this.update = function(restaurant, callback) {
    db.restaurants.update({_id: restaurant._id}, restaurant, function(err) {
      if(err) return callback(err);
      callback(null, restaurant);
    });
  };

};

module.exports = function(db) {
  return new RestaurantRepository(db);
};