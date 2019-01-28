import { responseAdapterRegistry } from './ListResponseAdapters';
import { executeRequest, singleApiCallFactory } from './apiHelpers';
import { 
  FETCH_FORM_METADATA, FETCH_FORM_METADATA_SUCCESS, FETCH_FORM_METADATA_ERROR,
  FETCH_FORM_DATA, FETCH_FORM_DATA_SUCCESS, FETCH_FORM_DATA_ERROR,

  FETCH_NEXT_FIELD_OPTIONS, FETCH_NEXT_FIELD_OPTIONS_SUCCESS, FETCH_NEXT_FIELD_OPTIONS_ERROR,
  SAVE_FORM_DATA, SAVE_FORM_DATA_SUCCESS, SAVE_FORM_DATA_ERROR,

  SAVE_FORM_FILE, SAVE_FORM_FILE_SUCCESS, SAVE_FORM_FILE_ERROR,
} from './constants';


export const fetchFormMetadata = singleApiCallFactory({
  method: requestOpts => executeRequest(requestOpts),
  types: [ 
    FETCH_FORM_METADATA, 
    FETCH_FORM_METADATA_SUCCESS, 
    FETCH_FORM_METADATA_ERROR 
  ]
});


export const fetchFormData = singleApiCallFactory({
  
  method: requestOpts => executeRequest(requestOpts),
  types: [ 
    FETCH_FORM_DATA, 
    FETCH_FORM_DATA_SUCCESS, 
    FETCH_FORM_DATA_ERROR
  ]
});


export const searchDataFieldOptions = singleApiCallFactory({
  processResponse: ({ response, payload: { url } }) => {
    const Adapter = responseAdapterRegistry.resolveAdapter(url);
    return new Adapter(response.body);
  },
  method: ({ url, page, searchText }) => executeRequest({ 
    url, 
    query: { page, q: searchText } 
  }),
  types: [ 
    FETCH_NEXT_FIELD_OPTIONS,
    FETCH_NEXT_FIELD_OPTIONS_SUCCESS,
    FETCH_NEXT_FIELD_OPTIONS_ERROR
  ],
});


export const saveFormData = singleApiCallFactory({
  method: requestOpts => executeRequest(requestOpts),
  types: [ 
    SAVE_FORM_DATA, 
    SAVE_FORM_DATA_SUCCESS, 
    SAVE_FORM_DATA_ERROR,
  ],
});


export const saveFormFile = singleApiCallFactory({
  method: ({ url, fieldName, filename, file }) => executeRequest({
    url,
    method: 'post',
    // ! we don't want to retry the file uploading in case of errors
    // ! (mobile network users complains)
    retryCount: 1,
    refineRequest: requestObject => requestObject.attach(
      fieldName,
      file,
      { filename }
    )
  }),
  types: [ 
    SAVE_FORM_FILE, 
    SAVE_FORM_FILE_SUCCESS,
    SAVE_FORM_FILE_ERROR
  ],
});
