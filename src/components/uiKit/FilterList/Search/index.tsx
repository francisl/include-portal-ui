import { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';

import SearchAutocomplete, {
  ISearchAutocomplete,
  OptionsType,
} from 'components/uiKit/FilterList/Search/SearchAutocomplete';
import { usePrevious } from 'hooks/usePrevious';
import useLazyResultQuery from 'hooks/graphql/useLazyResultQuery';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { INDEXES } from 'graphql/constants';
import { BooleanOperators } from '@ferlab/ui/core/data/sqon/operators';

interface IGlobalSearch<T> {
  query: any;
  index: INDEXES;
  searchKey: string[];
  setCurrentOptions: (result: T[], search: string) => OptionsType[];
  searchValueTransformer?: (search: string) => string;
  onSelect: (values: string[]) => void;
}

type TGlobalSearch<T> = IGlobalSearch<T> &
  Omit<ISearchAutocomplete, 'onClose' | 'onSearch' | 'onSelect' | 'options'>;

const Search = <T,>({
  onSelect,
  query,
  index,
  searchKey,
  selectedItems = [],
  setCurrentOptions,
  searchValueTransformer,
  ...props
}: TGlobalSearch<T>) => {
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState<OptionsType[]>([]);

  const searchFilter = generateQuery({
    operator: BooleanOperators.or,
    newFilters: searchKey.map((key) =>
      generateValueFilter({
        field: key,
        value: [`${search}*`],
        index,
      }),
    ),
  });

  const searchSQON = {
    op: searchFilter.op,
    content: searchFilter.content,
  };

  const { result: searchResult } = useLazyResultQuery<any>(query, {
    variables: { sqon: searchSQON },
  });
  const previousData = usePrevious(searchResult);

  useEffect(() => {
    const newData = isEmpty(searchResult) ? previousData : searchResult;
    setOptions(setCurrentOptions(newData, search));
    // eslint-disable-next-line
  }, [searchResult]);

  return (
    <SearchAutocomplete
      onSearch={(value) =>
        setSearch(searchValueTransformer ? searchValueTransformer(value) : value)
      }
      onSelect={(values) => {
        setSearch('');
        onSelect(values);
      }}
      onClose={() => {
        setSearch('');
      }}
      options={options}
      selectedItems={selectedItems}
      {...props}
    />
  );
};

export default Search;
