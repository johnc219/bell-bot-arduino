// get supplied command line args
var args = require('./args');

// the BellBot config
var config = {
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

module.exports = config;