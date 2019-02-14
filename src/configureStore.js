import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootSaga from '~/rootSaga';

import { createRootReducer } from './rootReducer';

import { responseAdapterRegistry, DjangoRestFrameworkResponseAdapter } from './ListResponseAdapters';

const sagaMiddleware = createSagaMiddleware();
responseAdapterRegistry.register(/\/api\/v/, DjangoRestFrameworkResponseAdapter);

export default function configureStore(initialState = {}, history) {
    const middlewares = [
        sagaMiddleware
    ];

    const enhancers = [
        applyMiddleware(...middlewares),
    ];

    const composeEnhancers =
        process.env.NODE_ENV !== 'production' &&
        typeof window === 'object' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
                shouldHotReload: false,
            })
            : compose;

    const store = createStore(
        createRootReducer(),
        initialState,
        composeEnhancers(...enhancers)
    );

    store.runSaga = sagaMiddleware.run;
    store.injectedReducers = {};
    store.injectedSagas = {};

    store.runSaga(rootSaga);


    return store;
}