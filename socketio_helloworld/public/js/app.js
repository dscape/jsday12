(function () {

 var socket   = io.connect();

  function saySomething () {
    socket.emit('msg', prompt('Say what?'));
  }

  socket.on('msg', function (text) {
    $('#panel').append('<p>' + text + '</p>');
  });

  $(function() {
    $('body').click(function () { saySomething(); });
  });

})();
