import { TestBed } from '@angular/core/testing';

import { ValueService } from './value.service';
import { lastValueFrom } from 'rxjs';

/**
 * TODO: spyOn Para Crear Espías
 * spyOn(service, 'getValue') crea un espía en la función getValue del servicio ValueService.
 * Esto te permiteusar matchers como toHaveBeenCalled para verificar si la función fue llamada.
 *
 * TODO: .and.callThrought()
 * .and.callThrough() permite que la función espía siga ejecutando la implementación original.
 * Esto es útil cuando quieres verificar que la función ha sido llamada pero también quieres
 * que se ejecute su lógica real.
 */

describe('ValueService', () => {
  let service: ValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Tests for #getValue', () => {
    it('should return a string with "my-value"', () => {
      spyOn(service, 'getValue').and.callThrough();

      expect(service.getValue()).toEqual('my-value');
      expect(typeof service.getValue()).toEqual('string');
      expect(service.getValue).toHaveBeenCalled();
    })
  });

  describe('Tests for #setValue', () => {
    it('should change the value', () => {
      spyOn(service, 'setValue').and.callThrough();
      const valueToChange = 'new-value';

      service.setValue(valueToChange);

      expect(service.getValue()).toEqual(valueToChange);
      expect(service.setValue).toHaveBeenCalledWith(valueToChange);
    })
  });

  describe('Tests for #getPromiseValue', () => {

    beforeEach(() => {
      spyOn(service, 'getPromiseValue').and.callThrough();
    })

    it('should return "promise-value" [doneFn]', (doneFn) => {
      service.getPromiseValue().then((value) => {
        expect(value).toEqual('promise-value');
        doneFn();
      });

      expect(service.getPromiseValue).toHaveBeenCalled();
    })

    it('should return "promise-value" [async/await]', async () => {
      const response = await service.getPromiseValue();

      expect(response).toEqual('promise-value');
      expect(service.getPromiseValue).toHaveBeenCalled();
    })
  });

  describe('Tests for $getObservableValue', () => {

    beforeEach(() => {
      spyOn(service, 'getObservableValue').and.callThrough();
    })

    it('should return "observable-value" [doneFn]', (doneFn) => {
      service.getObservableValue().subscribe((value) => {
        expect(value).toEqual('observable-value');
        doneFn();
      });

      expect(service.getObservableValue).toHaveBeenCalled();
    })

    it('should return "observable-value" [async/await]', async () => {
      const response = await lastValueFrom(service.getObservableValue());

      expect(response).toEqual('observable-value');
      expect(service.getObservableValue).toHaveBeenCalled();
    })
  });

});
