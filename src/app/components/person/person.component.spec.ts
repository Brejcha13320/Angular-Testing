import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonComponent } from './person.component';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Person } from '../../models/person.model';

describe('PersonComponent', () => {
  let component: PersonComponent;
  let fixture: ComponentFixture<PersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dont have the section render if user is null', () => {
    component.person = null;
    const personDebug: DebugElement = fixture.debugElement;
    const divDebug: DebugElement = personDebug.query(By.css('div'));

    fixture.detectChanges();

    expect(divDebug).toBeNull();
  });

  it('should have the div render if exists user', () => {
    component.person = new Person('', '', 0, 0, 0);
    fixture.detectChanges();

    const personDebug: DebugElement = fixture.debugElement;
    const divDebug: DebugElement = personDebug.query(By.css('div'));
    const div: HTMLElement = divDebug.nativeElement;

    expect(div).toBeTruthy();
  });

  it('should have <h3> contains the name of user', () => {
    component.person = new Person('Jesus', '', 0, 0, 0);
    fixture.detectChanges();

    const personDebug: DebugElement = fixture.debugElement;
    const h3Debug: DebugElement = personDebug.query(By.css('h3'));
    const h3: HTMLElement = h3Debug.nativeElement;

    expect(h3?.textContent).toContain(component.person.name);
  });

  it('should have <p> contains the height of user', () => {
    component.person = new Person('', '', 0, 0, 1.65);
    fixture.detectChanges();

    const personDebug: DebugElement = fixture.debugElement;
    const pDebug: DebugElement = personDebug.query(By.css('p'));
    const p: HTMLElement = pDebug.nativeElement;

    expect(p?.textContent).toContain(component.person.height);
  });

  it('should display a text with IMC when call calcIMC', () => {
    component.person = new Person('', '', 24, 68, 1.68);
    component.calcIMC();
    fixture.detectChanges();

    const imc = 'normal';
    const button = fixture.debugElement.query(By.css('button.btn_imc')).nativeElement;

    expect(button.textContent).toContain(imc);
  });

  it('should display a text with IMC when do click on Button IMC', () => {
    spyOn(component, 'calcIMC').and.callThrough();
    component.person = new Person('', '', 24, 68, 1.68);
    fixture.detectChanges();

    const imc = 'normal';

    const buttonDebug = fixture.debugElement.query(By.css('button.btn_imc'));
    const buttonElement: HTMLButtonElement = buttonDebug.nativeElement;
    buttonElement.click();
    fixture.detectChanges();

    expect(buttonElement.textContent).toContain(imc);
    expect(component.calcIMC).toHaveBeenCalled();
  });

  it('should call onEmit when do click on Button Choose', () => {
    spyOn(component, 'onEmit').and.callThrough();
    component.person = new Person('Jesus', 'Mejia', 24, 68, 1.68);
    fixture.detectChanges();

    let selectedPerson: Person | undefined;
    component.onSelected.subscribe((person) => selectedPerson = person);
    const buttonDebug = fixture.debugElement.query(By.css('button.btn_choose'));
    const buttonElement: HTMLButtonElement = buttonDebug.nativeElement;
    buttonElement.click();

    fixture.detectChanges();

    expect(component.onEmit).toHaveBeenCalled();
    expect(selectedPerson).toEqual(component.person)
  });

});


@Component({
  template: `<app-person [person]="person" (onSelected)="onSelected($event)" ></app-person>`
})
class HostComponent {
  person = new Person('Jesus', 'Mejia', 24, 68, 1.68);
  selectedPerson: Person | null = null;

  onSelected(person: Person) {
    this.selectedPerson = person;
  }

}

describe("PersonComponent from HostComponent", () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent, PersonComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a person name', () => {
    const expectName = component.person.name;
    const h3Debug = fixture.debugElement.query(By.css('app-person h3'));
    const h3: HTMLElement = h3Debug.nativeElement;

    expect(h3.textContent).toContain(expectName);
  });

  it('should work the output onSelected', () => {
    const buttonDebug = fixture.debugElement.query(By.css('app-person .btn_choose'));
    buttonDebug.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.selectedPerson).toEqual(component.person);
  });

})
