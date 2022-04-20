import React, { useCallback, useEffect, useState } from 'react';
import { Select, Tag, Tooltip, Typography } from 'antd';
import debounce from 'lodash/debounce';
import take from 'lodash/take';
import { InfoCircleOutlined } from '@ant-design/icons';
import Empty from '@ferlab/ui/core/components/Empty';

import styles from './index.module.scss';

export type OptionsType = {
  value: string;
  label: string | React.ReactNode;
  [name: string]: any;
};

export interface ISearchAutocomplete {
  title?: string | React.ReactNode;
  tooltipText?: string | React.ReactNode;
  placeHolder?: string | React.ReactNode;
  emptyDescription?: string;
  className?: string;
  options: OptionsType[];
  limit?: number;
  onSearch: (value: string) => void;
  onSelect: (values: string[]) => void;
  onClose: () => void;
  selectedItems?: string[];
}

const { Text } = Typography;

const SearchAutocomplete = ({
  className = '',
  limit = 5,
  onSearch,
  onSelect,
  onClose,
  options,
  placeHolder = 'Search',
  emptyDescription,
  selectedItems = [],
  title = 'Search',
  tooltipText = '',
}: ISearchAutocomplete) => {
  const [itemSelected, setItemSelected] = useState(selectedItems);
  const newOptions = take(options, limit);
  // eslint-disable-next-line
  const debounceSearch = useCallback(
    debounce((nextValue) => onSearch(nextValue), 250),
    [],
  );

  useEffect(() => {
    setItemSelected(selectedItems);
    // eslint-disable-next-line
  }, [selectedItems]);

  return (
    <div className={`${styles.container} ${className}`}>
      <span className={styles.title}>
        <Text strong>{title}</Text>
        {tooltipText && (
          <Tooltip arrowPointAtCenter placement="topLeft" title={tooltipText}>
            <InfoCircleOutlined className={styles.tooltipIcon} />
          </Tooltip>
        )}
      </span>
      <Select
        allowClear
        className={styles.search}
        filterOption={false}
        maxTagCount="responsive"
        mode="multiple"
        onChange={(values: string[]) => {
          onSelect(values);
          setItemSelected(values);
        }}
        onDropdownVisibleChange={(open) => {
          if (!open) {
            onClose();
          }
        }}
        autoClearSearchValue={true}
        notFoundContent={<Empty size="mini" showImage={false} description={emptyDescription} />}
        onSearch={(value) => debounceSearch(value)}
        options={newOptions}
        placeholder={placeHolder}
        value={itemSelected}
        getPopupContainer={(trigger) => trigger.parentElement!}
        tagRender={({ onClose, value }) => (
          <Tag className={styles.tag} closable onClose={onClose} style={{ marginRight: 3 }}>
            {value}
          </Tag>
        )}
      ></Select>
    </div>
  );
};

export default SearchAutocomplete;
