
import { Controller } from '@hotwired/stimulus'

class SearchFilterController extends Controller {
  backdropTarget: HTMLElement;
  filteredByLabelTarget: HTMLElement;
  typesTarget: HTMLInputElement;
  modalTarget: HTMLElement;
  modalBodyTarget: HTMLElement;
  checkboxTargets: HTMLInputElement[];
  typesDescTarget: HTMLElement;
  selectedTypes: String[] = [];
  allDocsTarget: HTMLInputElement;
  allImagesTarget: HTMLInputElement;

  documentTypes = ['docs', 'pdf', 'slides'];

  imageTypes = ['drawings', 'jpg', 'png', 'svg'];

  miscTypes = ['sheets', 'shortcut', 'video'];

  static targets = ['backdrop', 'filteredByLabel', 'types',
    'modal', 'modalBody', 'checkbox', 'typesDesc',
    'allDocs', 'allImages'];

  connect(): void {
    this.updateHiddenField();
  }

  summonModal(): void {
    this.modalTarget.classList.add('active');
    setTimeout(() => {
      this.backdropTarget.classList.add('active');
      this.modalBodyTarget.classList.add('active');
    }, 10);
  }

  dismissModal(): void {
    this.modalBodyTarget.classList.remove('active');
    this.backdropTarget.classList.remove('active');
    setTimeout(() => {
      this.modalTarget.classList.remove('active');
    }, 200);
  }

  onConfirm(): void {
    this.selectedTypes = this.checkboxTargets.filter(x => x.checked).map(x => x.value);
    this.updateHiddenField();
    this.filteredByLabelTarget.innerHTML = this.selectedTypes.length ? 'Filtered by: ' : '';
    this.typesDescTarget.innerHTML = this.selectedTypes.join(', ');
    this.dismissModal();
  }

  updateHiddenField(): void {
    this.typesTarget.value = this.selectedTypes.join(',');
  }

  selectAll(): void {
    this.checkboxTargets.forEach(target => target.checked = true);
    this.selectedTypes = this.checkboxTargets.map(x => x.value);
    this.allDocsTarget.checked = true;
    this.allImagesTarget.checked = true;
  }

  selectNone(): void {
    this.selectedTypes = [];
    this.checkboxTargets.forEach(target => target.checked = false);
    this.allDocsTarget.checked = false;
    this.allImagesTarget.checked = false;
  }

  docsHandler(): void {
    this.allDocsTarget.checked = this.allDocsSelected();
  }

  imagesHandler(): void {
    this.allImagesTarget.checked = this.allImagesSelected();
  }

  allDocsSelected = this.buildSelectionCheck(this.documentTypes);

  allImagesSelected = this.buildSelectionCheck(this.imageTypes);

  private buildSelectionCheck(types: String[]): () => boolean {
    return () => this.checkboxTargets.filter(target => types.indexOf(target.value) !== -1).every(target => target.checked) 
  }

  private buildToggler(types): (event: PointerEvent) => void {
    return (event: PointerEvent): void => {
      const checkbox = event.target as HTMLInputElement;
      const isChecked = checkbox.checked;

      this.checkboxTargets.filter(target => types.indexOf(target.value) !== -1)
        .forEach(target => target.checked = isChecked);
    }
  }

  toggleDocs = this.buildToggler(this.documentTypes);

  toggleImages = this.buildToggler(this.imageTypes);
}

export default SearchFilterController;
