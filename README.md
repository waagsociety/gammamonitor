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
Al methods with the exeption of the Error handler (catch) receive a `Measurement {}` as its only paremeter with `measurement` as its context.

### measurement.active
Boolean that represents wheater a measurement is taking place.

### measurement.start()
Method to start a measurement.

### measurement.stop()
Method to stop a measurement.

### measurement.onStart(callback)
Method that is called when the measurements has started.

### measurement.onStop(callback)
Method that is called when the measurements has stopped.

### measurement.onUpdate(callback)
Method that is called when the measurements has updated (once every second).

### measurement.onChange(callback)
Method that is called when the measurements has changed (once every minute).

### measurement.catch(callback)
Method that is called when the measurements has thrown an Error. If an error occurs, the measurement is stopped right away.

## License

MIT © [Waag Society](https://github.com/waagsociety)
