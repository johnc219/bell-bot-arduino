var five = require("johnny-five");
var express = require('express');
var ngrok = require('ngrok');

var board = new five.Board();
var app = express();
var queue = [];

ngrok.settings = {
  proto: "http",
  addr: 3001
};

setInterval(function() {
  if (queue.length > 0) {
    var f = queue.shift();
    f();
  }
}, 3000);

// express route to ring bell
app.get('/ring', function(req, res) {
  var ring = function() {
    console.log("BAM");
  };
  queue.push(ring);
  // return 200 ok
  res.send("Ding!");
});

board.on("ready", function() {
  this.servo = new five.Servo({
    id: "BellbotServo",
    pin: 8,
    startAt: 85
  });

  ngrok.connect({

  }, function(err, url) {
    if (err)
      throw err;
    console.log("url: " + url);
    ngrok.url = url;
    app.listen(ngrok.settings.addr);
    console.log("listening on port: " + ngrok.settings.addr);
  });


  // Servo alternate constructor with options
  /*
  var servo = new five.Servo({
    id: "MyServo",     // User defined id
    pin: 10,           // Which pin is it attached to?
    type: "standard",  // Default: "standard". Use "continuous" for continuous rotation servos
    range: [0,180],    // Default: 0-180
    fps: 100,          // Used to calculate rate of movement between positions
    invert: false,     // Invert all specified positions
    startAt: 90,       // Immediately move to a degree
    center: true,      // overrides startAt if true and moves the servo to the center of the range
    specs: {           // Is it running at 5V or 3.3V?
      speed: five.Servo.Continuous.speeds["@5.0V"]
    }
  });
  */

  Add servo to REPL (optional)
  this.repl.inject({
    ngrok: ngrok,
    queue: queue,
    app: app
  });


  // Servo API

  // min()
  //
  // set the servo to the minimum degrees
  // defaults to 0
  //
  // eg. servo.min();

  // max()
  //
  // set the servo to the maximum degrees
  // defaults to 180
  //
  // eg. servo.max();

  // center()
  //
  // centers the servo to 90°
  //
  // servo.center();

  // to( deg )
  //
  // Moves the servo to position by degrees
  //
  // servo.to( 90 );

  // step( deg )
  //
  // step all servos by deg
  //
  // eg. array.step( -20 );

  // servo.sweep();
});