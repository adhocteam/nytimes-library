import { Controller } from "@hotwired/stimulus"

class HelloController extends Controller {
  connect() {
    console.log("Hello, Stimulus!", this.element)
  }
}

export default HelloController