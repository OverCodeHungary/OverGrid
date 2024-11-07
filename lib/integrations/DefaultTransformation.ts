import { Ordering } from '../components/model/Ordering';
import { PaginationClass } from '../components/model/Pagination';
import { FilteringClass } from '../components/model/Filtering';

export default (
  ordering: Ordering,
  pagination: PaginationClass,
  filtering: FilteringClass
): URLSearchParams => {
  const params = new URLSearchParams();

  params.append("type", "default");

  if(ordering.active) {
    params.append('orderKey', ordering.key);
    params.append('orderDirection', ordering.direction.toString());
  }

  if(pagination.active) {
    params.append('page', pagination.page.toString());
    params.append('size', pagination.size.toString());
  }

  if(filtering.active) {
    if(!filtering.isSimpleFilter) {
      params.append('filter', JSON.stringify(filtering.filters));
    }
    else {
      params.append('filter', filtering.simpleFilterValue);
    }
  }

  return params;
}
