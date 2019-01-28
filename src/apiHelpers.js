import superagent from 'superagent';
import { delay } from 'redux-saga';
import Cookies from 'js-cookie';

import { call, put } from 'redux-saga/effects';

import { 
  AGENT_NUM_REDIRECTS, 
  AGENT_RETRY_COUNT, 
  AGENT_RETRY_STATUS_CODES, 
  AGENT_RETRY_TIMEOUT,
  AGENT_TIMEOUT,
  IS_PRODUCTION,
} from './constants';
import { failedAgentRequestAttempt } from './actions';
import { APIError } from './errors';


export function isCsrfSafeMethod(method) {
  return (/^(GET|HEAD|OPTIONS|TRACE)$/i.test(method));
}


export function getDefaultHeaders({ method }) {
  const headers = {};

  if (!isCsrfSafeMethod(method))
    headers['X-CSRFToken'] = Cookies.get('csrftoken');

  return headers;
}


export function* processError(errorType, exception, meta) {
  yield put({
    type: errorType,
    payload: { exception },
    meta
  });
}

export function singleApiCallFactory({ 
  method, 
  processResponse = ({ response }) => response.body, 
  onError = processError,
  types: [ REQUEST_TYPE, SUCCESS_TYPE, ERROR_TYPE ],
}) {
  const fn = function* ({ type = REQUEST_TYPE, payload, meta={} } = {}) {
    // * we provide some additional request context to make it easier to manipulate with the data in reducers
    // TODO: use some callback here instead of this code later
    const extendedMeta = {
      ...meta,  // user might wanted to pass something too
      request: arguments[0],  // add payload options in case we may need them
    };

    try {
      const response = yield method({ ...payload });
      const processedResponse = processResponse({ response, type, payload, meta: extendedMeta });
      
      yield put({ 
        type: SUCCESS_TYPE, 
        payload: processedResponse, 
        meta: extendedMeta,
      });
      
      // * we return the processed result and some originally received stuff
      return { 
        rawResult: response, 
        result: processedResponse, 
        meta: extendedMeta,
      };
    } catch(error) { 
      yield onError(ERROR_TYPE, error); 
      return { error, meta: extendedMeta };
    }
  };
  Object.defineProperty(fn, 'name', { 
    value: method.name || `${REQUEST_TYPE}`
  });
  return fn;
}

export function* executeRequest({ 
  agent = superagent,
  url,
  method = 'get',
  query={},
  getHeaders = getDefaultHeaders,
  data,

  refineRequest = requestObject => requestObject,
  locale = undefined,

  isProduction = IS_PRODUCTION,
  retryCount = AGENT_RETRY_COUNT,
  retryTimeout = AGENT_RETRY_TIMEOUT,
  retryStatusCodes = AGENT_RETRY_STATUS_CODES,
  timeout = AGENT_TIMEOUT,
  redirects = AGENT_NUM_REDIRECTS,
  
  failedRequestActionCreator = failedAgentRequestAttempt,
  ...opts 
}) {
  if (Object.keys(opts).length !== 0)  // eslint-disable-next-line
    console.warn('Received some extra arguments', opts);

  ['get', 'post', 'patch', 'put', 'options'].includes(method) || 
    throw new Error(`Method ${method} is not supported!`);

  const errors = [];
  const runtimeHeaders = yield getHeaders({ method, url });

  for (let retryAttempt=0; retryAttempt < retryCount; retryAttempt++) {
    try {
      let request = agent[method](url)
        .timeout(timeout)
        .redirects(redirects)
        .query(query)
        .set(runtimeHeaders);

      if (!isProduction) request = request.withCredentials();
      if (locale !== undefined) request = request.set({ 'Accept-Language': locale });
      if (data !== undefined) request = request.send(data);
      
      request = refineRequest(request);

      const response = yield request;
      return response;
    } catch(e) {
      if (!retryStatusCodes.includes(e.status))
        throw e;

      // eslint-disable-next-line
      console.warn(`Failed request ${url} with options`, e);

      yield put(failedRequestActionCreator({ retryAttempt, arguments: arguments }));
      errors.push(e);
      yield call(delay, retryTimeout); 
    }
  }
  // eslint-disable-next-line
  console.error(`Failed ${retryCount} attempts of reaching ${url}`, errors);
  throw new APIError(arguments, errors, retryCount);
}
