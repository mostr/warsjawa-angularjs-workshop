var Order = require('../models/order').Order;
var OrderItem = require('../models/order').OrderItem;

var async = require('async');

var OrderView = function(order) {
  this._id = order._id;
  this.status = order.status;
};

var OrderItemView = function(item) {
  this.name = item.name;
  this.price = item.price;
};


module.exports = function(orderRepo, restaurantRepo, userRepo, Order) {

  function createOrder(order, callback) {

    function checkRestaurantExists(restaurantId, callback) {
      findRestaurant(restaurantId, function(err, restaurant) {
        if(!restaurant) return callback(new Error('Restaurant not found'));
        callback(null);
      });
    }

    function checkUserHasNoOrderInRestaurant(userId, restaurantId, callback) {
      orderRepo.findByOwner(userId, function(err, userOrders) {
        if(err) return callback(err);
        if(userOrders && userOrders.length) {
          var existingOrders = userOrders.filter(function(order) {
            return order.restaurantId === restaurantId && order.isOpen();
          });
          if(existingOrders.length) return callback(new Error('User has already placed order in this restaurant'));
        }
        callback(null);
      });
    }

    function saveOrder(order, callback) {
      orderRepo.save(order, callback);
    }

    var steps = [
      async.apply(checkRestaurantExists, order.restaurantId),
      async.apply(checkUserHasNoOrderInRestaurant, order.ownerId, order.restaurantId),
      async.apply(saveOrder, order)
    ];
    async.waterfall(steps, callback);
  }

  function closeOrder(userId, orderId, callback) {

    function getUserOrderIfOpen(userId, orderId, callback) {
      orderRepo.findOpen(orderId, function(err, openOrder) {
        if(err) return callback(err);
        if(openOrder.ownerId !== userId) {
          return callback(new Error('User is not order owner'));
        }
        callback(null, openOrder);
      });
    }

    function changeOrderStatusToClosed(orderToClose, callback) {
      orderToClose.close();
      orderRepo.update(orderToClose, callback);
    }

    var steps = [
      async.apply(getUserOrderIfOpen, userId, orderId),
      changeOrderStatusToClosed
    ];
    async.waterfall(steps, callback);
  }

  function findOrdersWithDetails(callback) {
    async.waterfall([findAllOrders, mapOrdersToViews], callback);
  }



  function findAllOrders(callback) {
    orderRepo.findAll(callback);
  }

  function mapOrdersToViews(orders, callback) {
    async.map(orders, createSingleOrderView, callback);
  }

  function createSingleOrderView(order, callback) {

    function buildSingleOrderViewFromComponents(order, results) {
      var orderView = new OrderView(order);
      orderView.restaurant = results[0];
      orderView.owner = results[1];
      orderView.items = results[2];
      return orderView;
    }

    var steps = [
      async.apply(findRestaurant, order.restaurantId),
      async.apply(findOwner, order.ownerId),
      async.apply(buildItemsViews, order.items)
    ];
    async.parallel(steps, function(err, results) {
      if(err) return callback(err);
      var view = buildSingleOrderViewFromComponents(order, results);
      callback(null, view);
    });
  }

  function findRestaurant(restaurantId, callback) {
    restaurantRepo.findById(restaurantId, callback);
  }

  function findOwner(ownerId, callback) {
    userRepo.findById(ownerId, callback);
  }

  function buildItemsViews(items, callback) {
    async.map(items, buildSingleItemView, callback);
  }

  function buildSingleItemView(item, callback) {
    userRepo.findById(item.ownerId, function(err, user) {
      if(err) return callback(err);
      var itemView = new OrderItemView(item);
      itemView.owner = user;
      callback(null, itemView);
    });
  }

  return {
    findOrdersWithDetails: findOrdersWithDetails,
    createOrder: createOrder,
    closeOrder: closeOrder
  };

};