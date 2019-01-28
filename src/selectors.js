import { createSelector } from 'reselect';
import { isString, zip, map, fromPairs, keyBy } from 'lodash';

import { coerceFieldValueToItsType } from './selectors.utils';


export const formogen = state => state.formogen;
export const props = (state, props) => props;

export const formId = createSelector(props, props => props.formId);
export const fieldName = createSelector(props, props => props.name);

/**
 * ! CONVENTION: __urls__ service field must have shape of an object:
 * { create, read, update, delete, describe, describe_object }
 */
export const objectUrls = createSelector(
  [ formogen, formId ],
  (formogen, formId) => 
    formogen[ `Form:${formId}:field:__urls__:stored` ] ||
    formogen[ `Form:${formId}:field:urls:stored` ]
);

/**
 * If we have an object loaded, we must use the object's urls first.
 */
export const describeUrl = createSelector(
  [ props, objectUrls ], 
  (props, objectUrls) => 
    objectUrls?.describe_object || objectUrls?.describe || props.describeUrl
);

/**
 * If we have an object loaded, we must use the object's urls first.
 */
export const createUrl = createSelector(
  [ props, objectUrls ], 
  (props, objectUrls) => 
    objectUrls?.create || props.createUrl
);

/**
 * If we have an object loaded, we must use the object's urls first.
 */
export const objectUrl = createSelector(
  [ props, objectUrls ], 
  (props, objectUrls) => 
    objectUrls?.read || props.objectUrl
);

export const metaData = createSelector(
  [ formogen, formId ], 
  (formogen, formId) => formogen[ `Form:${formId}:metaData` ]
);

export const metaDataFields = createSelector(
  metaData, metaData => metaData.fields
);

export const metaDataFieldNames = createSelector(
  metaData, metaData => map(metaData.fields, 'name')
);

export const metaDataNonFileFields = createSelector(
  metaDataFields, metaDataFields => metaDataFields.filter(value => 
    ![ 'FileField', 'ImageField' ].includes(value.type)
  )
);

export const metaDataFileFields = createSelector(
  metaDataFields, metaDataFields => metaDataFields.filter(value => 
    [ 'FileField', 'ImageField' ].includes(value.type)
  )
);

export const metaDataM2MRemoteFields = createSelector(
  metaDataFields, metaDataFields => metaDataFields.filter(value => 
    isString(value.data) && value.type === 'ManyToManyField'
  )
);

export const metaDataFKRemoteFields = createSelector(
  metaDataFields, metaDataFields => metaDataFields.filter(value => 
    isString(value.data) && value.type === 'ForeignKey'
  )
);

export const metaDataDefaultsMap = createSelector(
  metaDataFields, 
  metaDataFields => zip(
    map(metaDataFields || [], 'name'),
    map(metaDataFields || [], 'default')
  ) |> (pairs => pairs.filter(([ , value ]) => value !== undefined))
    |> fromPairs
);

export const metaDataFieldsByNameMap = createSelector(
  metaDataFields, 
  metaDataFields => keyBy(metaDataFields, 'name')
);

export const formData = createSelector(
  [ formogen, formId ], 
  (formogen, formId) => formogen[`Form:${formId}:data`]
);

export const fieldErrors = createSelector(
  [ formogen, formId, fieldName ],
  (formogen, formId, fieldName) => 
    (formogen[`Form:${formId}:fieldErrors`] || {})[ fieldName ]
);

export const legacyNonFieldErrorsMap = createSelector(
  [ formogen, formId ],
  (formogen, formId) => 
    formogen[`Form:${formId}:nonFieldErrors`]
);

export const defaultFieldValue = createSelector(
  [ fieldName, metaDataDefaultsMap ],
  (fieldName, metaDataDefaultsMap) => metaDataDefaultsMap[fieldName]
);
export const storedFieldValue = createSelector(
  [ formogen, formId, fieldName ],
  (formogen, formId, fieldName) => 
    formogen[`Form:${formId}:field:${fieldName}:stored`] 
);
export const dirtyFieldValue = createSelector(
  [ formogen, formId, fieldName ],
  (formogen, formId, fieldName) => 
    formogen[`Form:${formId}:field:${fieldName}:dirty`] 
);
export const initialFieldValue = createSelector(
  [ storedFieldValue, defaultFieldValue ],
  (storedFieldValue, defaultFieldValue) => {
    const value = storedFieldValue || defaultFieldValue;
    if (value === undefined)
      return '';
    return value;
  }
);
export const finalFieldValue = createSelector(
  [ dirtyFieldValue, storedFieldValue, defaultFieldValue ],
  (...args) => [ ...args, '' ].filter(val => val !== undefined)[0]
);

