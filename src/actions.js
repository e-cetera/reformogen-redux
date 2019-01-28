import { 
  BOOTSTRAP,
  CLEANUP,
  SUBMIT, SUBMIT_SUCCESS, SUBMIT_ERROR,
  STORE_FORM_DATA,
  STORE_FORM_METADATA,
  STORE_FIELD_DATA,
  AGENT_EXECUTE_REQUEST_ATTEMPT_FAILED,
  FETCH_NEXT_FIELD_OPTIONS,
  STORE_FIELD_OPTIONS,
  STORE_FIELD_SEARCH_TEXT,
  STORE_FORM_ERRORS,
  CLEAR_FORM_ERRORS,
  STORE_FORM_LOCALE,
  BOOTSTRAP_SUCCESS,
} from './constants';


/** Pass formId, fieldName, and other data addressing/routing attributes just like {meta} */

export const bootstrap = payload => ({
  type: BOOTSTRAP,
  payload,
  meta: { formId: payload.formId }
});

export const bootstrapSuccess = formId => ({
  type: BOOTSTRAP_SUCCESS,
  payload: formId,
  meta: { formId }
});

/**
 * This actions is used whenever the component does its unmount nasty deeds.
 * @param {Object} param0 ownProps
 */
export const cleanup = ({ formId, ...payload }) => ({
  type: CLEANUP,
  payload,
  meta: { formId }
});


/**
 * We pass all own props bundle here
 * @param {ownProps} param0 
 */
export const submit = ({ formId, ...payload }) => ({
  type: SUBMIT,
  payload: { formId, ...payload },  // for convenience only
  meta: { formId }
});



export const submitError = (formId, error) => ({
  type: SUBMIT_ERROR,
  payload: error,
  meta: { formId }
});

export const submitSuccess = formId => ({
  type: SUBMIT_SUCCESS,
  meta: { formId }
});

export const storeFormData = (formId, data) => ({
  type: STORE_FORM_DATA,
  payload: data,
  meta: { formId }
});


export const storeFormMetaData = (formId, metaData) => ({
  type: STORE_FORM_METADATA,
  payload: metaData,
  meta: { formId }
});


export const clearFormErrors = formId => ({
  type: CLEAR_FORM_ERRORS,
  meta: { formId }
});


export const storeFormErrors = (formId, errors) => ({
  type: STORE_FORM_ERRORS,
  payload: errors,
  meta: { formId }
});

export const storeFieldData = (formId, fieldName, value) => ({
  type: STORE_FIELD_DATA,
  payload: value,
  meta: { formId, fieldName }
});


export const failedAgentRequestAttempt = payload => ({ 
  type: AGENT_EXECUTE_REQUEST_ATTEMPT_FAILED, 
  payload 
});


export const fetchNextFieldOptions = ({ formId, fieldName, ...payload }) => ({
  type: FETCH_NEXT_FIELD_OPTIONS, 
  payload,
  meta: { formId, fieldName }
});


export const storeFieldOptions = ({ formId, fieldName, searchText = '', value }) => ({
  type: STORE_FIELD_OPTIONS,
  payload: value,
  meta: { formId, fieldName, searchText }
});


export const storeFieldSearchText = ({ formId, fieldName, searchText = '' }) => ({
  type: STORE_FIELD_SEARCH_TEXT,
  payload: searchText,
  meta: { formId, fieldName, searchText }
});


export const storeFormLocale = ({ formId, locale }) => ({
  type: STORE_FORM_LOCALE,
  payload: locale,
  meta: { formId }
});
