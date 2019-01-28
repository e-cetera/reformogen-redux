import { pickBy } from 'lodash';

import { BaseSubmitErrorResponseAdapter } from './base';


export class DRFSubmitErrorResponseAdapter extends BaseSubmitErrorResponseAdapter {
  get fieldErrors() {
    return pickBy(
      this.responseObject, 
      (value, key) => this.fieldNames.includes(key)
    );
  }
  get nonFieldErrors() { 
    return pickBy(
      this.responseObject, 
      (value, key) => !this.fieldNames.includes(key)
    );
  }
}
