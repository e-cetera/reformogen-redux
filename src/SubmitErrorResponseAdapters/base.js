export class BaseSubmitErrorResponseAdapter {
  constructor(responseObject, fieldNames) {
    this.responseObject = responseObject;
    this.fieldNames = fieldNames;
  }
  get fieldErrors() { throw new Error('Not implemented'); }
  get nonFieldErrors() { throw new Error('Not implemented'); }
}
