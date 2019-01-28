import { mergeOptions, prefixObjectFields } from './reducer.utils';

describe('reducer.utils', () => {
  it('should prefixObjectFields', () => expect(
    prefixObjectFields('form', { a: 1, b: 2 }, 'cool')
  ).toEqual({
    'Form:form:field:a:cool': 1, 
    'Form:form:field:b:cool': 2
  }));

  it('should mergeOptions', () => expect(
    mergeOptions(
      [
        { id: 1 },
        { id: 2 },
        { id: 3 },
      ],
      [
        { id: 3 },
        { id: 4 },
        { id: 5 },
      ],
    )
  ).toEqual([
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
  ]));
});
