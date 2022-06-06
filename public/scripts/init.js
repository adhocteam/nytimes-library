import HelloController from './hello.js'
import UsefulnessController from './usefulness.js'

(() => {
  const application = Stimulus.Application.start()

  // Add additional controllers here
  application.register('hello', HelloController)
  application.register('usefulness', UsefulnessController)
})()
