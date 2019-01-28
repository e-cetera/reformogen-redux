import { BaseResponseAdapter } from './base';


export class DjangoRestFrameworkResponseAdapter extends BaseResponseAdapter {
  get totalItems() { return this.responseObject.total_items; }
  get totalPages() { return this.responseObject.total_pages; }

  get nextPageUrl() {  return this.responseObject.next_page_url; }
  get previousPageUrl() { return this.responseObject.previous_page_url; }

  get hasNextPage() { return this.responseObject.has_next_page; }
  get hasPreviousPage() { return this.responseObject.has_previous_page; }
  
  get nextPageNumber() { return this.responseObject.next_page_number; }
  get previousPageNumber() { return this.responseObject.previous_page_number; }
  get currentPageNumber() { return this.responseObject.current_page_number; }
  
  get list() { return this.responseObject.list; }

  get perPageQueryParam() { return 'per_page'; }
  get pageQueryParam() { return 'page'; }
  get maxPageSize() { return this.responseObject.max_page_size || 300; }
  get defaultPageSize() { return this.responseObject.page_size || 10; }
  get searchQueryParam() { return 'q'; }
}
