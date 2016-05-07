var parse = function() {
  var flag     = /^-[a-z]$/i;
  var longFlag = /^--[a-z]+$/i;
  var option   = /^--[a-z]+=([a-z]+|[0-9]+)$/i
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
  var key = process.env.BELLBOT_KEY;
  if (key && !argsObject.key) {
    argsObject.key = key;
  }
  return argsObject;
};

module.exports = parse();