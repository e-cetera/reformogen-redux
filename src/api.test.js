function mockFunctions() {
  const original = require.requireActual('./apiHelpers');
  return {
    ...original, //Pass down all the exported objects
    singleApiCallFactory: jest.fn((...args) => args[0]),
    executeRequest: jest.fn((...args) => args[0]),
  };
}
jest.mock('./apiHelpers', () => mockFunctions());
import * as api from './api';
import * as apiHelpers from './apiHelpers';
import { responseAdapterRegistry } from './ListResponseAdapters/registry';

class FakeAdapter {}

responseAdapterRegistry.register(/.*/, FakeAdapter);

describe('api smoke', () => {
  it('should smoke fetchFormMetadata', () => {
    expect(Object.keys(api.fetchFormMetadata)).toEqual([ 'method', 'types' ]);
    api.fetchFormMetadata.method('opts');
    expect(apiHelpers.executeRequest).toHaveBeenCalledWith('opts');
  });

  it('should smoke fetchFormData', () => {
    expect(Object.keys(api.fetchFormData)).toEqual([ 'method', 'types' ]);
    api.fetchFormData.method('opts');
    expect(apiHelpers.executeRequest).toHaveBeenCalledWith('opts');
  });

  it('should smoke saveFormFile', () => {
    expect(Object.keys(api.saveFormFile)).toEqual([ 'method', 'types' ]);
    const { refineRequest } = api.saveFormFile.method({ filename: 1 });
    const attach = jest.fn();
    refineRequest({
      attach,
    });
    expect(attach).toHaveBeenCalled();    
    expect(apiHelpers.executeRequest).toHaveBeenCalled();
  });

  it('should smoke saveFormData', () => {
    expect(Object.keys(api.saveFormData)).toEqual([ 'method', 'types' ]);
    api.saveFormData.method('opts');
    expect(apiHelpers.executeRequest).toHaveBeenCalledWith('opts');
  });

  it('should smoke searchDataFieldOptions', () => {
    expect(Object.keys(api.searchDataFieldOptions)).toBeTruthy();
    api.searchDataFieldOptions.method({ url: '1', page: '2', searchText: '3' });
    api.searchDataFieldOptions.processResponse({
      response: {},
      payload: { url: 'http://sample.com/' }
    });
    expect(apiHelpers.executeRequest).toHaveBeenCalledWith('opts');
  });
});
