import { TSortableItems } from '@ferlab/ui/core/layout/SortableGrid/SortableItem';
import { SorterResult } from 'antd/lib/table/interface';
import { TSortDirection } from 'graphql/queries';
import { isEmpty } from 'lodash';

export const scrollToTop = (scrollContentId: string) =>
  document
    .getElementById(scrollContentId)
    ?.querySelector('.simplebar-content-wrapper')
    ?.scrollTo(0, 0);

export const orderCardIfNeeded = (cards: TSortableItems[], userCardConfig: string[] | undefined) =>
  userCardConfig
    ? cards.sort((a, b) => (userCardConfig.indexOf(a.id) > userCardConfig.indexOf(b.id) ? 1 : -1))
    : cards;

export const getOrderFromAntdValue = (order: string): TSortDirection =>
  order === 'ascend' ? 'asc' : 'desc';

export const formatQuerySortList = (sorter: SorterResult<any> | SorterResult<any>[]) =>
  isEmpty(sorter)
    ? []
    : [sorter].flat().map((sorter) => ({
        field: sorter.columnKey as string,
        order: getOrderFromAntdValue(sorter.order!),
      }));

export const getCurrentUrl = () =>
  window.location.protocol + '//' + window.location.host + window.location.pathname;
