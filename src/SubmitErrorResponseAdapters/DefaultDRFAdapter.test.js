import { DRFSubmitErrorResponseAdapter } from './DefaultDRFAdapter';

describe('DefaultDRFAdapter', () => {
  const adapter = new DRFSubmitErrorResponseAdapter(
    { field1: 'error1', other: 'other!' },
    [ 'field1' ]
  );

  it('should extract non-field errors', () => expect(
    adapter.nonFieldErrors
  ).toEqual({
    other: 'other!'
  }));

  it('should extract field errors', () => expect(
    adapter.fieldErrors
  ).toEqual({
    field1: 'error1'
  }));
});
