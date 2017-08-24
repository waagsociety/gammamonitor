!function(factory) {
  if (typeof exports === 'object' && typeof require === 'function') {
    module.exports = factory
  }
  else window.gammaMonitor = factory
}(function(options) { 'use strict'
  
  const SECOND = 1000
  const SECONDS_PER_MINUTE = 60
  const VERSION = 1

  options = Object.assign({
    width: 320,
    height: 240,
    frameRate: 10,
    facingMode: 'user', 
  }, options)

  function resolveImageData(imageData) {
    
    const { data, width, height } = imageData
    const length = data.length
    let index = 0
    let count = 0

    while (index < length) {

      var r = index++
      var g = index++
      var b = index++
      index++

      count += (data[r] + data[g] + data[b]) > 0

    }

    return { count }

  }

  return new gammaMonitor(options)

  function gammaMonitor(options) {
    
    const media = { id: null, track: null }
    const interval = SECOND / options.frameRate
    const video = createElement('video')
    
    const events = createEventListener(this)
    const isSecond = isNth(options.frameRate)
    const isMinute = isNth(options.frameRate * SECONDS_PER_MINUTE)

    return Object.assign(this, {
      active: false,
      start() {

        if (this.active) return
        else if (!hasVideoSupport()) events.emit(new Error('Video is not supported by this browser'))
        else if (!hasCanvasSupport()) events.emit(new Error('Canvas is not supported by this browser'))
        else if (!hasMediaSupport()) events.emit(new Error('WebRTC is not supported by this browser'))
        else createVideoStream(video, options)
          .then(track => {
            
            this.active = true
            media.track = track
            
            const state = new Measurement()
            const samples = []
            let length

            const width = video.videoWidth
            const height = video.videoHeight
            const canvas = createElement('canvas', { width, height })
            const context = canvas.getContext('2d')

            const getImageData = renderImageData(context, width, height)

            media.id = setInterval(function() {
              
              const imageData = getImageData(video)
              const gammaData = resolveImageData(imageData)

              length = samples.push(gammaData)
              state.frameTime = Date.now()

              if (isSecond(length)) {
                state.progress = (samples.length / options.frameRate) / SECONDS_PER_MINUTE
                state.countPerSecond = sum(samples.slice(-options.frameRate))
                events.emit('update', state)
              }

              if (isMinute(length)) {
                state.countPerMinute = sum(samples)
                events.emit('change', state)
                samples.length = 0
              }

            }, interval)

            events.emit('start', state)

          })
          .catch(error => events.emit('catch', error))

        return this

      },
      stop() {
        if (this.active) {
          this.active = false 
          media.id = clearInterval(media.id)
          media.track.stop()
          events.emit('stop')
        }
        return this
      },
      onChange(callback) {
        return events.set('change', callback)
      },
      onUpdate(callback) {
        return events.set('update', callback)
      },
      onStart(callback) {
        return events.set('start', callback)
      },
      onStop(callback) {
        return events.set('stop', callback)
      },
      catch(callback) {
        return events.set('catch', function(error) {          
          callback(error)
          this.stop()
        })
      },
    })

  }

  function Measurement() {
    return Object.assign(this,{
      v: VERSION,
      startTime: Date.now(),
      frameTime: null,
      baseline: 0,
      countPerSecond: 0,      
      countPerMinute: 0,
    })
  }
  
  function createEventListener(object) {
    const events = {}
    return {
      set(type, callback) {
        events[type] = callback
        return object
      },
      emit(type, value) {
        return (events[type] || noop).call(object, value)
      },
    }
  }
  
  function createVideoStream(video, options) {

    return navigator.mediaDevices.getUserMedia({ video: options, audio: false })
      .then(function(stream) {
    
        const track = stream.getVideoTracks()[0]
        return new Promise(function(resolve, reject) {
          Object.assign(video, {
            srcObject: stream,
            onloadeddata() { resolve(track) },
            onerror() { reject(new Error('WebRTC could not be initialized')) },
          }).play()
        })

    })

  }

  function renderImageData(context, width, height) {
    return function(source) {
      context.drawImage(source, 0, 0, width, height)
      return context.getImageData(0, 0, width, height)
    }
  }

  function sum(array) {
    let sum = 0
    for (let index = 0, length = array.length; index < length; ++index) {
      sum += array[index].count
    }
    return sum
  }

  function isTypeof(type, value) {
    return function(value) {
      return typeof value === type
    }
  }

  function isNth(n) {
    return function(value) {
      return value && Math.round(value) % n === 0
    }
  }

  function clamp(min, max, value) {
    return min <= max
      ? value < min ? min : value > max ? max : parseInt(value) || min
      : clamp(max, min, value)
  }

  function hasVideoSupport() {
    const video = createElement('video')
    return typeof video.canPlayType === 'function'
  }

  function hasCanvasSupport() {
    const canvas = createElement('canvas')
    return typeof canvas.getContext === 'function'
  }

  function hasMediaSupport() {
    return !!navigator.mediaDevices.getUserMedia
  }

  function createElement(tagName, properties) {
    return Object.assign(document.createElement(tagName), properties)
  }

  function noop() {}

})
