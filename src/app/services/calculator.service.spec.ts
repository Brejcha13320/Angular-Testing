import { TestBed } from '@angular/core/testing';

import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Tests for #multiply', () => {
    it('should return 9', () => {
      //Arrange
      const calculatorService = new CalculatorService();

      //Act
      const rta = calculatorService.multiply(3, 3);

      //Assert
      expect(rta).toEqual(9);
    });
    it('should return 12', () => {
      //Arrange
      const calculatorService = new CalculatorService();

      //Act
      const rta = calculatorService.multiply(3, 4);

      //Assert
      expect(rta).toEqual(12);
    });
    it('should return a * b', () => {
      //Arrange
      const a = 3;
      const b = 5;
      const calculatorService = new CalculatorService();

      //Act
      const rta = calculatorService.multiply(a, b);

      //Assert
      expect(rta).toEqual(a * b);
    });
  });

  describe('Tests for #divide', () => {
    it('should return 5', () => {
      //Arrange
      const calculatorService = new CalculatorService();

      //Act
      const rta = calculatorService.divide(10, 2);

      //Assert
      expect(rta).toEqual(5);
    });
    it('should return 10', () => {
      //Arrange
      const calculatorService = new CalculatorService();

      //Act
      const rta = calculatorService.divide(30, 3);

      //Assert
      expect(rta).toEqual(10);
    });
    it('should return a / b', () => {
      //Arrange
      const a = 3;
      const b = 3;
      const calculatorService = new CalculatorService();

      //Act
      const rta = calculatorService.divide(a, b);

      //Assert
      expect(rta).toEqual(a / b);
    });

    it('should return null if denominator is 0', () => {
      //Arrange
      const calculatorService = new CalculatorService();

      //Act
      const rta = calculatorService.divide(10, 0);

      //Assert
      expect(rta).toBeNull();
    });
  });
});
