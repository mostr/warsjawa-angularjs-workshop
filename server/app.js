var express = require('express');
var http = require('http');

var app = express();

var config = require('./config');
var bootstrap = require('./bootstrap');
bootstrap.boot(app, express);

var security = require('./middlewares/security');

var db = require('./storage/db')(config);

var userRepo = require('./storage/user-repo')(db);
var restaurantRepo = require('./storage/restaurant-repo')(db);
var orderRepo = require('./storage/order-repo')(db);

var orderService = require('./services/orders-service')(orderRepo, restaurantRepo, userRepo);

require('./routes/users')(app, security, userRepo);
require('./routes/session')(app, security, userRepo);

require('./routes/restaurants')(app, security, restaurantRepo);


require('./routes/orders')(app, security, orderRepo, orderService);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Launchy listening on port ' + app.get('port'));
});