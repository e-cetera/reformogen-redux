import { map, isEmpty } from 'lodash';

import { all, put, takeEvery, select } from 'redux-saga/effects';

import { 
  BOOTSTRAP, BOOTSTRAP_ERROR,
  FETCH_NEXT_FIELD_OPTIONS,
  SUBMIT,
} from './constants';
import * as selectors from './selectors';
import * as api from './api';
import { processError } from './apiHelpers';
import * as actions from './actions';


export function* bootstrap({ payload, meta }) {
  const [ describeUrl, objectUrl ] = yield all([
    select(selectors.describeUrl, payload),
    select(selectors.objectUrl, payload),
  ]);

  yield put(actions.storeFormLocale(payload));

  const gathered = [
    api.fetchFormMetadata({
      payload: { url: describeUrl, locale: payload.locale },
      meta: { formId: meta.formId }
    })
  ];

  objectUrl && gathered.push(api.fetchFormData({
    payload: { url: objectUrl, locale: payload.locale },
    meta: { formId: meta.formId }
  }));

  const [ 
    { error: fetchFormMetadataError }, 
    { error: fetchFormDataError } = {}
  ] = yield all(gathered);

  if (fetchFormMetadataError !== undefined || fetchFormDataError !== undefined) 
    return yield processError(
      BOOTSTRAP_ERROR, 
      fetchFormMetadataError,
      { arguments: arguments }
    );

  yield initializeRelatedFieldOptions(meta.formId);

  yield put(actions.bootstrapSuccess(meta.formId));
  return true;
}

/**
 * This function initially populates field's options with the data received
 * from the server. So, if an M2M field has value: [ {object1}, {object2} ],
 * those object will have been placed into the field's choices list.
 * @param {String} formId 
 */
export function* initializeRelatedFieldOptions(formId) {
  const m2mFields = yield select(selectors.metaDataM2MRemoteFields, { formId });
  for (const fieldName of map(m2mFields, 'name')) {
    const value = yield select(selectors.storedFieldValue, { formId, name: fieldName });
    if (isEmpty(value))
      continue;
    
    yield put(actions.storeFieldOptions({ formId, searchText: '', fieldName, value }));
  }

  // TODO: Need some DRY here
  const fkFields = yield select(selectors.metaDataFKRemoteFields, { formId });
  for (const fieldName of map(fkFields, 'name')) {
    const value = yield select(selectors.storedFieldValue, { formId, name: fieldName });
    if (isEmpty(value))
      continue;
    
    yield put(actions.storeFieldOptions({ formId, searchText: '', fieldName, value: [ value ] }));
  }
}

export function* fetchNextFieldOptions({ payload, meta }) {
  // TODO: Remove this code after a while
  // const keyPrefix = `Form:${meta.formId}:field:${meta.fieldName}:q:${payload.searchText}`;
  // const formogen = yield select(selectors.formogen);
  // const nextPageNumber = formogen[`${keyPrefix}:nextPageNumber`];
  // const currentPageNumber = formogen[`${keyPrefix}:currentPageNumber`];


  // Reducer stores payload.searchText in state too, so it's accessible from the selectors
  const [ currentPageNumber, nextPageNumber ] = yield all([
    select(selectors.fieldOptionsCurrentPageNumber, { formId: meta.formId, name: meta.fieldName }),
    select(selectors.fieldOptionsNextPageNumber, { formId: meta.formId, name: meta.fieldName }),
  ]);

  let requestPageNumber = meta.page * 1 || nextPageNumber * 1 || (currentPageNumber * 1 + 1) || 1;
  if (nextPageNumber === null || !requestPageNumber || isNaN(requestPageNumber)) {
    // even if we have nothing to do, we must change current searchText
    yield put(actions.storeFieldSearchText({ 
      formId: meta.formId, 
      fieldName: meta.fieldName,
      searchText: payload.searchText,
    }));
    payload.callback();
    return;
  }

  yield api.searchDataFieldOptions({
    payload: { 
      searchText: payload.searchText, 
      url: payload.url, 
      page: requestPageNumber,
    },
    meta: { 
      formId: meta.formId, 
      fieldName: meta.fieldName, 
      searchText: payload.searchText,
    }
  });

  payload.callback();
}


