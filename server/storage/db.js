var Database = require('nedb');

module.exports = function(config) {

  var dir = config.storageDir;

  var db = {
    users: new Database({filename: dir + '/users.txt', autoload: true}),
    restaurants: new Database({filename: dir + '/restaurants.txt', autoload: true}),
    orders: new Database({filename: dir + '/orders.txt', autoload: true})
  };

  db.users.ensureIndex({fieldName: 'login', unique: true});

  return db;

};