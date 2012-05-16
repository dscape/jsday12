var flatiron     = require('flatiron')
  , ecstatic     = require('ecstatic')
  , socketio     = require('socket.io')
  , app          = flatiron.app
  , environment  = exports
  ;

environment.initialize = function initialize(callback) {
  app.use(flatiron.plugins.http, 
    { "before" : [ ecstatic(__dirname + '/public') ] });

  app.get       = app.router.get;
  app.put       = app.router.put;
  app.post      = app.router.post;
  app["delete"] = app.router["delete"];

  callback(app);
};

environment.start = function start(app, cb) {
  app.start(3001, function () {
    io = socketio.listen(app.server);
    io.set('log level', 0);
    console.log({"helloworld": "ok", "port": 3001});
    cb(io);
  });
};
