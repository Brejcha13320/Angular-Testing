import { Person } from "./person.model";


describe('Person', () => {
  let person: Person;

  beforeEach(() => {
    person = new Person('Jesus', 'Mejia', 38, 40, 1.65);
    spyOn(person, 'calcIMC').and.callThrough();
  });

  it('should have the correct attributes', () => {
    expect(person.name).toEqual('Jesus');
    expect(person.lastName).toEqual('Mejia');
    expect(person.age).toEqual(38);
    expect(person.weight).toEqual(40);
    expect(person.height).toEqual(1.65);
  });

  describe('Tests for #calcIMC', () => {
    it('should return down ', () => {
      person.weight = 40;
      person.height = 1.65;

      const imc = person.calcIMC();

      expect(imc).toEqual('down');
      expect(person.calcIMC).toHaveBeenCalled();
    });

    it('should return normal', () => {
      person.weight = 60;
      person.height = 1.65;

      const imc = person.calcIMC();

      expect(imc).toEqual('normal');
      expect(person.calcIMC).toHaveBeenCalled();
    });

    it('should return overweight', () => {
      person.weight = 65;
      person.height = 1.60;

      const imc = person.calcIMC();

      expect(imc).toEqual('overweight');
      expect(person.calcIMC).toHaveBeenCalled();
    });

    it('should return overweight level 1', () => {
      person.weight = 70;
      person.height = 1.60;

      const imc = person.calcIMC();

      expect(imc).toEqual('overweight level 1');
      expect(person.calcIMC).toHaveBeenCalled();
    });

    it('should return overweight level 2', () => {
      person.weight = 80;
      person.height = 1.60;

      const imc = person.calcIMC();

      expect(imc).toEqual('overweight level 2');
      expect(person.calcIMC).toHaveBeenCalled();
    });

    it('should return overweight level 3', () => {
      person.weight = 110;
      person.height = 1.60;

      const imc = person.calcIMC();

      expect(imc).toEqual('overweight level 3');
      expect(person.calcIMC).toHaveBeenCalled();
    });

    it('should return not found', () => {
      person.weight = -50;
      person.height = 1.60;

      const imc = person.calcIMC();

      expect(imc).toEqual('not found');
      expect(person.calcIMC).toHaveBeenCalled();
    });
  });

});
