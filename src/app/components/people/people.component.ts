import { Component } from '@angular/core';
import { Person } from '../../models/person.model';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss'
})
export class PeopleComponent {
  people: Person[] = [
    new Person('Nicolas', 'Molina', 23, 1, 1),
    new Person('Valentina', 'Molina', 12, 2, 3),
  ];
  selectedPerson: Person | null = null;

  constructor() { }

  ngOnInit(): void {
  }

  choose(person: Person) {
    this.selectedPerson = person;
  }
}
