var five = require('johnny-five');
var express = require('express');
var ngrok = require('ngrok');
var commandArgs = require('./args').commandArgs;

var board = new five.Board();
var app = express();
var clArgs = commandArgs();

var BELLBOT = {
  proto:               clArgs.proto         || 'http',
  addr:         Number(clArgs.port)         || 3001,
  url: '',
  startAt:      Number(clArgs.start)        || 70,
  strikeAt:     Number(clArgs.strike)       || 95,
  servoPin:     Number(clArgs.pin)          || 8,
  servoDelay:   Number(clArgs.servodelay)   || 1000,
  processDelay: Number(clArgs.processdelay) || 3000
};
exports.BELLBOT = BELLBOT;
var ServoController = require('./servo-controller').ServoController;

five.Servo.prototype.ring = function(opts) {
  var strike = opts && opts.strike || BELLBOT.strikeAt;
  var reset  = opts && opts.reset  || BELLBOT.startAt;
  var delay  = opts && opts.delay  || BELLBOT.servoDelay;

  this.to(strike);
  that = this;
  setTimeout(function() {
    that.to(reset);
  }, delay);
};

// express route to ring bell
app.get('/ring', function(req, res) {
  var ring_cmd = {
    obj: board.servo,
    method: 'ring',
    args: null
  }
  
  board.servoController.exec(ring_cmd, function() {
    console.log('bell rung');
  });
  res.send('request received');
});

board.on('ready', function() {
  
  this.servo = new five.Servo({
    id: 'BellbotServo',
    pin: BELLBOT.servoPin,
    startAt: BELLBOT.startAt,
  });
  this.servoController = new ServoController();
  ngrok.connect({
    proto: BELLBOT.proto,
    addr: BELLBOT.addr
  }, function(err, url) {
    if (err)
      throw err;
    
    console.log('ngrok url: ' + url);
    BELLBOT.url = url;
    app.listen(BELLBOT.addr);
    console.log('express listening on port: ' + BELLBOT.addr);
  });

  this.on('exit', function() {
    console.log('shutting down board');
    ngrok.disconnect();
    ngrok.kill();
    console.log('ngrok disconnected');
  });
});
