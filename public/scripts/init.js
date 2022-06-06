import HelloController from './hello.js'

(() => {
  const application = Stimulus.Application.start()

  application.register('hello', HelloController)

  // Register StimulusInvokeController
  // application.register('invoke', StimulusInvoke.StimulusInvokeController)
})()
