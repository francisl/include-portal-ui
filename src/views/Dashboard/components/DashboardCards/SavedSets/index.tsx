import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { List, Tabs, Typography } from 'antd';
import intl from 'react-intl-universal';
import { DashboardCardProps } from 'views/Dashboard/components/DashboardCards';
import CardHeader from 'views/Dashboard/components/CardHeader';
import Empty from '@ferlab/ui/core/components/Empty';
import ListItem from './ListItem';
import { ReactElement } from 'react';
import { useSavedSet } from 'store/savedSet';
import { IUserSetOutput } from 'services/api/savedSet/models';
import CardErrorPlaceholder from 'views/Dashboard/components/CardErrorPlaceHolder';
import ExternalLink from 'components/uiKit/ExternalLink';
import { ExperimentOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';

import styles from './index.module.scss';

const { Text } = Typography;
const { TabPane } = Tabs;

const getItemList = (
  type: string,
  savedSets: IUserSetOutput[],
  fetchingError: boolean,
  isLoading: boolean,
  icon: ReactElement,
) => {
  return (
    <List<IUserSetOutput>
      className={styles.savedFiltersList}
      bordered
      locale={{
        emptyText: fetchingError ? (
          <CardErrorPlaceholder
            title="Failed to Fetch Saved Filters"
            subTitle={
              <Text>
                Please refresh and try again or{' '}
                <ExternalLink href="mailto:support@includedrc.org">
                  <Text>contact our support</Text>
                </ExternalLink>
                .
              </Text>
            }
          />
        ) : (
          <Empty
            imageType="grid"
            description={intl.get('screen.dashboard.cards.savedSets.noSavedFilters')}
          />
        ),
      }}
      dataSource={fetchingError ? [] : savedSets.filter((s) => s.setType === type)}
      loading={isLoading}
      renderItem={(item) => (
        <ListItem id={item.id} data={item} icon={icon} saveSetTags={savedSets.map((s) => s.tag)} />
      )}
    />
  );
};

const SavedSets = ({ id, key, className = '' }: DashboardCardProps) => {
  const { savedSets, isLoading, fetchingError } = useSavedSet();

  return (
    <GridCard
      theme="shade"
      wrapperClassName={className}
      title={
        <CardHeader
          id={id}
          key={key}
          title={intl.get('screen.dashboard.cards.savedSets.title')}
          withHandle
        />
      }
      content={
        <Tabs className={styles.setTabs} defaultActiveKey="participants">
          <TabPane
            tab={
              <div>
                <UserOutlined />
                Participants ({savedSets.filter((s) => s.setType === 'participant').length})
              </div>
            }
            key="participants"
          >
            {getItemList('participant', savedSets, fetchingError, isLoading, <UserOutlined />)}
          </TabPane>
          <TabPane
            tab={
              <div>
                <ExperimentOutlined />
                Biospecimen ({savedSets.filter((s) => s.setType === 'biospecimen').length})
              </div>
            }
            key="biospecimen"
          >
            {getItemList(
              'biospecimen',
              savedSets,
              fetchingError,
              isLoading,
              <ExperimentOutlined />,
            )}
          </TabPane>
          <TabPane
            tab={
              <div>
                <FileTextOutlined />
                Files ({savedSets.filter((s) => s.setType === 'file').length})
              </div>
            }
            key="files"
          >
            {getItemList('file', savedSets, fetchingError, isLoading, <FileTextOutlined />)}
          </TabPane>
        </Tabs>
      }
    />
  );
};

export default SavedSets;
