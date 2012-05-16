var environment = require('./env')
  , server      = exports
  , io
  ;

server.run = function run() {
  environment.initialize(function initialize(app) {
    environment.start(app, function (io) {
      var sockets = {}
        , free    = []
        , paired  = {}
        ;

      function pair(nickname) {
        var remote = free.pop()
          , socket = sockets[nickname]
          ;
        if (remote && remote !== nickname) {
          app.log.info('remove ' + remote + ' from the queue');
          var remoteSocket = sockets[remote];
          if(!remoteSocket) { // disconnected
            return process.nextTick(function () { pair(nickname); });
          }
          remoteSocket.on('frame', function emitFrameToPairRemote(frame) {
            socket.volatile.emit('drawFrame', frame);
          });
          socket.on('frame', function emitDrawFrameClient(frame) {
            remoteSocket.volatile.emit('drawFrame', frame);
          });
          paired[nickname] = remote;
          paired[remote]   = nickname;
          app.log.info('paired ' + nickname + ' with ' + remote + '.');
          socket.emit('paired');
          remoteSocket.emit('paired');
        } else {
          app.log.info('added ' + nickname + ' to the queue');
          free.push(nickname);
        }
      }

      function next(nickname, disconnected) {
        var remote = paired[nickname]
          , socket = sockets[nickname]
          ;
        delete paired[nickname];
        app.log.info('listeners removed for ' + nickname);
        socket.removeAllListeners('frame');
        socket.emit('unpaired');
        if(!disconnected) {
          pair(nickname);
        }
        if(remote) {
          delete paired[remote];
          var remoteSocket = sockets[remote];
          app.log.info('listeners removed for ' + remote);
          remoteSocket.removeAllListeners('frame');
          remoteSocket.emit('unpaired');
          pair(remote);
        }
      }

      io.sockets.on('connection', function handleConnection(client) {

        client.on('connect', function connect(nickname) {
          if(!nickname) {
            return client.emit('usernameExists');
          }
          client.set('nickname', nickname, function setNickname(err) {
            if(err || sockets[nickname]) {
              return client.emit('usernameExists');
            }
            sockets[nickname] = client;
            app.log.info(nickname + ' connected');
            pair(nickname);
          });
        });

        client.on('disconnect', function disconnect() {
          client.get('nickname', function getByNickname(err, nickname) {
            if(nickname) {
              app.log.info(nickname + ' disconnected');
              next(nickname, true);
              delete sockets[nickname];
            }
          });
        });

        client.on('next', function () {
          client.get('nickname', function getByNicknameOnNext(err, nickname) {
            if(nickname) {
              next(nickname, false);
            }
          });
        });

      });

    });
  });
};

if(require.main === module) {
  server.run();
}