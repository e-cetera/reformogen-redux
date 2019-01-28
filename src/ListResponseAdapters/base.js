import { isArray } from 'lodash';

export class BaseResponseAdapter {
  constructor(responseObject) {
    this.responseObject = responseObject;
  }

  static getQueryObject(url, defaults = {}) {
    const queryObject = {};
    const parsed = new URLSearchParams(new URL(url).search);
  
    for (const [ param, value ] of parsed) {
      const existingValue = queryObject[ param ];
  
      if (existingValue === undefined) {
        queryObject[ param ] = value;
      } else {
        isArray(existingValue)
          ? queryObject[ param ].push(value)
          : queryObject[ param ] = [ queryObject[ param ], value ];
      }
    }
    return { ...defaults, ...queryObject };
  }

  get totalItems() { throw new Error('Not implemented'); }
  get totalPages() { throw new Error('Not implemented'); }

  get nextPageUrl() { throw new Error('Not implemented'); }
  get previousPageUrl() { throw new Error('Not implemented'); }

  get hasNextPage() { throw new Error('Not implemented'); }
  get hasPreviousPage() { throw new Error('Not implemented'); }
  
  get previousPageNumber() { throw new Error('Not implemented'); }
  get nextPageNumber() { throw new Error('Not implemented'); }
  get currentPageNumber() { throw new Error('Not implemented'); }
  
  get list() { throw new Error('Not implemented'); }

  get perPageQueryParam() { throw new Error('Not implemented'); }
  get pageQueryParam() { throw new Error('Not implemented'); }
  get maxPageSize() { throw new Error('Not implemented'); }
  get defaultPageSize() { throw new Error('Not implemented'); }
  get searchQueryParam() { throw new Error('Not implemented'); }
}


