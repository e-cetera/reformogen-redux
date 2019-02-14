import { all } from 'redux-saga/effects';

import { formogenSagas } from './saga';


export default function* rootSaga() {
    yield all([
        formogenSagas(),
    ]);
}