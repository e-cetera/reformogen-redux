import { APIError } from './errors';

describe('errors', () => {
  it('should bla', () => expect(
    () => throw new APIError({ url: 'http://domain.tld/' }, [ 1, 2, 3 ], 1)
  ).toThrowError(APIError));
});
