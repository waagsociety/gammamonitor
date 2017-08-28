## Install

```
$ npm install gamma-monitor
```


## Usage

```js
const gammaMonitor = require('gamma-monitor')

// All properties in the options Object are optional,
// below are its default values.
const options = {
  width: 320,
  heigth: 240,
  frameRate: 10,
  facingMode: 'user',
}

const measurement = gammaMonitor(options) 
// GammaMonitor { ... }
```

## API
Al methods with the exeption of the Error handler (.catch) receive a `Measurement {}` as its only paremeter with `measurement` as its context.

### .measurement
Object that is an instance of Measurement with data produced by gammaMonitor as its properties.

### .start()
Method to start a measurement.

### .stop()
Method to stop a measurement.

### .onStart(callback)
Method that is called when the measurements has started.

### .onStop(callback)
Method that is called when the measurements has stopped.

### .onUpdate(callback)
Method that is called when the measurements has updated (once every second).

### .onChange(callback)
Method that is called when the measurements has changed (once every minute).

### .catch(callback)
Method that is called when the measurements has thrown an Error. If an error occurs, the measurement is stopped right away.

## Measurement

### .version
Number representing the current version of the underlying algorithm.

### .active
Boolean representing wheter the monitor is currently active.

### .ready
Boolean representing wheter the baseline reading has completed, and actual monitoring has started.

### .startTime
Unix time Number representing the time a measurement has started, set to `null` by default.

### .frameTime
Unix time Number representing the time of the current frame, set to `null` by default.

### .progress
Number from 0 to 1 representing the progress of a current cycle (baseline measurement/minute of measuring).

### .baseline
Number representing the offset between signal and noise, indicative of sensor accuracy.

### .countPerSecond
Number representing the most recent reading for a second, `0` by default.

### .countPerMinute
Number representing the most recent reading for a full minute, `0` by default.

### .seconds
Array with the `countPerSecond` of all seconds within the current minute.

### .minutes
Array with the `countPerMinute` of all minutes within the current measurement.

### .error
If an error occurs it is set to this property, set to `null` otherwise.

## License

MIT © [Waag Society](https://github.com/waagsociety)
