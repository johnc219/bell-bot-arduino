var five = require('johnny-five');
var express = require('express');
var bodyParser = require('body-parser');
var ngrok = require('ngrok');
var ServoController = require('./servo_controller').ServoController;
var BELLBOT = require('./config');

var board = new five.Board();
var app = express();

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

app.use(bodyParser.json());
app.post('/ring', function(req, res) {
  console.log("request received");
  var key = req.body && req.body.key;
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
    console.log('bell physically rung');
  });
  res.sendStatus(200);
});

board.on('ready', function() {
  
  this.servo = new five.Servo({
    id: 'BellbotServo',
    pin: BELLBOT.servoPin,
    startAt: BELLBOT.startAt,
  });
  
  this.servoController = new ServoController(BELLBOT.processDelay);
  
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

  this.on('exit', function() {
    ngrok.disconnect();
    console.log('ngrok disconnected');
    ngrok.kill();
    console.log('ngrok process killed');
  });
});
