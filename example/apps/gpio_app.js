/*
 Copyright © 2017 Agilatech. All Rights Reserved.
 
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

module.exports = function testApp(server) {
  
  var gpioDeviceQuery = server.where({type:'gpio'});
  
  server.observe([gpioDeviceQuery], function(gpioDevice) {

  	// Turn the device on. 
  	gpioDevice.call('turn-on', function() {
      server.info("GPIO device switched on");
    });
                 
  	// Stream events and their associated message are propagated periodically timed by streamPeriod
  	// The incomming message contains three fields: topic, timestamp, and data.
  	gpioDevice.streams.level_stream.on('data', function(message) {
      server.info("current data stream " + message.topic + " : " + message.timestamp + " : " + message.data);
    });

    // If a monitored value changes, a message will be propagated with the event
    gpioDevice.streams.level.on('data', function(message) {
      server.info("^^ current value changed " + message.topic + " : " + message.timestamp + " : " + message.data);
    });
    
    gpioDevice.call('change-output', 'high', function() {
      server.info("GPIO device switched high");
    });
                 
  	// Above, note that we know the monitored and stream data names.  This information is also available
  	// in the device meta response at http://localhost:1107/servers/testServer/meta/gpio

    // Perform a output level change via cmd line some thing like:
    // curl -i -X POST http://localhost:1107/servers/testServer/devices/542bc244-b3b4-4a8f-b262-b80de2120a76 -d 'action=change-output&level=high'
  });
  
}
