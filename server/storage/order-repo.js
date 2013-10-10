var Order = require('../models/order').Order;

var OrderRepository = function(db) {

  this.save = function(order, callback) {
    db.orders.insert(order, function(err, created) {
      if(err) return callback(err);
      callback(null, new Order(created));
    });
  };

  this.update = function(order, callback) {
    db.orders.update({_id: order._id}, order, function(err, created) {
      if(err) return callback(err);
      callback(null, order);
    });
  };

  this.findOpen = function(orderId, callback) {
    db.orders.findOne({_id: orderId, status: 'OPEN'}, function(err, order) {
      if(err) return callback(err);
      if(!order) return callback(new Error('No such order'));
      callback(null, new Order(order));
    });
  };

  this.findByOwner = function(ownerId, callback) {
    db.orders.find({ownerId: ownerId}, function(err, userOrders) {
      if(err) return callback(err);
      var orders = userOrders.map(function(order) {
        return new Order(order);
      });
      callback(null, orders);
    });
  };

  this.findAll = function(callback) {
    db.orders.find({}, function(err, all) {
      if(err) return callback(err);
      var orders = all.map(function(o) {
        return new Order(o);
      });
      callback(null, orders);
    });
  };

};

module.exports = function(db) {
  return new OrderRepository(db);
};