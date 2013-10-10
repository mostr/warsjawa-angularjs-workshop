module.exports.boot = function(app, express) {

  app.set('port', process.env.PORT || 3000);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('lunchy'));
  app.use(express.session());
  app.use('/api', app.router);
  app.use(express.static(__dirname + '/../public'));

  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }

};