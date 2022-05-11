import { PaperClipOutlined, UploadOutlined } from '@ant-design/icons';
import Collapse, { CollapsePanel } from '@ferlab/ui/core/components/Collapse';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { Button, Input, Modal, PopoverProps, Space, Tabs, Upload } from 'antd';
import { get } from 'lodash';
import { MatchTableItem, UnmatchTableItem, UploadIdDictionary } from '..';
import MatchTable from './MatchTable';
import UnmatchTable from './UnmatchTable';

import styles from './index.module.scss';

interface OwnProps {
  width?: number;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  dictionary: UploadIdDictionary;
  popoverProps?: PopoverProps;
  placeHolder: string;
  inputValue: string;
  setInputValue: (value: string) => void;
  matchItems?: MatchTableItem[];
  unmatchItems?: UnmatchTableItem[];
  onUpload: (matchIds: string[]) => void;
  loading?: boolean;
}

const defaultRenderMatchTabTitle = (matchCount: number) => `Matched (${matchCount})`;
const defaultRenderUnmatchTabTitle = (unmatchCount: number) => `Unmatched (${unmatchCount})`;
const defaultRenderCollapseTitle = (matchCount: number, unmatchCount: number) =>
  `Summary Table (${matchCount} matched, ${unmatchCount} unmatched)`;

const UploadModal = ({
  width = 945,
  visible,
  setVisible,
  dictionary,
  popoverProps,
  inputValue,
  setInputValue,
  placeHolder,
  matchItems,
  unmatchItems,
  onUpload,
  loading = false,
}: OwnProps) => {
  return (
    <Modal
      visible={visible}
      onCancel={() => {
        setVisible(false);
        setInputValue('');
      }}
      width={width}
      title={dictionary.modalTitle}
      okText={get(dictionary, 'modalOkText', 'Upload')}
      onOk={() => {
        setVisible(false);
        setInputValue('');
        onUpload(matchItems ? matchItems.map(({ submittedId }) => submittedId) : []);
      }}
      okButtonProps={{ disabled: !matchItems?.length }}
      cancelText={get(dictionary, 'modalCancelText', 'Cancel')}
      wrapClassName={styles.fuiUploadIdsModalWrapper}
      destroyOnClose
    >
      <Space direction="vertical" className={styles.space}>
        <ProLabel
          title={
            get(
              dictionary,
              'inputLabel',
              'Copy-paste a list of indentifiers or upload a file',
            ) as string
          }
          popoverProps={popoverProps}
        />
        <Space direction="vertical" size={12} className={styles.space}>
          <Input.TextArea
            rows={4}
            placeholder={placeHolder}
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
          ></Input.TextArea>
          <Upload
            accept=".txt, .csv, .tsv"
            multiple={false}
            maxCount={1}
            itemRender={(_, file) => (
              <Space key={file.name + file.size} size={5} className={styles.ListItem}>
                <PaperClipOutlined className={styles.paperClipIcon} />
                {file.name}
              </Space>
            )}
            className={styles.upload}
            beforeUpload={async (file) => {
              setInputValue(await file.text());
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>
              {get(dictionary, 'modalUploadBtnText', 'Upload a File')}
            </Button>
          </Upload>
        </Space>
      </Space>
      {matchItems && unmatchItems ? (
        <Collapse className={styles.matchUnmatch}>
          <CollapsePanel
            className={styles.collapsePanel}
            key="match-unmatch-ids"
            header={
              dictionary.collapseTitle
                ? dictionary.collapseTitle(matchItems.length, unmatchItems.length)
                : defaultRenderCollapseTitle(matchItems.length, unmatchItems.length)
            }
          >
            <Tabs size="small" defaultActiveKey="matched" className={styles.tabs}>
              <Tabs.TabPane
                key="matched"
                tab={
                  dictionary.matchTabTitle
                    ? dictionary.matchTabTitle(matchItems.length)
                    : defaultRenderMatchTabTitle(matchItems.length)
                }
              >
                <MatchTable matchItems={matchItems} dictionary={dictionary} loading={loading} />
              </Tabs.TabPane>
              <Tabs.TabPane
                key="unmatched"
                tab={
                  dictionary.unmatchTabTitle
                    ? dictionary.unmatchTabTitle(unmatchItems.length)
                    : defaultRenderUnmatchTabTitle(unmatchItems.length)
                }
              >
                <UnmatchTable
                  unmatchItems={unmatchItems}
                  dictionary={dictionary}
                  loading={loading}
                />
              </Tabs.TabPane>
            </Tabs>
          </CollapsePanel>
        </Collapse>
      ) : null}
    </Modal>
  );
};

export default UploadModal;