/**
 * 1. Saves form data without files. 
 * 2. If there're some files, save them next, only if there were no errors during saving the form.
 * First argument is an action that contains the whole ownProps bundle in the payload.
 * @param {object} param0 
 */
export function* submit({ payload, meta }) {
  const [ formData, fieldNames ] = yield all([
    select(selectors.finalFormData, payload),
    select(selectors.metaDataFieldNames, payload),
  ]);

  // saveUrl may vary; 
  // saving method is usually POST or PUT
  const [ formSaveUrl, formSaveHTTPMethod ] = yield all([
    select(selectors.formSaveUrl, payload),
    select(selectors.formSaveHTTPMethod, payload)
  ]);

  const { result: formSaveResult, error: formSaveError } = yield api.saveFormData({
    payload: { 
      url: formSaveUrl, 
      locale: payload.locale, 
      method: formSaveHTTPMethod,
      data: formData,
    },
    meta: { formId: meta.formId }
  });

  // Clean up the old errors or get some user confused.
  yield put(actions.clearFormErrors(meta.formId));

  // If we have an error, we handle only the 400 bad request
  // other errors must be processed somewhere else
  if (formSaveError !== undefined) {
    if (formSaveError.response?.badRequest !== true) 
      return yield put(actions.submitError(meta.formId, formSaveError));

    // now we can just store errors and leave this damned branch
    return yield put(actions.storeFormErrors(
      meta.formId, 
      payload.processSubmitError(formSaveError.response.body, fieldNames)
    ));
  }

  // It's expected the server returns a saved object back with its id included.
  // So, if form hasn't been reloaded after success after all, it's better to synchronize
  // redux state with the data received from the server (because it's possible that the 
  // server computes the final object state based on some other fields).
  // ! Anyway it's a weird behaviour that couldn't been taken into account in
  // ! an explicit way, that's why store is patched with an id and __urls__ only.
  // yield put(storeFormData(meta.formId, formSaveResult));
  // It's just unwanted to deal with possibly corrupted serializer's data schemes,
  // so it's easier to cull from the response only the stuff had brought up in conventions
  // previously.
  yield put(actions.storeFormData(meta.formId, { 
    // NOTE: using just `id` here is bad. Have to provide some identity getter.
    id: formSaveResult.id,
    // `__urls__` bundle is used against the ongoing saving attempts.
    __urls__: formSaveResult.__urls__
  }));

  const formFiles = yield select(selectors.dirtyFormFiles, payload);
  // the next step is to save all files, if there're some
  if (!formFiles.length) {
    yield put(actions.submitSuccess(meta.formId));
    yield put(actions.bootstrap(payload));
    return;
  }

  const { errors: uploadFormFilesErrors } = yield uploadFormFiles(meta.formId, formFiles);
  if (uploadFormFilesErrors.length === 0) {
    yield put(actions.submitSuccess(meta.formId));
    yield put(actions.bootstrap(payload));
    return;
  }

  yield put(actions.submitError(meta.formId, uploadFormFilesErrors));
}

export function* uploadFormFiles(formId, formFiles) {
  const tasks = formFiles.map(fileBundle => api.saveFormFile({
    payload: fileBundle,
    meta: { formId, fieldName: fileBundle.fieldName }
  }));

  // In this case it's better to save files one by one since 
  // there are still too many users with slow internet connection.
  // It's too easy to get request timeout here.
  // TODO: split each file up to X chunks and make sure it's possible to push a single chunk through the request timeout window.
  const errors = [];
  const results = [];
  for (const task of tasks) {
    const { result: fileUploadResult, error: fileUploadError, meta } = yield task;
    // We can either skip sending pending files, or keep going.
    // At this moment we prefer keep going, but it's a
    // TODO: add some option to override this behaviour

    if (fileUploadError !== undefined) {
      errors.push({ error: fileUploadError, meta });
      continue;
    }

    results.push({ result: fileUploadResult, meta });
  }

  // just return something, actually we don't need all this stuff
  return { errors, results };
}


export function* formogenSagas() {
  yield all([
    takeEvery(BOOTSTRAP, bootstrap),
    takeEvery(FETCH_NEXT_FIELD_OPTIONS, fetchNextFieldOptions),
    takeEvery(SUBMIT, submit),
  ]);
}
