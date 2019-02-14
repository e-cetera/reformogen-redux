import React from 'react';
import { Provider } from 'react-redux';

import configureStore from './configureStore';
import initialState from './initialState';

import { FormogenForm } from './FormogenForm';

const store = configureStore(initialState);

export const FormogenFormWithStore = (props) => {
  return (
      <Provider store={ store }>
          <FormogenForm { ...props } />
      </Provider>
  )
};