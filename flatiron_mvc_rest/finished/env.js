var flatiron     = require('flatiron')
  , ecstatic     = require('ecstatic')
  , config       = require('./cfg')
  , uuid         = require('./middleware/uuid')
  , api_version  = require('./middleware/api-version')
  , app          = flatiron.app
  , environment  = exports
  ;

environment.initialize = function initialize(cb) {
  app.use(flatiron.plugins.http, 
    { "before" : 
      [ api_version
      , uuid
      , ecstatic(__dirname + '/public')
      ] 
    });

  // these shortcuts should get added to flatiron soon
  // but serve as a good example of something you can 
  // do in the initialize step
  app.get       = app.router.get;
  app.put       = app.router.put;
  app.post      = app.router.post;
  app["delete"] = app.router["delete"];

  cb(app);
};

environment.start = function start(app, cb) {
  cb = cb || function () { app.log.info('started'); };
  app.start(config.www.port, function () {
    app.log.info("app is running on " + config.www.port);
    cb();
  });
};