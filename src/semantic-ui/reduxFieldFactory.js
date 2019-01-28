import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { 
  formId, 
  finalFieldValue, 
  initialFieldValue,
  fieldErrors,
} from '../selectors';

import { storeFieldData } from '../actions';


export function connectField(FieldComponent, selectors={}) {
  function mergeProps(stateProps, dispatchProps, ownProps) {
    const { dispatch } = dispatchProps;
    const { formId } = ownProps;
  
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
  
      onChange: (e, { name, value }) => dispatch(storeFieldData(formId, name, value)),
      dispatch: undefined,
    };
  }

  return connect(
    createStructuredSelector({
      formId,
      initialValue: initialFieldValue,
      value: finalFieldValue,
      errors: fieldErrors,
      ...selectors,
    }),
    dispatch => ({ dispatch }),
    mergeProps,
  )(FieldComponent);
}
