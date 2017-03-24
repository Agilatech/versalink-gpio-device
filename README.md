##VersaLink GpOut Sensor device driver

This device driver is specifically designed to be used with the Agilatech VersaLink IOT System.

###Install
```
$> npm install versalink-gpio-device
```

###Usage
This device driver is designed to be consumed by the Agilatech VersaLink IOT system.
```
const versalink = require('@agilatech/versalink-server');
var gpio = require('@agilatech/versalink-gpio-device');

versalink()
.use(gpio, [options])  // where [options] define operational paramters -- omit to accept defaults
.listen(<port number>)   // where <port number> is the port on which the VersaLink server should listen
```

####options
_options_ is an object which contains key/value pairs used for driver configuration.

```
"gpio":<gpio>
The GPIO pin or other definition, where the system can connect to the I/O

"direction": <in|out>
Direction is either "in" for inputs or "out" for outputs. Defaults to "out".

"edge": <trigger edge>
Trigger edge can be one of "rising", "falling", "both", or "none".  Defaults to "none".

"debounce": <miliseconds>
Defines a time after which further inputs are ignored.  Used to debounce a mechanical switch. Defaults to 10.

"name":<device name>
The name the device is identified by throughout the system.  Defaults to "GPIO".

"streamPeriod":<period>
Period in milliseconds for broadcast of streaming values

"devicePoll":<period>
Period in milliseconds in which device will be polled
```

#### gpio is a manatory options parameter
Either in the .use statement or the options.json file, **gpio** must be defined to be the valid gpio pin number of the input or output.  Note that this number may not be the same as the physical connector pin number on the board.


####streamPeriod and devicePoll
These options have little applicability for an output device such as this.  Since this device only updates the
level property when commanded to do so, it makes little sense to stream the value or poll the device for a new value.
Because of this, it is advisable to **set streamPeriod to 0**, which disables streaming, and set the devicePoll to some arbitrarily large value. Regardless of the setting of these options, the **level** will be updated when it is changed.


####options example
Here is an example of an options varible which disables streaming and polls the device every hour:
```
const options = {
	"gpio":2,
  "streamPeriod":0, 
  "devicePoll":3600000
}
```

  
####Default values
If not specified in the options object, the program uses the following default values:
* _name_: GPIO
* _direction_: out
* _edge_: none
* _debounce_: 10
* _streamPeriod_ : 10000 (10,000ms or 10 seconds)
* _devicePoll_ : 1000 (1,000ms or 1 second)

    
####&lt;port number&gt;
Agilatech has definied the open port number 1107 as its standard default for IIOT (Industrial Internet Of Things) server application. In practice, most any port above 1024 may be used.


###Example
Using directly in the VersaLink server, and accepting all defaults:
```
const versalink = require('@agilatech/versalink-server');
const device = require('@agilatech/versalink-gpio-device');
versalink().use(device).listen(1107);
```

To easily specify some options, simply supply them in an object in the use statement like this:
```
versalink().use(device, { "streamPeriod":0, "devicePoll":7200000 });
```
Overrides the defaults to disable streaming and set the device poll to once every 2 hours.

###Properties
All drivers contain the following 4 core properties:
1. **state** : the current state of the device, containing either the value *chron-on* or *chron-off* 
to indicate whether the device is monitoring data isochronally (a predefinied uniform time period of device data query).
2. **id** : the unique id for this device.  This device id is used to subscribe to this device streams.
3. **name** : the given name for this device.
4. **type** : the given type category for this device,  (_sensor_, _actuator_, etc)


####Monitored Properties
In the *on* state, the driver software for this device monitors one value.
1. **level** - the current level of the output, either 'high' or 'low'

  
####Streaming Properties
For this gpio device, it is usual to disable streaming.  However, if it is not disabled, while in the *on* state, the driver software continuously streams this value in isochronal fashion with a period defined by *streamPeriod*. Note that a *streamPeriod* of 0 disables streaming.
1. **level_stream**
  

###State
This device driver has a binary state: __on__ or __off__. When off, no parameter values are streamed or available, and no commands are accepted other than the _turn-on_ transition. When on, the device is operational and accepts all commands.  The initial state is _off_.
  
  
###Transitions
1. **turn-on** : Sets the device state to *on*. When on, the device is operational and accepts all commands. Values are streamed, and the device is polled periodically to keep monitored values up to date.

2. **turn-off** : Sets the device state to *off*, When off, no parameter values are streamed or available, and no commands are accepted other than the _turn-on_ transition.

###Commands
1. **change-output** : For output only. Change the current output according to the parameter *level*. The acceptable value for *level* is either __high__ or __low__.
2. **toggle-output** : For output only. Flips the out to its compliment, i.e. high->low or low->high. 
3. **trigger-input** : For input only. Triggers an input event as if it were triggered by an external device.


###Design

This device driver is designed to control a single GPIO output.  The out can be set to high or low. No assumptions are made as to the end use of the output, be it lighting an LED or controlling the coolant valves on a nuclear power plant.  Therefore, it is up to the end user application to decide upon latency and frequency issues.


### Hardware

* Beaglebone Black
* Beaglebone Green
* Should also work on Raspberry Pi as well as other Linux SBC


###Copyright
Copyright © 2017 Agilatech. All Rights Reserved.
