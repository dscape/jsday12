var environment = require('./env')
  , server      = exports
  , io
  ;

server.run = function run() {
  environment.initialize(function initialize(app) {
    environment.start(app, function (io) {

      io.sockets.on('connection', function(client) {});

    });
  });
};

if(require.main === module) {
  server.run();
}