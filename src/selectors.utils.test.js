import { coerceFieldValueToItsType } from './selectors.utils';

describe('selectors.utils', () => {
  describe('coerceFieldValueToItsType', () => {
    
    it('should coerce BooleanField', () => expect(
      coerceFieldValueToItsType('BooleanField', '')
    ).toEqual(false));

    it('should coerce CharField', () => expect(
      coerceFieldValueToItsType('CharField', '')
    ).toEqual(''));

    it('should coerce TextField', () => expect(
      coerceFieldValueToItsType('TextField', '')
    ).toEqual(''));
    
    describe('ManyToManyField behaviour', () => {
      it('should coerce to empty string to undefined', () => expect(
        coerceFieldValueToItsType('ManyToManyField', '')
      ).toEqual(undefined));
  
      it('should coerce falsy values to undefined', () => expect(
        coerceFieldValueToItsType('ManyToManyField', undefined)
      ).toEqual(undefined));
  
      it('should return the same value if it has a potentially wrong type', () => {
        const spy = jest.spyOn(console, 'warn');
        expect(
          coerceFieldValueToItsType('ManyToManyField', 'sample!')
        ).toEqual('sample!');
        expect(spy).toHaveBeenCalled();
      });
  
      it('should return undefined if a given value is an empty array', () => expect(
        coerceFieldValueToItsType('ManyToManyField', [])
      ).toEqual(undefined));
  
      it('should return leave the value untouched if it is an array of numbers', () => expect(
        coerceFieldValueToItsType('ManyToManyField', [1, 2, 3])
      ).toEqual([1, 2, 3]));
  
      it('should extract ids from value if it is an array of objects', () => expect(
        coerceFieldValueToItsType('ManyToManyField', [{ id: 1 }])
      ).toEqual([1]));
    });
    
    describe('ForeignKey behaviour', () => {
      it('should coerce falsy values to undefined', () => expect(
        coerceFieldValueToItsType('ForeignKey', undefined)
      ).toEqual(undefined));

      it('should leave the value untouched if it is not an object', () => expect(
        coerceFieldValueToItsType('ForeignKey', 'sample')
      ).toEqual('sample'));

      it('should extract an id from object', () => expect(
        coerceFieldValueToItsType('ForeignKey', { id: 1 })
      ).toEqual(1));
    });
  });
});
