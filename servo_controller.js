// constructor for processing servo command requests
var ServoController = function(timeout) {
  this.timeout = timeout;
  this.queue = [];
  this.ready = true;
};

// queue up the request and process the queue
ServoController.prototype.exec = function() {
  this.queue.push(arguments);
  this.process();
};

// drain the queued commands
ServoController.prototype.process = function() {
  if (!this.ready) return;
  this.ready = false;
  this.send.apply(this, this.queue.shift());

  var that = this;
  setTimeout(function () {
    that.ready = true;
    if (that.queue.length > 0) that.process();
  }, this.timeout);
};

// perform the requested command
ServoController.prototype.send = function(cmd, callback) {
  cmd.obj[cmd.method](cmd.args);
  if (callback) callback();
};

module.exports.ServoController = ServoController;