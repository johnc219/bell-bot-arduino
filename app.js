var USB_PORT = "/dev/cu.usbmodemfa131"
var SUCCESS_CODE = 1
var RING = 'R'

var serialport = require('serialport')
var express = require('express')

var app = express();
var SerialPort = serialport.SerialPort
var serialPort = new SerialPort(USB_PORT, {
  baudrate: 9600
})

var bellCount = 0

app.get('/ring', function(req, res) {
  console.log("incoming bell!")
  
  serialPort.on('data', function(data) {
    if (data === SUCCESS_CODE) {
      console.log("Bell rung!")
      bellCount++
      res.send("Bell rung! Bell count: " + bellCount)
    }
    else {
      console.log("fail")
      res.send("Bell not rung! Bell count: " + bellCount)
    }
  })
  
  console.log("writing to serial port...")
  serialPort.write(RING, function(err, results) {
    if (err) {
      console.log('write error: ' + err)
      res.send("Couldn't reach bell...")
    }
    else {
      console.log('write success: ' + results)
    }
  })  
})

serialPort.open( function() {
  console.log("serial port opened")
  
  app.listen(3000)
  console.log('Listening on port 3000')
})