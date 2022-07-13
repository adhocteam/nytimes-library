import { Controller } from '@hotwired/stimulus'

class UsefulnessController extends Controller {
    launchModal: String | null
    
    initialize() {
      this.launchModal = ''
    }
  
    static get targets() {
      return []
    }
  
    handleVote(event: any) {
      this.launchModal = event.params.launchModal
      const modal = document.querySelector(`#${this.launchModal}`)
      modal.classList.add('active')
    }
  
    handleCancel() {
      this.closeModal()
    }
  
    handleSubmit() {
      const documentId = this.data.get('documentId')
      const location = this.launchModal === 'useful-yes' ? '/api/upvote' : '/api/downvote'
      const checked: HTMLInputElement = document.querySelector('input[name="reason"]:checked')
      const reason = checked ? checked.value : ''
      this.post(location, {
        id: documentId,
        reason
      })
      this.closeModal()
    }
  
    closeModal() {
      const modal = document.querySelector(`#${this.launchModal}`)
      modal.classList.remove('active')
      this.launchModal = ''
    }
  
    async post(location, payload) {
      const res = await fetch(location, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      const json = await res.json()
      console.log(json)
    }
  }
  
  export default UsefulnessController