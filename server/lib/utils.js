module.exports.routes = {

  sendOk: function(res, data) {
    res.send(200, data);
  },

  sendNotFound: function(res, msg) {
    this.sendError(res, 404, msg);
  },

  sendError: function(res, status, msg) {
    res.send(status, {err: msg});
  }

}