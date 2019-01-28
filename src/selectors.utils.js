import { isEmpty, map, isPlainObject, isArray, sum } from 'lodash';


/**
 * We just transform the data here to a shape we can handle by the Django's server side.
 * Empty string usually stand for 'just don't make this component uncontrolled'; so we can
 * return undefined, that will exclude such values from the final bundle sending to the server.
 * M2M && FK fields must provide just plain ids.
 * M2M && FK that include all data dependencies must return the plain list of ids too.
 * @param {string} type django model field name like BooleanField
 * @param {any} value a value received from finalFieldValue selector
 */
export function coerceFieldValueToItsType(type, value) {
  if (type === 'BooleanField')
    return new Boolean(value);

  // nothing to check, just exit asap
  if (['TextField', 'CharField'].includes(type))
    return value;

  // If we have an empty string here it means the field was not filled
  // so it must not have been sent. One case when empty string is an
  // appropriate value is the case with ['TextField', 'CharField']
  if (value === '')
    return undefined;

  if (type === 'ManyToManyField') {
    if (!value)
      return undefined;

    if (!isArray(value)) {
      // eslint-disable-next-line
      console.warn(`Got '${value}' of type '${typeof value}' for the type '${type}'`);
      // ! just exit with the stuff it has already; we can't know for sure what it is,
      // ! perhaps it's better to raise an exception here
      return value;
    }

    if (isEmpty(value))
      return undefined;

    // the most stupid and fast way to check `value` is an array of integers
    if (!isNaN(+sum(value))) 
      return value;

    // otherwise it should be an array of objects
    // we assume that object has an id, but it's wrong
    // TODO: figure out how to deliver some identity extracting callback here
    return map(value, 'id');
  }

  if (type === 'ForeignKey') {
    if (!value)
      return undefined;

    // if it's a choice field with the data included, it must deliver plain ids
    // so there's nothing to do
    if (!isPlainObject(value))
      return value;

    return value.id;
  }
  return value;
}
