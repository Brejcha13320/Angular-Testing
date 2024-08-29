import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OthersComponent } from './others.component';
import { ReversePipe } from '../../pipes/reverse.pipe';
import { FormsModule } from '@angular/forms';
import { HighligthDirective } from '../../directives/highligth.directive';

describe('OthersComponent', () => {
  let component: OthersComponent;
  let fixture: ComponentFixture<OthersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OthersComponent, HighligthDirective, ReversePipe],
      imports: [FormsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
