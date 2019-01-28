
import { connectField } from './reduxFieldFactory';

const Field = props => <div>{ JSON.stringify(props) }</div>;
const additionalSelector = (...args) => args;

describe('reduxFieldFactory', () => {
  it('should doStuff', () => {
    const connectedField = connectField(Field, { additionalSelector });
    expect(connectField).toBeTruthy();
  });
});
