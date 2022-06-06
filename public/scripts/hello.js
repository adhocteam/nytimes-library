class HelloController extends Stimulus.Controller {
  static get targets() {
    return ['name']
  }

  world() {
    this.nameTarget.value = 'hello#world method invoked!' // test
  }
}

export default HelloController
