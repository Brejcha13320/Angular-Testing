import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleComponent } from './people.component';
import { PersonComponent } from '../person/person.component';
import { Person } from '../../models/person.model';
import { By } from '@angular/platform-browser';

describe('PeopleComponent', () => {
  let component: PeopleComponent;
  let fixture: ComponentFixture<PeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeopleComponent, PersonComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list app-person components', () => {
    component.people = [
      new Person('Nicolas', 'Molina', 23, 1, 1),
      new Person('Valentina', 'Molina', 12, 2, 3),
      new Person('Santiago', 'Molina', 12, 2, 3),
    ];

    fixture.detectChanges();
    const debugElement = fixture.debugElement.queryAll(By.css('app-person'));

    expect(debugElement.length).toEqual(component.people.length);
  });

  it('should have a selectedPerson when emit output', () => {
    spyOn(component, 'choose').and.callThrough();
    component.people = [
      new Person('Nicolas', 'Molina', 23, 1, 1),
      new Person('Valentina', 'Molina', 12, 2, 3),
    ];
    const indexSeleted = 1;
    fixture.detectChanges();

    const debugElement = fixture.debugElement.queryAll(By.css('app-person .btn_choose'));
    const debugPerson = debugElement[indexSeleted];
    debugPerson.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.choose).toHaveBeenCalled();
    expect(component.selectedPerson).toEqual(component.people[indexSeleted])
  });

  it('should render a selectedPerson when emit output', () => {
    spyOn(component, 'choose').and.callThrough();
    component.people = [
      new Person('Nicolas', 'Molina', 23, 1, 1),
      new Person('Valentina', 'Molina', 12, 2, 3),
    ];
    const indexSeleted = 1;
    fixture.detectChanges();

    const debugElement = fixture.debugElement.queryAll(By.css('app-person .btn_choose'));
    const debugPerson = debugElement[indexSeleted];
    debugPerson.triggerEventHandler('click', null);
    fixture.detectChanges();

    const debugselectedPerson = fixture.debugElement.queryAll(By.css('.selectedPerson ul > li'));
    const nameElement: HTMLElement = debugselectedPerson[0].nativeElement;
    const ageElement: HTMLElement = debugselectedPerson[1].nativeElement;

    expect(nameElement.textContent).toContain(component.selectedPerson?.name);
    expect(ageElement.textContent).toContain(component.selectedPerson?.age);
  });

});
