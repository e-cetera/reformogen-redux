import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormogenForm as FormogenFormComponent } from 'reformogen/build/formogen/FormogenForm';

import { metaData, legacyNonFieldErrorsMap } from './selectors';
import { bootstrap, fetchNextFieldOptions, submit, cleanup } from './actions';
import { DRFSubmitErrorResponseAdapter } from './SubmitErrorResponseAdapters';


const mapDispatchToProps = dispatch => ({ dispatch });

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;

  ownProps.describeUrl || throw new Error('You must provide non-falsy describeUrl!');
  ownProps.objectUrl || ownProps.createUrl || throw new Error('You must provide objectUrl or createUrl!');

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,

    actions: {
      bootstrap: () => dispatch(bootstrap(ownProps)),
      cleanup: () => dispatch(cleanup(ownProps)),
      loadOptions: payload => dispatch(fetchNextFieldOptions(payload)),
      submit: () => dispatch(submit({
        ...ownProps,
        processSubmitError: ownProps.processSubmitError || (
          (responseObject, fields) => 
            new DRFSubmitErrorResponseAdapter(responseObject, fields)
        )})
      ),
    },

    dispatch: undefined,
  };
}

export const FormogenForm = connect(
  createStructuredSelector({
    metaData,
    nonFieldErrorsMap: legacyNonFieldErrorsMap
  }),
  mapDispatchToProps,
  mergeProps,
)(FormogenFormComponent);
