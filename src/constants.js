/*
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = '@yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */
export const PROJECT_NAME = 'formogen';
const PREFIX = `@${PROJECT_NAME}`;

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const AGENT_RETRY_TIMEOUT = process.env.REACT_APP__AGENT_RETRY_TIMEOUT || 500;
export const AGENT_RETRY_COUNT = process.env.REACT_APP__AGENT_RETRY_COUNT || 5;
export const AGENT_RETRY_STATUS_CODES = [ undefined, 524, 504, 502, 408 ];
export const AGENT_TIMEOUT = { response: 10000, deadline: 20000 };
export const AGENT_NUM_REDIRECTS = 0;
export const AGENT_EXECUTE_REQUEST_ATTEMPT_FAILED = `${PREFIX}/AGENT_EXECUTE_REQUEST_ATTEMPT_FAILED`;


export const SAGA_RETRY_TIMEOUT = process.env.REACT_APP__SAGA_RETRY_TIMEOUT || 1000;
export const SAGA_RETRY_COUNT = process.env.REACT_APP__SAGA_RETRY_COUNT || 5;

// ======

export const BOOTSTRAP = `${PREFIX}/BOOTSTRAP`;
export const BOOTSTRAP_SUCCESS = `${PREFIX}/BOOTSTRAP_SUCCESS`;
export const BOOTSTRAP_ERROR = `${PREFIX}/BOOTSTRAP_ERROR`;

// ======

export const CLEANUP = `${PREFIX}/CLEANUP`;

// ======

export const SUBMIT = `${PREFIX}/SUBMIT`;
export const SUBMIT_SUCCESS = `${PREFIX}/SUBMIT_SUCCESS`;
export const SUBMIT_ERROR = `${PREFIX}/SUBMIT_ERROR`;

// ======

export const FATAL_ERROR = `${PREFIX}/FATAL_ERROR`;

export const STORE_FORM_DATA = `${PREFIX}/STORE_FORM_DATA`;
export const STORE_FORM_METADATA = `${PREFIX}/STORE_FORM_METADATA`;
export const STORE_FORM_ERRORS = `${PREFIX}/STORE_FORM_ERRORS`;
export const CLEAR_FORM_ERRORS = `${PREFIX}/CLEAR_FORM_ERRORS`;
export const STORE_FORM_LOCALE = `${PREFIX}/STORE_FORM_LOCALE`;

export const STORE_FIELD_DATA = `${PREFIX}/STORE_FIELD_DATA`;
export const STORE_FIELD_OPTIONS = `${PREFIX}/STORE_FIELD_OPTIONS`;
export const STORE_FIELD_SEARCH_TEXT = `${PREFIX}/STORE_FIELD_SEARCH_TEXT`;

export const FETCH_FORM_METADATA = `${PREFIX}/FETCH_FORM_METADATA`;
export const FETCH_FORM_METADATA_SUCCESS = `${PREFIX}/FETCH_FORM_METADATA_SUCCESS`;
export const FETCH_FORM_METADATA_ERROR = `${PREFIX}/FETCH_FORM_METADATA_ERROR`;

export const FETCH_FORM_DATA = `${PREFIX}/FETCH_FORM_DATA`;
export const FETCH_FORM_DATA_SUCCESS = `${PREFIX}/FETCH_FORM_DATA_SUCCESS`;
export const FETCH_FORM_DATA_ERROR = `${PREFIX}/FETCH_FORM_DATA_ERROR`;

export const FETCH_NEXT_FIELD_OPTIONS = `${PREFIX}/FETCH_NEXT_FIELD_OPTIONS`;
export const FETCH_NEXT_FIELD_OPTIONS_SUCCESS = `${PREFIX}/FETCH_NEXT_FIELD_OPTIONS_SUCCESS`;
export const FETCH_NEXT_FIELD_OPTIONS_ERROR = `${PREFIX}/FETCH_NEXT_FIELD_OPTIONS_ERROR`;

export const SAVE_FORM_DATA = `${PREFIX}/SAVE_FORM_DATA`;
export const SAVE_FORM_DATA_SUCCESS = `${PREFIX}/SAVE_FORM_DATA_SUCCESS`;
export const SAVE_FORM_DATA_ERROR = `${PREFIX}/SAVE_FORM_DATA_ERROR`;

export const SAVE_FORM_FILE = `${PREFIX}/SAVE_FORM_FILE`;
export const SAVE_FORM_FILE_SUCCESS = `${PREFIX}/SAVE_FORM_FILE_SUCCESS`;
export const SAVE_FORM_FILE_ERROR = `${PREFIX}/SAVE_FORM_FILE_ERROR`;