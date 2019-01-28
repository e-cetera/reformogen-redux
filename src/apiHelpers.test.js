import { cloneableGenerator } from 'redux-saga/utils';

import { 
  isCsrfSafeMethod, 
  getDefaultHeaders, 
  processError,
  singleApiCallFactory,
  executeRequest,
} from './apiHelpers';


function getMockedAgent() {
  const mocks = {};
  mocks.timeout = jest.fn(() => mocks);
  mocks.redirects = jest.fn(() => mocks);
  mocks.query = jest.fn(() => mocks);
  mocks.withCredentials =  jest.fn(() => mocks);
  mocks.set = jest.fn(() => mocks);
  mocks.send = jest.fn(() => mocks);

  return { 
    mocks, 
    get: mocks,
    post: mocks,
  };
}

describe('apiHelpers', () => {
  
  describe('isCsrfSafeMethod', () => {
    it('should run without errors', () => expect(
      isCsrfSafeMethod('get')
    ).toEqual(true));
  });
  

  describe('getDefaultHeaders', () => {
    it('should return headers with respect to GET', () => expect(
      getDefaultHeaders({ method: 'get' })
    ).toEqual({}));
    it('should return headers with respect to POST', () => expect(
      Object.keys(getDefaultHeaders({ method: 'post' }))
      // ! it can't read cookies, it's not a browser, token is undefined, but there's a key
    ).toEqual([ 'X-CSRFToken' ]));
  });

  describe('processError', () => {
    const error = new Error('sample');
    const gen = processError('type', error);
    gen.next();
  });
  
  describe('singleApiCallFactory', () => {
    it('should run without errors', () => {
      const processResponse = jest.fn();
      const processError = jest.fn();
      const method = jest.fn(({ raise }) => raise && throw new Error('failed!'));

      const wrappedFn = singleApiCallFactory({
        method,
        processResponse,
        processError,
        types: [ '1', '2', '3' ]
      });

      { // error branch
        const gen = cloneableGenerator(wrappedFn)({ type: 'sample', payload: { raise: 1 }, meta: {} });
        // yield method
        gen.next();
        expect(method).toHaveBeenCalledWith({ raise: 1 });
        const returnValue = gen.next().value;
        expect(returnValue.error).toBeTruthy();
      }

      { // error branch
        const gen = cloneableGenerator(wrappedFn)({ type: 'sample', payload: { raise: 0 }, meta: {} });
        // yield method
        gen.next();
        expect(method).toHaveBeenCalledWith({ raise: 0 });
        // return response
        gen.next(666);
        expect(processResponse).toHaveBeenCalled();
        const returnValue = gen.next().value;
        expect(returnValue.rawResult).toEqual(666);
        expect(returnValue.error).toBeFalsy();
      }

    });
  });

  describe('executeRequest', () => {
    it('should warn user if there are extra args', () => {
      const spy = jest.spyOn(console, 'warn');
      executeRequest({ extra: 1 }).next();
      expect(spy).toHaveBeenCalled();
    });

    it('should raise on unsupported methods', () => 
      expect(
        () => executeRequest({ method: 'die' }).next()
      ).toThrowError()
    );

    it('should run without errors', () => {
      const getHeaders = jest.fn();
      const refineRequest = jest.fn(requestObject => requestObject);
      const { agent, mocks } = getMockedAgent();

      const gen = cloneableGenerator(executeRequest)({
        url: 'http://domain.tld/1',
        retryCount: 1,
        getHeaders,
        refineRequest,
        agent,
      });

      gen.next();
      expect(getHeaders).toHaveBeenCalledWith({
        method: 'get', 
        url: 'http://domain.tld/1'
      });
      gen.next({ header: 'sample' });
      // ! wtf?
      // expect(mocks.set).toHaveBeenCalled();  
      // in for loop now
      expect(refineRequest).toHaveBeenCalled();
      const returnValue = gen.next('done!').value;
      expect(returnValue).toEqual('done!');
    });

    it('should handle some errors with retries', () => {
      const getHeaders = jest.fn();
      const refineRequest = jest.fn(() => {
        const error = new Error();
        error.status = 502;
        throw error;
      });
      const { agent } = getMockedAgent();

      const gen = executeRequest({
        url: 'http://domain.tld/1',
        retryCount: 1,
        getHeaders,
        refineRequest,
        agent,
      });

      // put failedRequestActionCreator
      gen.next(); gen.next();
      gen.next(); 
      
      // the last statement
      expect(() => gen.next()).toThrowError();
    });


    it('should raise immediately if error code is not in retry codes', () => {
      const getHeaders = jest.fn();
      const refineRequest = jest.fn(() => {
        const error = new Error();
        error.status = 502;
        throw error;
      });
      const { agent } = getMockedAgent();

      const gen = executeRequest({
        url: 'http://domain.tld/1',
        retryCount: 1,
        getHeaders,
        refineRequest,
        retryStatusCodes: [0],
        agent,
      });
      gen.next({});
      expect(() => gen.next()).toThrowError();
    });
  });
  
});
