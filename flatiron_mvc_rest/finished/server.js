var environment = require('./env')
  , users       = require('./controllers/users')
  , server      = exports
  ;

server.run = function run(cb) {
  environment.initialize(function initialize(app) {
    environment.start(app, function () {

      app.get("/hello", function () { this.res.json({hey: "all good?"}); });
      app.put("/:user", users.create);

    });
  });
};

if(require.main === module) {
  server.run();
}