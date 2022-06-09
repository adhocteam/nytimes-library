// src/controllers/clipboard_controller.js
import { Controller } from "@hotwired/stimulus";

class ClipboardController extends Controller {
  [x: string]: any;
  static targets = ["source"];
  copy() {
    navigator.clipboard.writeText(this.sourceTarget.value);
  }
}

export default ClipboardController
