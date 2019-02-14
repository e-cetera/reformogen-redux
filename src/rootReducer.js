import { combineReducers } from 'redux';

import { formogenReducer } from './reducer';


export const createRootReducer = injectedReducers => combineReducers({
    formogen: formogenReducer,
    ...injectedReducers,
});