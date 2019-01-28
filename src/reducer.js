import { pickBy } from 'lodash';

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
import { mergeOptions, prefixObjectFields } from './reducer.utils';

export function formogenReducer(state = {}, action) {
  const { type, payload, meta: { formId, fieldName, searchText }={} } = action;

  const relatedFieldSearchKeyPrefix = `Form:${formId}:field:${fieldName}:q:${searchText}`;

  switch (type) {
    /* ---------- */
    /* STORE FORM */
    case STORE_FORM_DATA:
      return {
        ...state,
        ...prefixObjectFields(formId, payload, 'stored')
      };

    case STORE_FORM_METADATA:
      return {
        ...state,
        [ `Form:${formId}:metaData` ]: payload,
      };

    case STORE_FORM_ERRORS:
      return {
        ...state,
        [ `Form:${formId}:fieldErrors` ]: payload.fieldErrors,
        [ `Form:${formId}:nonFieldErrors` ]: payload.nonFieldErrors,
      };

    case CLEAR_FORM_ERRORS:
      return {
        ...state,
        [ `Form:${formId}:fieldErrors` ]: {},
        [ `Form:${formId}:nonFieldErrors` ]: {},
      };  

    case STORE_FORM_LOCALE:
      return {
        ...state,
        [ `Form:${formId}:locale` ]: payload,
      };

      /* ---------- */
      /* FORM FETCH */
      /* ---------- */

    case FETCH_FORM_METADATA_SUCCESS:
      return {
        ...state,
        [ `Form:${formId}:metaData` ]: payload,
      };

    case FETCH_FORM_DATA_SUCCESS:
      return {
        ...state,
        ...prefixObjectFields(formId, payload, 'stored')
      };

    case FETCH_NEXT_FIELD_OPTIONS_SUCCESS:
      return {
        ...state,
        [ `${relatedFieldSearchKeyPrefix}:options` ]: mergeOptions(
          state[ `${relatedFieldSearchKeyPrefix}:options` ],
          payload.list
        ),
        [ `${relatedFieldSearchKeyPrefix}:nextPageNumber` ]: payload.nextPageNumber,
        [ `${relatedFieldSearchKeyPrefix}:currentPageNumber` ]: payload.currentPageNumber,
        [ `Form:${formId}:field:${fieldName}:q` ]: searchText,
      };
      
      /* ----- */ 
      /* CLEAR */
      /* ----- */ 

    case CLEANUP:
      return pickBy(
        state, 
        (value, key) => !key.startsWith(`Form:${formId}`)
      );

      /* ----------- */
      /* STORE FIELD */
      /* ----------- */

    case STORE_FIELD_DATA:
      return {
        ...state,
        [ `Form:${formId}:field:${fieldName}:dirty` ]: payload,
      };

    case STORE_FIELD_OPTIONS:
      return {
        ...state,
        [ `${relatedFieldSearchKeyPrefix}:options` ]: payload,
      };

    case STORE_FIELD_SEARCH_TEXT:
      return {
        ...state,
        [ `Form:${formId}:field:${fieldName}:q` ]: searchText,
      };

    default:
      return state;
  }
}
