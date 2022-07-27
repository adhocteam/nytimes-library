
import { Controller } from '@hotwired/stimulus'

class SearchFilterController extends Controller {
  backdropTarget: any;
  typesTarget: any;
  modalTarget: any;
  modalBodyTarget: any;
  checkboxTargets: any;
  typesDescTarget: any;
  selectedTypes: String[] = [];

  static targets = ['backdrop', 'types', 'modal', 'modalBody', 'checkbox', 'typesDesc'];

  connect(): void {
    this.updateHiddenField();
  }

  summonModal(): void {
    this.modalTarget.classList.add('active')
    setTimeout(() => {
      this.backdropTarget.classList.add('active')
      this.modalBodyTarget.classList.add('active')
    }, 10)
  }

  dismissModal(): void {
    this.modalBodyTarget.classList.remove('active')
    this.backdropTarget.classList.remove('active')
    setTimeout(() => {
      this.modalTarget.classList.remove('active')
    }, 200)
  }

  onSubmit(): void {
    this.selectedTypes = this.checkboxTargets.filter(x => x.checked).map(x => x.value);
    this.updateHiddenField();
    this.typesDescTarget.innerHTML = this.selectedTypes.join(',');
    this.dismissModal();
  }

  updateHiddenField(): void {
    this.typesTarget.value = this.selectedTypes.join(',');
  }
}

export default SearchFilterController;