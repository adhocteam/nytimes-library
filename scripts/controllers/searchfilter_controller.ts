
import { Controller } from '@hotwired/stimulus'

class SearchFilterController extends Controller {
  typesTarget: any;
  modalTarget: any;
  checkboxTargets: any;
  typesDescTarget: any;
  selectedTypes: String[] = [];

  static targets = ['types', 'modal', 'checkbox', 'typesDesc'];

  connect(): void {
    this.updateHiddenField();
  }

  summonModal(): void {
    this.modalTarget.style.display = 'flex';
  }

  dismissModal(): void {
    this.modalTarget.style.display = 'none';
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