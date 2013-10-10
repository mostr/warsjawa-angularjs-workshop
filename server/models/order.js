var Validator = require('../lib/batch-validator');
var moment = require('moment');

var Order = function(params) {
  this._id = params._id;
  this.restaurantId = params.restaurantId;
  this.ownerId = params.ownerId;
  this.status = params.status || 'OPEN';
  this.items = (params.items || []).map(function(item) {
    return new OrderItem(item);
  });
};

Order.prototype = {

  isOpen: function() {
    return this.status === 'OPEN';
  },

  close: function() {
    this.status = 'CLOSED';
  },

  validate: function() {
    var v = new Validator();
    v.check(this.restaurantId, 'Restaurant ID is required').notEmpty();
    v.check(this.ownerId, 'Owner ID is required').notEmpty();
    v.check(this.status, 'Invalid status').isIn(['OPEN', 'CLOSED', 'DELIVERED']);
    if(validateItems(this.items).length) {
      v.error('Order items are invalid');
    }

    function validateItems(items) {
      var errors = [];
      items.forEach(function(item) {
        Array.prototype.push.apply(errors, item.validate());
      });
      return errors;
    }

    return v.getErrors();
  }
};

var OrderItem = function(params) {
  this.ownerId = params.ownerId;
  this.name = params.name;
  this.price = params.price;
};

OrderItem.prototype = {
  validate: function() {
    var v = new Validator();
    v.check(this.ownerId, 'Owner ID is required').notEmpty();
    v.check(this.name, 'Course name is required').notEmpty();
    v.check(this.price, 'Numeric price is required').isInt().min(1);
    return v.getErrors();
  }
};

module.exports.Order = Order;
module.exports.OrderItem = OrderItem;