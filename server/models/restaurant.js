var Validator = require('../lib/batch-validator');

var Restaurant = function(params) {
  var self = this;
  var properties = ['_id', 'name', 'contactNumber', 'description'];
  properties.forEach(function(prop) {
    self[prop] = params[prop];
  });
  this.reviews = params.reviews || [];
  this.menuItems = params.menuItems || [];
};

Restaurant.prototype = {
  validate: function() {
    var v = new Validator();
    v.check(this.name, 'Name cannot be empty').notEmpty();
    v.check(this.contactNumber, 'Phone number invalid').isInt();
    v.check(this.description, 'Description must be at least 20 chars long').len(20);
    return v.getErrors();
  },

  addReview: function(review) {
    var foundForAuthor = this.reviews.filter(function(r) {
      return review.author._id === r.author._id;
    });
    if(foundForAuthor.length) {
      return false;
    }
    this.reviews.push(review);
    return true;
  }
};

var Review = function(params) {
  this.stars = params.stars;
  this.author = params.author || {};
};

Review.prototype = {
  validate: function() {
    var v = new Validator();
    v.check(this.stars, 'Rate must be between 1-5').min(1).max(5);
    v.check(this.author.login, 'Author name is required').notEmpty();
    v.check(this.author._id, 'Author id is required').notEmpty();
    return v.getErrors();
  }
};

module.exports.Restaurant = Restaurant;
module.exports.Review = Review;