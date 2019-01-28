import { formogenReducer } from './reducer';
import { 
  CLEANUP,

  STORE_FORM_DATA, 
  STORE_FORM_METADATA, 
  
  STORE_FORM_ERRORS,
  STORE_FORM_LOCALE,
  CLEAR_FORM_ERRORS,
  
  FETCH_FORM_METADATA_SUCCESS,
  FETCH_FORM_DATA_SUCCESS,
  FETCH_NEXT_FIELD_OPTIONS_SUCCESS, 

  STORE_FIELD_SEARCH_TEXT,
  STORE_FIELD_DATA, 
  STORE_FIELD_OPTIONS,
} from './constants';
import * as actions from './actions';

describe('reducer', () => {

  it(`should reduce ${STORE_FORM_DATA}`, () => expect(
    formogenReducer(
      {}, actions.storeFormData('FORMID', { a: 1, b: 2 })
    )
  ).toEqual({
    'Form:FORMID:field:a:stored': 1,
    'Form:FORMID:field:b:stored': 2,
  }));

  it(`should reduce ${STORE_FORM_METADATA}`, () => expect(
    formogenReducer(
      {}, actions.storeFormMetaData('FORMID', 'metadata')
    )
  ).toEqual({
    'Form:FORMID:metaData': 'metadata'
  }));

  it(`should reduce ${STORE_FORM_ERRORS}`, () => expect(
    formogenReducer(
      {}, actions.storeFormErrors('FORMID', { nonFieldErrors: 1, fieldErrors: 2 })
    )
  ).toEqual({
    'Form:FORMID:fieldErrors': 2,
    'Form:FORMID:nonFieldErrors': 1,
  }));

  it(`should reduce ${CLEAR_FORM_ERRORS}`, () => expect(
    formogenReducer(
      {
        'Form:FORMID:fieldErrors': 2,
        'Form:FORMID:nonFieldErrors': 1,
      }, 
      actions.clearFormErrors('FORMID')
    )
  ).toEqual({
    'Form:FORMID:fieldErrors': {},
    'Form:FORMID:nonFieldErrors': {},
  }));

  it(`should reduce ${STORE_FORM_LOCALE}`, () => expect(
    formogenReducer(
      {}, actions.storeFormLocale({ formId: 'FORMID', locale: 'en' })
    )
  ).toEqual({
    'Form:FORMID:locale': 'en'
  }));

  it(`should reduce ${FETCH_FORM_METADATA_SUCCESS}`, () => expect(
    formogenReducer(
      {}, {
        type: FETCH_FORM_METADATA_SUCCESS,
        payload: 1,
        meta: { formId: 'FORMID' }
      }
    )
  ).toEqual({
    'Form:FORMID:metaData': 1
  }));

  it(`should reduce ${FETCH_FORM_DATA_SUCCESS}`, () => expect(
    formogenReducer(
      {}, {
        type: FETCH_FORM_DATA_SUCCESS,
        payload: { a: 1, b: 2 },
        meta: { formId: 'FORMID' }
      }
    )
  ).toEqual({
    'Form:FORMID:field:a:stored': 1, 
    'Form:FORMID:field:b:stored': 2
  }));

  it(`should reduce ${FETCH_NEXT_FIELD_OPTIONS_SUCCESS}`, () => expect(
    formogenReducer(
      {}, {
        type: FETCH_NEXT_FIELD_OPTIONS_SUCCESS,
        payload: {
          list: [ { id: 1 } ],
          nextPageNumber: 2,
          currentPageNumber: 1,
        },
        meta: { 
          formId: 'FORMID',
          fieldName: 'field',
          searchText: 'search',
        }
      }
    )
  ).toEqual({
    'Form:FORMID:field:field:q': 'search', 
    'Form:FORMID:field:field:q:search:currentPageNumber': 1, 
    'Form:FORMID:field:field:q:search:nextPageNumber': 2, 
    'Form:FORMID:field:field:q:search:options': [{ id: 1 }]
  }));

  it(`should reduce ${STORE_FIELD_DATA}`, () => expect(
    formogenReducer(
      {}, actions.storeFieldData('FORMID', 'name', 'value')
    )
  ).toEqual({
    'Form:FORMID:field:name:dirty': 'value'
  }));

  it(`should reduce ${STORE_FIELD_OPTIONS}`, () => expect(
    formogenReducer(
      {}, actions.storeFieldOptions({ 
        formId: 'FORMID',  
        fieldName: 'field',
        searchText: 'search',
        value: [ { id: 1 } ]
      })
    )
  ).toEqual({
    'Form:FORMID:field:field:q:search:options': [{'id': 1}]
  }));

  it(`should reduce ${STORE_FIELD_SEARCH_TEXT}`, () => expect(
    formogenReducer(
      {}, actions.storeFieldSearchText({
        formId: 'FORMID',  
        fieldName: 'field',
        searchText: 'search',
      })
    )
  ).toEqual({
    'Form:FORMID:field:field:q': 'search'
  }));

  it(`should reduce ${CLEANUP}`, () => expect(
    formogenReducer(
      { 'Form:FORMID': 1 }, 
      actions.cleanup({ formId: 'FORMID' })
    )
  ).toEqual({}));
  

  it(`should reduce ${CLEANUP}`, () => expect(
    formogenReducer(
      {}, {}
    )
  ).toEqual({}));
});
