var BELLBOT = require('./app').BELLBOT;

var ServoController = function(timeout) {
  this.timeout = timeout || BELLBOT.processDelay;
  this.queue = [];
  this.ready = true;
};

ServoController.prototype.send = function(cmd, callback) {
  cmd.obj[cmd.method](cmd.args);
  if (callback) callback();
};

ServoController.prototype.exec = function() {
  this.queue.push(arguments);
  this.process();
};

ServoController.prototype.process = function() {
  if (this.queue.length === 0 || !this.ready) return;
  var that = this;
  this.ready = false;
  this.send.apply(this, this.queue.shift());
  setTimeout(function () {
    that.ready = true;
    that.process();
  }, this.timeout);
};

exports.ServoController = ServoController;