export const objectId = createSelector(
  [ formogen, formId ],
  (formogen, formId) => 
    formogen[`Form:${formId}:field:id:stored`] 
);

export const asyncFieldInputSearch = createSelector(
  [ formogen, formId, fieldName ],
  (formogen, formId, fieldName) => {
    return formogen[ `Form:${formId}:field:${fieldName}:q` ];
  }
);

export const fieldOptionsNextPageNumber = createSelector(
  [ formogen, formId, fieldName, asyncFieldInputSearch ],
  (formogen, formId, fieldName, asyncFieldInputSearch) => // '' is the default value
    formogen[ `Form:${formId}:field:${fieldName}:q:${asyncFieldInputSearch}:nextPageNumber` ]
);


export const fieldOptionsCurrentPageNumber = createSelector(
  [ formogen, formId, fieldName, asyncFieldInputSearch ],
  (formogen, formId, fieldName, asyncFieldInputSearch) => // '' is the default value
    formogen[ `Form:${formId}:field:${fieldName}:q:${asyncFieldInputSearch}:currentPageNumber` ]
);

export const asyncFieldOptions = createSelector(
  [ formogen, formId, fieldName, asyncFieldInputSearch ],
  (formogen, formId, fieldName, asyncFieldInputSearch) => // '' is the default value
    formogen[ `Form:${formId}:field:${fieldName}:q:${asyncFieldInputSearch}:options` ]
);

/**
 * If we have an object, we prefer urls received from it, then urls from metadata.
 */
export const fieldFileUploadUrl = createSelector(
  [ fieldName, objectUrls, metaDataFieldsByNameMap ],
  (fieldName, objectUrls, metaDataFieldsByNameMap) => 
    objectUrls[`${fieldName}_upload`] ||
    metaDataFieldsByNameMap[fieldName]?.upload_url
);


/**
 * NOTICE: it is possible to save only modified fields with PATCH (if we have an object fetched).
 * We exclude files from here since they are uploaded separately.
 * We use this selector only to prepare all form data.
 * There are some special cases:
 *  1. We cast boolean to false || true
 *  2. We transform FK field value from dict ``{ id: 1 }`` to ``1``
 *  3. We transform M2M field value from ``[ { id: 1 }, ... ]`` to ``[ 1, ... ]``
 */
export const finalFormData = createSelector(
  [ formogen, formId, metaDataNonFileFields ],
  (formogen, formId, metaDataNonFileFields) => 
    metaDataNonFileFields.map(({ name, type }) => [
      name,
      coerceFieldValueToItsType(
        type,
        finalFieldValue({ formogen }, { formId, name })
      )
    ]) |> fromPairs
);

export const dirtyFormFiles = createSelector(
  [ formogen, formId, metaDataFileFields ],
  (formogen, formId, metaDataFileFields) => {
    const fileBundles = [];
    metaDataFileFields.forEach(fileFieldMeta => {
      const url = fieldFileUploadUrl({ formogen }, { formId, name: fileFieldMeta.name });
      const files = dirtyFieldValue({ formogen }, { formId, name: fileFieldMeta.name }) || [];
      files.forEach(file => fileBundles.push({
        fieldName: fileFieldMeta.name,
        filename: file.name,
        file,
        url,
      }));
    });
    return fileBundles;
  }
);

export const formSaveHTTPMethod = createSelector(
  objectId,
  objectId => objectId ? 'put' : 'post'
);

export const formSaveUrl = createSelector(
  [ objectId, createUrl, objectUrl ],
  (objectId, createUrl, objectUrl) => 
    objectId ? objectUrl : createUrl
);
