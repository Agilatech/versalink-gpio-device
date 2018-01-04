## VersaLink GPIO Input/Output device driver

This device driver is specifically designed to be used with the Agilatech® VersaLink IIoT Platform.
Please see [agilatech.com](https://agilatech.com/software) to download a copy of the system. 


### Install
```
$> npm install @agilatech/versalink-gpio-device
```


### Design
This device driver is designed to control a single GPIO input/output.  The device must be designated as either an output OR an input.  If it is an output, it can be set to high or low.  If it is an input, the driver will publish a new value immediately upon being triggered, and it may also be triggered via software.  No assumptions are made as to the end use of the output, be it lighting an LED or controlling the coolant valves on a nuclear power plant.  Therefore, it is up to the end user application to decide upon latency and frequency issues.


### Usage
This device driver is designed to be consumed by the Agilatech® VersaLink IIoT system.  As such, it is not really applicable or useful in other environments.

To use it with VersaLink, insert its object definition as an element in the devices array in the _devlist.json_ file.
```
{
  "name": "GPIO",
  "module": "@agilatech/versalink-gpio-device",
  "options": {
    "devicePoll": 1000,
    "streamPeriod": 60000
  }
}
```


#### Device config object
The device config object is an element in the devlist.json device configuration file, which is located in the VersaLink root directory.  It is used to tell the VersaLink system to load the device, as well as several operational parameters.

_name_ is simply the name given to the device.  This name can be used in queries and for other identifcation purposes.

_module_ is the name of the npm module. The module is expected to exist in this directory under the _node_modules_ directory.  If the module is not strictly an npm module, it must still be found under the node_modules directory.

_options_ is an object within the device config object which defines all other operational parameters.  In general, any parameters may be defined in this options object, and most modules will have many several.  The three which are a part of every VersaLink device are 'devicePoll', 'streamPeriod', and 'deltaPercent'. The gpio options also can define gpio, direction, edge, and debounce.

```
"devicePoll":<period>
Period in milliseconds in which device will be polled

"streamPeriod":<period>
Period in milliseconds for broadcast of streaming values

"gpio":<gpio>
The GPIO pin or other definition, where the system can connect to the I/O

"direction": <in|out>
Direction is either "in" for inputs or "out" for outputs. Defaults to "out".

"edge": <trigger edge>
Trigger edge can be one of "rising", "falling", "both", or "none".  Defaults to "none".

"debounce": <miliseconds>
Defines a time after which further inputs are ignored.  Used to debounce a mechanical switch. Defaults to 10.
```

#### gpio is a manatory config parameter
Either in the .use statement or the config.json file, **gpio** must be defined to be the valid gpio pin number of the input or output.  Note that this number may not be the same as the physical connector pin number on the board.

#### direction defines whether it is an input or an output
If direction is "in", then the device is expecting to be switched or triggered by some external event.  If the direction is "out", then the device will output a high or a low to the pin.

#### edge is applicable only to input
Trigger inputs have a rising (leading) and falling (trailing) edge.  This option defines which edge will cause the input event to be raised.  If "both", then an event will be raised on the rising and falling edges.

#### debounce eliminates switch bounce
All mechanical switches display some "bounce" where the signal will briefly fluctuate as it is switched.  This bounce usually lasts for only a few milliseconds, but every switch is different.  For that reason, this option ignores any further level changes for the time period after the initial trigger.  The time period is in milliseconds, and has no upper limit.

#### streamPeriod and devicePoll
These options have little applicability for an input/output device such as this.  Since this device only updates the
level property when commanded to do so, it makes little sense to stream the value or poll the device for a new value.
Because of this, it is advisable to **set streamPeriod to 0**, which disables streaming, and set the devicePoll to some arbitrarily large value. Regardless of the setting of these config, the **level** parameter will be updated when it is changed.


#### module config 
Every module released by Agilatech includes configuration in a file named 'config.json' and we encourage any other publishers to follow the same pattern.  The parameters in this file are considered defaults, since they are overriden by definitions appearing in the options object of the VersaLink devlist.json file.

The construction of the config.json mirrors that of the options object, which is simply a JSON object with key/value pairs.
Here is an example of an 'config.json' file which puts the device on pin 2, disables streaming, and polls the device every hour:
```
{
  "gpio":2,
  "streamPeriod":0, 
  "devicePoll":3600000
}
```

  
#### Default values
If not specified in the config object, the program uses the following default values:
* _name_ : GPIO
* _direction_ : out
* _edge_: none
* _debounce_ : 10
* _streamPeriod_ : 10000 (10,000ms or 10 seconds)
* _devicePoll_ : 1000 (1,000ms or 1 second)


### Properties
All drivers contain the following 4 core properties:
1. **state** : the current state of the device, containing either the value *chron-on* or *chron-off* 
to indicate whether the device is monitoring data isochronally (a predefinied uniform time period of device data query).
2. **id** : the unique id for this device.  This device id is used to subscribe to this device streams.
3. **name** : the given name for this device.
4. **type** : the given type category for this device,  (_sensor_, _actuator_, etc)


#### Monitored Properties
In the *on* state, the driver software for this device monitors one value.
1. **level** - the current level of the output, either 'high' or 'low'

  
#### Streaming Properties
For this gpio device, it is usual to disable streaming.  However, if it is not disabled, while in the *on* state, the driver software continuously streams this value in isochronal fashion with a period defined by *streamPeriod*. Note that a *streamPeriod* of 0 disables streaming.
1. **level_stream**
  

### State
This device driver has a binary state: __on__ or __off__. When off, no parameter values are streamed or available, and no commands are accepted other than the _turn-on_ transition. When on, the device is operational and accepts all commands.  The initial state is _off_.
  
  
### Transitions
1. **turn-on** : Sets the device state to *on*. When on, the device is operational and accepts all commands. Values are streamed, and the device is polled periodically to keep monitored values up to date.

2. **turn-off** : Sets the device state to *off*, When off, no parameter values are streamed or available, and no commands are accepted other than the _turn-on_ transition.


### Commands
1. **change-output** : For output only. Change the current output according to the parameter *level*. The acceptable value for *level* is either __high__ or __low__.
2. **toggle-output** : For output only. Flips the out to its compliment, i.e. high->low or low->high. 
3. **trigger-input** : For input only. Soft triggers an input event as if it were triggered by an external switch.


### Compatibility
This driver is designed to run within the VersaLink IIoT platform.  While VersaLink will run on nearly any operating system, this driver employs UNIX-specific protocols and as such will run on the following operating systems:
* 32 or 64-bit Linux
* macOS and OS X
* SunOS
* AIX


### Copyright
Copyright © 2018 [Agilatech®](https://agilatech.com). All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

