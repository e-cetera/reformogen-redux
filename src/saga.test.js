import { cloneableGenerator } from 'redux-saga/utils';
import { all, put, select } from 'redux-saga/effects';


import * as selectors from './selectors';
import { 
  bootstrap, 
  initializeRelatedFieldOptions, 
  fetchNextFieldOptions, 
  submit,
  uploadFormFiles
} from './saga';
import * as actions from './actions';
import * as api from './api';
import * as apiHelpers from './apiHelpers';

// eslint-disable-next-line
apiHelpers.processError = jest.fn((...args) => args);
// eslint-disable-next-line
api.fetchFormMetadata = jest.fn((...args) => args);
// eslint-disable-next-line
api.fetchFormData = jest.fn((...args) => args);
// eslint-disable-next-line
api.searchDataFieldOptions = jest.fn((...args) => args);
// eslint-disable-next-line
api.saveFormData = jest.fn((...args) => args);
// eslint-disable-next-line
api.saveFormFile = jest.fn((...args) => args);


describe('saga', () => {

  describe('bootstrap', () => {
    it('should bootstrap without errors', () => {
      const payload = {  // nothing else but ownProps
        formId: 'FORMID',
        locale: 'en',
      };
      const meta = {
        formId: 'FORMID',
      };
  
      const gen = cloneableGenerator(bootstrap)({ payload, meta });
  
      expect(gen.next().value).toEqual(
        all([
          select(selectors.describeUrl, payload),
          select(selectors.objectUrl, payload),
        ])
      );
  
      expect(gen.next([ 
        'http://sample.test/describe/', 
        'http://sample.test/object/111/' 
      ]).value).toEqual(
        put(actions.storeFormLocale(payload))
      );
  
      gen.next('whocares');
  
      expect(api.fetchFormData).toHaveBeenCalledWith({
        meta: { formId: 'FORMID' },
        payload: {
          locale: 'en',
          url: 'http://sample.test/object/111/'
        }
      });
  
      expect(api.fetchFormMetadata).toHaveBeenCalledWith({
        meta: { formId: 'FORMID' }, 
        payload: {
          locale: 'en', 
          url: 'http://sample.test/describe/'
        }
      });
  
      
      { // error handling branch
        const errorHandlerGen = gen.clone();
        errorHandlerGen.next([
          { error: 1 },
          { error: 1 }
        ]);
        expect(apiHelpers.processError).toHaveBeenCalled();
      }
  
      expect(gen.next([ { value: 1 }, { value: 1 } ]).value).toEqual(
        initializeRelatedFieldOptions('FORMID')
      );
  
      expect(gen.next('who cares').value).toEqual(
        put(actions.bootstrapSuccess('FORMID'))
      );
  
      expect(gen.next('who cares').value).toEqual(true);
  
    });
  });
  describe('fetchNextFieldOptions', () => {
    it('should run without errors', () => {
      const triggeredOnFinishCallback = jest.fn();
      const gen = cloneableGenerator(fetchNextFieldOptions)({ 
        payload: { 
          callback: triggeredOnFinishCallback, 
          searchText: 'text',
          url: 'https://domain.tld/'
        }, 
        meta: { formId: 'FORMID', fieldName: 'FIELD' } 
      });
      gen.next();
      
      { // get entered here if there are no pages to load
        const shortBranchNothingToDo = gen.clone();
        // set currentPageNumber, nextPageNumber
        shortBranchNothingToDo.next([ 1, null ]);
        // read put
        shortBranchNothingToDo.next();
        // callback()
        expect(triggeredOnFinishCallback).toHaveBeenCalled();
      }

      // set currentPageNumber, nextPageNumber
      gen.next([ 1, 2 ]);
      gen.next();

      expect(api.searchDataFieldOptions).toHaveBeenCalledWith({
        meta: {
          fieldName: 'FIELD',
          formId: 'FORMID',
          searchText: 'text'
        }, 
        payload: {
          page: 2,
          searchText: 'text',
          url: 'https://domain.tld/'
        }
      });
      
      expect(triggeredOnFinishCallback).toHaveBeenCalled(); 
    });
  });
  describe('submit', () => {
    it('should run without errors', () => {
      const processSubmitError = jest.fn();
      const gen = cloneableGenerator(submit)({ 
        payload: { locale: 'en', processSubmitError }, 
        meta: { formId: 'FORMID' } 
      });
      gen.next();
      // formData, fieldNames
      gen.next([ { a: 1 }, ['a'] ]);
      
      // formSaveUrl, formSaveHTTPMethod
      gen.next([ 'https://domain.tld/', 'PUT' ]);
      expect(api.saveFormData).toHaveBeenCalledWith({
        meta: { formId: 'FORMID' }, 
        payload: {
          data: { a: 1 }, 
          locale: 'en', 
          method: 'PUT', 
          url: 'https://domain.tld/'
        }
      });

      { 
        { // on some strange errors
          const otherErrorsBranchGen = gen.clone();
          otherErrorsBranchGen.next({ error: { response: { badRequest: false, body: 'sample' } } });
          // skip put clear errors
          otherErrorsBranchGen.next();
        }
        { // bad requests, user must fix errors
          const badRequestBranchGen = gen.clone();
          badRequestBranchGen.next({ error: { response: { badRequest: true, body: 'sample' } } });
          badRequestBranchGen.next();
          expect(processSubmitError).toHaveBeenCalledWith('sample', ['a']);
        }
      }
      gen.next({ result: { id: 1, __urls__: {} } });
      // skip store form data
      gen.next();
      gen.next();

      { // saved files with no errors
        const withFilesBranchGen = gen.clone();
        withFilesBranchGen.next([ {} ]);  // has one file
        withFilesBranchGen.next({ errors: [] });
        // put bootstrap
        withFilesBranchGen.next();
        withFilesBranchGen.next();
      }

      { // saved files with errors
        const withFailedFilesBranch = gen.clone();
        withFailedFilesBranch.next([ {} ]);  // has one file
        withFailedFilesBranch.next({ errors: [ { error: 1 } ] });
        withFailedFilesBranch.next();
      }

      { // no files
        const noFilesBranchGen = gen.clone();
        noFilesBranchGen.next([]); 
        noFilesBranchGen.next();
        noFilesBranchGen.next();
      }

    });
  });
  
  describe('uploadFormFiles', () => {
    it('should run without errors', () => {
      const gen = cloneableGenerator(uploadFormFiles)(
        'FORMID', [
          // only one file for testing purpose
          { fieldName: 'FIELD' }
        ]
      );
      gen.next();

      expect(api.saveFormFile).toBeCalledWith({
        meta: { fieldName: 'FIELD', formId: 'FORMID' }, 
        payload: { fieldName: 'FIELD' }
      });

      {
        const withoutErrorsBranchGen = gen.clone();
        const returnValue = withoutErrorsBranchGen.next({ result: 1, meta: 2 }).value;
        expect(returnValue).toEqual({ 
          errors: [], 
          results: [ { result: 1, meta: 2 } ] 
        });
      }

      {
        const withErrorsBranchGen = gen.clone();
        const returnValue = withErrorsBranchGen.next({ error: 1, meta: 2 }).value;
        expect(returnValue).toEqual({ 
          errors: [ { error: 1, meta: 2 } ], 
          results: [] 
        });
      }

    });
  });
  

});
