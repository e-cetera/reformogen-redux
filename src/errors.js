import ExtendableError from 'es6-error';


export class APIError extends ExtendableError {
  constructor(opts, errors, retries) {
    super(`Failed to fetch ${JSON.stringify(opts)} after ${retries} attempts`);
    this.errors = errors;
  }
}
