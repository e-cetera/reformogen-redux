import { DjangoRestFrameworkResponseAdapter } from './DjangoRestFramework';

const adapter = new DjangoRestFrameworkResponseAdapter({
  total_items: 23,
  next_page_url: 'http://127.0.0.1:8000/api/v1/sample/authors/?page=2',
  previous_page_url: null,
  has_previous_page: false,
  has_next_page: true,
  previous_page_number: null,
  next_page_number: 2,
  current_page_number: 1,
  total_pages: 3,
  list: [1, 2, 3],
});

describe('DjangoRestFrameworkResponseAdapter', () => {
  it('totalItems()', () => {
    expect(adapter.totalItems).toEqual(23);
  });
  it('totalPages()', () => {
    expect(adapter.totalPages).toEqual(3);
  });
  it('nextPageUrl()', () => {
    expect(adapter.nextPageUrl).toEqual('http://127.0.0.1:8000/api/v1/sample/authors/?page=2');
  });
  it('previousPageUrl()', () => {
    expect(adapter.previousPageUrl).toEqual(null);
  });
  it('hasNextPage()', () => {
    expect(adapter.hasNextPage).toEqual(true);
  });
  it('hasPreviousPage()', () => {
    expect(adapter.hasPreviousPage).toEqual(false);
  });
  it('previousPageNumber()', () => {
    expect(adapter.previousPageNumber).toEqual(null);
  });
  it('nextPageNumber()', () => {
    expect(adapter.nextPageNumber).toEqual(2);
  });
  it('currentPageNumber()', () => {
    expect(adapter.currentPageNumber).toEqual(1);
  });
  it('list()', () => {
    expect(adapter.list).toEqual([ 1, 2, 3 ]);
  });
  it('perPageQueryParam()', () => {
    expect(adapter.perPageQueryParam).toEqual('per_page');
  });
  it('pageQueryParam()', () => {
    expect(adapter.pageQueryParam).toEqual('page');
  });
  it('maxPageSize()', () => {
    expect(adapter.maxPageSize).toEqual(300);
  });
  it('defaultPageSize()', () => {
    expect(adapter.defaultPageSize).toEqual(10);
  });
});
