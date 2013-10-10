var Order = require('../models/order').Order;
var OrderItem = require('../models/order').OrderItem;

module.exports = function(app, security, orderRepo, orderService) {

  function buildNewOrderToCreate(req, res, next) {
    var order = new Order(req.body);
    order.ownerId = req.session.user._id;
    order.items.forEach(function(item) {
      item.ownerId = req.session.user._id;
    });
    var errors = order.validate();
    if(errors.length) {
      return res.send(400, {err: errors});
    }
    req.order = order;
    next();
  }

  function fetchOpenOrder(req, res, next) {
    var order = orderRepo.findOpen(req.params.orderId, function(err, openOrder) {
      if(err) return res.send(400, {err: err.message});
      if(!openOrder) return res.send(404, {err: 'Could not find open order'});
      req.order = openOrder;
      next();
    });
  }

  function buildNewOrderItem(req, res, next) {
    var item = new OrderItem(req.body);
    item.ownerId = req.session.user._id;
    var errors = item.validate();
    if(errors.length) {
      return res.send(400, {err: errors});
    }
    req.orderItem = item;
    next();
  }

  app.post('/orders', security.requiresLogin, buildNewOrderToCreate, function(req, res) {
    orderService.createOrder(req.order, function(err, order) {
      if(err) return res.send(400, {err: err.message});
      res.send(200, {order: order});
    });
  });

  app.get('/orders', function(req, res) {
    orderService.findOrdersWithDetails(function(err, all) {
      if(err) return res.send(400, {err: err.message});
      res.send(200, {orders: all});
    });
  });

  app.put('/orders/:orderId/close', security.requiresLogin, fetchOpenOrder, function(req, res) {
    orderService.closeOrder(req.session.user._id, req.order._id, function(err, closedOrder) {
      if(err) return res.send(400, {err: err.message});
      res.send(200, {order: closedOrder});
    });
  });

  app.post('/orders/:orderId/items', security.requiresLogin, fetchOpenOrder, buildNewOrderItem, function(req, res) {
    var item = req.orderItem;
    var order = req.order;
    order.items.push(item);
    orderRepo.update(order, function(err, updated) {
      if(err) return res.send(400, {err: err.message});
      res.send(200, {order: updated});
    });
  });

};