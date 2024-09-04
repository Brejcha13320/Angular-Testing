import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { RegisterFormComponent } from './register-form.component';
import { UserService } from '../../../services/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { asyncData, asyncError, clickElement, getText, mockObservable, query, setCheckboxValue, setInputValue } from '../../../../testing';
import { generateOneUser } from '../../../mocks/user.mock';
import { CreateUserDTO } from '../../../models/user.model';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserService', ['create', 'isAvailableByEmail']);

    await TestBed.configureTestingModule({
      declarations: [RegisterFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: spy },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    component = fixture.componentInstance;
    userService.isAvailableByEmail.and.returnValue(mockObservable({ isAvailable: true }));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should the emailField be invalid', () => {
    component.emailField?.setValue('esto no es un email');
    expect(component.emailField?.invalid).withContext('wrong email').toBeTruthy();

    component.emailField?.setValue('');
    expect(component.emailField?.invalid).withContext('empty').toBeTruthy();
  });

  it('should the emailField be invalid from UI', () => {

    const inputDebug = query(fixture, 'input#email');
    const input: HTMLInputElement = inputDebug.nativeElement;

    input.value = 'esto no es un email';
    input.dispatchEvent(new Event('input')); //termine de escribir
    input.dispatchEvent(new Event('blur')); //salirse del input para mostrar los otros mensajes
    fixture.detectChanges();

    expect(component.emailField?.invalid).toBeTruthy();

    const errorEmail = getText(fixture, 'emailField-email');
    expect(errorEmail).toContain("*It's not a email");


    input.value = '';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    const errorRequired = getText(fixture, 'emailField-required');
    expect(component.emailField?.invalid).toBeTruthy();
    expect(errorRequired).toContain('*Required');
  });

  it('should the emailField be invalid from UI with setInputValue', () => {
    setInputValue(fixture, 'input#email', 'esto no es un email');
    fixture.detectChanges();

    expect(component.emailField?.invalid).toBeTruthy();

    const errorEmail = getText(fixture, 'emailField-email');
    expect(errorEmail).toContain("*It's not a email");


    setInputValue(fixture, 'input#email', '');
    fixture.detectChanges();
    const errorRequired = getText(fixture, 'emailField-required');
    expect(component.emailField?.invalid).toBeTruthy();
    expect(errorRequired).toContain('*Required');
  });

  it('should the passwordField be invalid', () => {
    component.passwordField?.setValue('');
    expect(component.passwordField?.invalid).withContext('empty').toBeTruthy();

    component.passwordField?.setValue('12345');
    expect(component.passwordField?.invalid).withContext('12345').toBeTruthy();

    component.passwordField?.setValue('asasaasasdsdsd');
    expect(component.passwordField?.invalid).withContext('without number').toBeTruthy();

    component.passwordField?.setValue('asas1aasasdsdsd');
    expect(component.passwordField?.valid).withContext('rigth').toBeTruthy();
  });

  it('should the form be invalid', () => {
    component.form.patchValue({
      name: 'Nico',
      email: 'nico@email.com',
      password: 'qwertyuiop123',
      confirmPassword: 'qwertyuiop123',
      checkTerms: false
    });

    expect(component.form.invalid).toBeTruthy();
  });

  it('should send the form successfully', () => {
    component.form.patchValue({
      name: 'Nico',
      email: 'nico@email.com',
      password: 'qwertyuiop123',
      confirmPassword: 'qwertyuiop123',
      checkTerms: true
    });
    spyOn(component, 'register').and.callThrough();
    const mockUser = generateOneUser();
    userService.create.and.returnValue(mockObservable(mockUser));

    component.register(new Event('submit'));

    expect(component.form.valid).toBeTruthy();
    expect(component.register).toHaveBeenCalledWith(new Event('submit'));
    expect(userService.create).toHaveBeenCalledWith(component.form.value as CreateUserDTO);
  });

  it('should send the form successfully and change status', fakeAsync(() => {
    spyOn(component, 'register').and.callThrough();
    component.form.patchValue({
      name: 'Nico',
      email: 'nico@email.com',
      password: 'qwertyuiop123',
      confirmPassword: 'qwertyuiop123',
      checkTerms: true
    });
    const mockUser = generateOneUser();
    userService.create.and.returnValue(asyncData(mockUser));

    component.register(new Event('submit'));
    expect(component.form.valid).toBeTruthy();
    expect(component.register).toHaveBeenCalledWith(new Event('submit'));
    expect(component.status).toEqual('loading');

    tick();
    fixture.detectChanges();

    expect(userService.create).toHaveBeenCalledWith(component.form.value as CreateUserDTO);
    expect(component.status).toEqual('success');
  }));

  it('should send the form successfully with UI', fakeAsync(() => {
    spyOn(component, 'register').and.callThrough();
    const mockUser = generateOneUser();
    userService.create.and.returnValue(asyncData(mockUser));

    setInputValue(fixture, 'input#name', 'Nico');
    setInputValue(fixture, 'input#email', 'nico@email.com');
    setInputValue(fixture, 'input#password', 'qwertyuiop123');
    setInputValue(fixture, 'input#confirmPassword', 'qwertyuiop123');
    setCheckboxValue(fixture, 'input#checkTerms', true);

    clickElement(fixture, 'btn-submit', true); //click en boton
    // query(fixture, 'form').triggerEventHandler('ngSubmit', new Event('submit')); //evento submit del form

    fixture.detectChanges();

    expect(component.form.valid).toBeTruthy();
    expect(component.register).toHaveBeenCalled();
    expect(component.status).toEqual('loading');

    tick();
    fixture.detectChanges();

    expect(userService.create).toHaveBeenCalledWith(component.form.value as CreateUserDTO);
    expect(component.status).toEqual('success');
  }));

  it('should send the form with UI with error in the service', fakeAsync(() => {
    spyOn(component, 'register').and.callThrough();
    userService.create.and.returnValue(asyncError('error service'));

    setInputValue(fixture, 'input#name', 'Nico');
    setInputValue(fixture, 'input#email', 'nico@email.com');
    setInputValue(fixture, 'input#password', 'qwertyuiop123');
    setInputValue(fixture, 'input#confirmPassword', 'qwertyuiop123');
    setCheckboxValue(fixture, 'input#checkTerms', true);

    clickElement(fixture, 'btn-submit', true); //click en boton
    // query(fixture, 'form').triggerEventHandler('ngSubmit', new Event('submit')); //evento submit del form

    fixture.detectChanges();

    expect(component.form.valid).toBeTruthy();
    expect(component.register).toHaveBeenCalled();
    expect(component.status).toEqual('loading');

    tick();
    fixture.detectChanges();

    expect(userService.create).toHaveBeenCalledWith(component.form.value as CreateUserDTO);
    expect(component.status).toEqual('error');
  }));

  it('should show error with an email invalid exists', () => {
    userService.isAvailableByEmail.and.returnValue(mockObservable({ isAvailable: false }));
    setInputValue(fixture, 'input#email', 'nico@mail.com');

    fixture.detectChanges();

    expect(component.emailField?.invalid).toBeTrue();
    expect(userService.isAvailableByEmail).toHaveBeenCalledWith('nico@mail.com');

    const errorMsg = getText(fixture, 'emailField-not-available');
    expect(errorMsg).toContain('The email is already registered');

  });

});
