import { TestBed } from '@angular/core/testing';

import { MasterService } from './master.service';
import { ValueService } from './value.service';

describe('MasterService', () => {
  let service: MasterService;
  let valueServiceSpy: jasmine.SpyObj<ValueService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ValueService', ['getValue']);

    TestBed.configureTestingModule({
      providers: [
        MasterService,
        { provide: ValueService, useValue: spy }
      ],
    });
    service = TestBed.inject(MasterService);
    valueServiceSpy = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Tests for #getValue', () => {

    it('should return "mocked-value"', () => {
      const mockedValue = "mocked-value";
      spyOn(service, 'getValue').and.returnValue(mockedValue);

      expect(service.getValue()).toEqual(mockedValue);
      expect(service.getValue).toHaveBeenCalled();
    })

    it('should call to getValue from ValueService', () => {
      const mockedValue = "mocked-value";
      valueServiceSpy.getValue.and.returnValue(mockedValue);
      spyOn(service, 'getValue').and.callThrough();

      expect(service.getValue()).toEqual(mockedValue);
      expect(service.getValue).toHaveBeenCalled();
      expect(valueServiceSpy.getValue).toHaveBeenCalled();
    })

  })

});
