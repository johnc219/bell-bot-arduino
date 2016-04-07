// required modules
var serialport = require('serialport')
var express = require('express')
var ngrok = require('ngrok')
// set protocol
var SUCCESS_CODE = 'S'
var RING_CODE = 'R'

// defaults
var USB_PORT = "/dev/cu.usbmodemfa131"
var PORT = 3000

// override defaults, e.g. `node app.js --port=3001`
process.argv.forEach(function(val, index, array) {
  var arg = val.split('=')
  if (arg[0] === '--port')
    PORT = arg[1]
  if (arg[0] === '--usb')
    USB_PORT = arg[1]
})

var app = express();
var SerialPort = serialport.SerialPort
var bellCount = 0

// open the specified port immediately
var serialPort = new SerialPort(USB_PORT, {
  baudrate: 9600
})

// express route to ring bell
app.post('/ring', function(req, res) {
  console.log("incoming bell!")
  bellCount++
  
  // callback when data is received
  serialPort.on('data', function(data) {
    if (data.toString() === SUCCESS_CODE) {
      console.log("Bell rung!")
    }
    else {
      console.log("fail")
    }
  }) 

  // write to arduino
  serialPort.write(RING_CODE, function(err, results) {
    if (err)
      console.log('write error: ' + err)
    else
      console.log('write success: ' + results)
  })

  // return 200 ok
  res.send("Ding! Bell count: " + bellCount)
})

// callback when serial port is opened
serialPort.on('open', function() {
  console.log("serial port opened on port: " + USB_PORT)
  
  // start a localtunnel
  ngrok.connect({
    proto: 'http',
    addr: PORT
  }, function(err, url) {
    if (err)
      throw err
    console.log("public URL live at: " + url)
    
    // listen for requests
    app.listen(PORT)
    console.log('Listening on port: ' + PORT)
  })
})