import { Application } from "@hotwired/stimulus"

// Import controller here
import HelloController from "./controllers/hello_controller"
import ClipboardController from "./controllers/clipboard_controller"

const application = Application.start()

// Register controller here
application.register("hello", HelloController)
application.register("clipboard", ClipboardController)