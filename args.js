// when invoked, returns an object representing supplied command line args
var parse = function() {

  // the format of valid args
  var flag     = /^-[a-z]$/i;
  var longFlag = /^--[a-z]+$/i;
  var option   = /^--[a-z]+=([a-z]+|[0-9]+)$/i

  // build up the argsObject with supplied args
  var argsObject = {};
  process.argv.slice(2).forEach(function(arg) {
    if (flag.test(arg)) {
      argsObject[arg.slice(1)] = true;
    }
    else if (longFlag.test(arg)) {
      argsObject[arg.slice(2)] = true;
    }
    else if (option.test(arg)) {
      var optParams = arg.slice(2).split('=');
      argsObject[optParams[0]] = optParams[1];
    }
  });

  // set the auth key if not supplied in command line
  var key = process.env.BELLBOT_KEY;
  if (key && !argsObject.key) {
    argsObject.key = key;
  }

  return argsObject;
};

module.exports = parse();