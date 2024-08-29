import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Person } from '../../models/person.model';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrl: './person.component.scss'
})
export class PersonComponent {
  @Input() person: Person | null = null;
  @Output() onSelected = new EventEmitter<Person>();
  imc = '';

  calcIMC() {
    if (this.person) {
      this.imc = this.person?.calcIMC();
    }
  }

  onEmit() {
    if (this.person) {
      this.onSelected.emit(this.person);
    }
  }

}
