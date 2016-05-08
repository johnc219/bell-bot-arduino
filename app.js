var five = require('johnny-five');
var express = require('express');
var bodyParser = require('body-parser');
var ngrok = require('ngrok');
var args = require('./args');
var ServoController = require('./servo_controller').ServoController;

var board = new five.Board();
var app = express();
var BELLBOT = {
  proto: args.proto || 'http',
  addr: Number(args.port) || 3000,
  url: '',
  startAt: Number(args.start) || 70,
  strikeAt: Number(args.strike) || 95,
  servoPin: Number(args.pin) || 8,
  servoDelay: Number(args.sdelay) || 500,
  processDelay: Number(args.pdelay) || 1000,
  key: args.key || null
};

five.Servo.prototype.ring = function(opts) {
  var strike = opts && Number(opts.strike) || BELLBOT.strikeAt;
  var reset  = opts && Number(opts.reset)  || BELLBOT.startAt;
  var delay  = opts && Number(opts.delay)  || BELLBOT.servoDelay;

  this.to(strike);
  that = this;
  setTimeout(function() {
    that.to(reset);
  }, delay);
};

app.use(bodyParser.json());
app.post('/ring', function(req, res) {
  console.log("request received");
  
  var body = req.body;
  if (BELLBOT.key && body.key !== BELLBOT.key) {
    res.send('request denied');
    return;
  }

  var ringCmd = {
    obj: board.servo,
    method: 'ring',
    args: body
  }
  
  board.servoController.exec(ringCmd, function() {
    console.log('bell physically rung');
  });
  res.send('request received');
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
