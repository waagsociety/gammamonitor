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

### measurement.active

### measurement.start()

### measurement.stop()

### measurement.onStart(callback)

### measurement.onStop(callback)

### measurement.onUpdate(callback)

### measurement.onChange(callback)

### measurement.catch(callback)

## License

MIT © [Waag Society](https://github.com/waagsociety)
