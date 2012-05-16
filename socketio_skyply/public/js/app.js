(function () {

  if (!window.unprefix.supported.getUserMedia) {
    throw new Error('Y U NO WEBRTC!? I CAN HAZ CHROME CANARY?');
  }

  $(function() {
    var video   = document.getElementById('webcam');

    navigator.getUserMedia({ video: true, audio: true }, 
      function( raw, stream ) {
        video.src = stream && stream || raw;
        video.addEventListener('error', function () {
          stream.stop();
        });
    });

  });
})();
