// installed npm modules
var five = require('johnny-five');
var express = require('express');
var bodyParser = require('body-parser');
var ngrok = require('ngrok');

// custom modules
var ServoController = require('./servo_controller').ServoController;
var BELLBOT = require('./config');

// create a new johnny-five board and new express app
var board = new five.Board();
var app = express();

// augment ring fuction to Servo instances
five.Servo.prototype.ring = function(opts) {
  var strike = BELLBOT.strikeAt;
  var reset  = BELLBOT.startAt;
  var delay  = BELLBOT.servoDelay;

  this.to(strike);
  that = this;
  setTimeout(function() {
    that.to(reset);
  }, delay);
};

// set up express route to receive ring requests
app.use(bodyParser.json());
app.post('/ring', function(req, res) {
  console.log("ring request received");
  var key = req.body && req.body.key || req.body.token;
  if (BELLBOT.key && BELLBOT.key !== key) {
    res.sendStatus(401);
    return;
  }
  var ringCmd = {
    obj: board.servo,
    method: 'ring',
    args: null
  }
  board.servoController.exec(ringCmd, function() {
    console.log('ring command processed');
  });
  res.sendStatus(200);
});

// when the johnny-five board is ready...
board.on('ready', function() {
  
  // create a Servo object
  this.servo = new five.Servo({
    id: 'BellbotServo',
    pin: BELLBOT.servoPin,
    startAt: BELLBOT.startAt,
  });
  
  // create a ServoController object
  this.servoController = new ServoController(BELLBOT.processDelay);
  
  // establish an ngrok connection
  ngrok.connect({
    proto: BELLBOT.proto,
    addr: BELLBOT.addr
  }, function(err, url) {
    if (err)
      throw err;

    BELLBOT.url = url;
    console.log('ngrok url: ' + url);
    app.listen(BELLBOT.addr);
    console.log('express listening on port: ' + BELLBOT.addr);
  });

  // disconnect and kill ngrok when exiting
  this.on('exit', function() {
    ngrok.disconnect();
    console.log('ngrok disconnected');
    ngrok.kill();
    console.log('ngrok process killed');
  });
});
