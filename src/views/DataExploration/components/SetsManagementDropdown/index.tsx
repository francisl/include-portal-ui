import { Button, Dropdown, Menu, Tooltip } from 'antd';
import {
  DownOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UsergroupAddOutlined,
  UsergroupDeleteOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';
import { IQueryResults } from 'graphql/models';
import { IParticipantEntity } from 'graphql/participants/models';
import { useEffect, useState } from 'react';
import AddRemoveSaveSetModal from './AddRemoveSaveSetModal';
import SaveSetModal from './SaveSetModal';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { useDispatch } from 'react-redux';
import { useSavedSet } from 'store/savedSet';
import { fetchSavedSet } from 'store/savedSet/thunks';
import { IFileEntity } from 'graphql/files/models';
import { IBiospecimenEntity } from 'graphql/biospecimens/models';
import { INDEXES } from '../../../../graphql/constants';

type Props = {
  results: IQueryResults<IParticipantEntity[] | IFileEntity[] | IBiospecimenEntity[]>;
  sqon?: ISqonGroupFilter;
  type: string;
};

export enum SetActionType {
  RENAME_TAG = 'RENAME_TAG',
  ADD_IDS = 'ADD_IDS',
  REMOVE_IDS = 'REMOVE_IDS',
  CREATE_SET = 'CREATE_SET',
  HIDDEN = 'HIDDEN',
}

type ModalState = {
  showModalSave: boolean;
  actionType: SetActionType;
  showModalAddDelete: boolean;
};

const modals = {
  create: {
    showModalSave: true,
    showModalAddDelete: false,
    actionType: SetActionType.CREATE_SET,
  },
  add_ids: {
    showModalSave: false,
    showModalAddDelete: true,
    actionType: SetActionType.ADD_IDS,
  },
  remove_ids: {
    showModalSave: false,
    showModalAddDelete: true,
    actionType: SetActionType.REMOVE_IDS,
  },
  hideAll: {
    showModalSave: false,
    showModalAddDelete: false,
    actionType: SetActionType.HIDDEN,
  },
};

const ROW_SELECTION_LIMIT = 10000;
const exceedLimit = (participantCount: number) => participantCount > ROW_SELECTION_LIMIT;

const itemIcon = (type: string, itemCount: number) => {
  const color = exceedLimit(itemCount) ? '#dd1f2a' : '#a9adc0';
  switch (type) {
    case INDEXES.BIOSPECIMEN:
      return (
        <ExperimentOutlined
          style={{ color }}
          width="14px"
          height="14px"
        />
      );
    case INDEXES.FILE:
      return (
        <FileTextOutlined
          style={{ color }}
          width="14px"
          height="14px"
        />
      );
    default:
      return (
        <UserOutlined
          style={{ color }}
          width="14px"
          height="14px"
        />
      );
  }
};

const menu = (
  participantCount: number,
  onClick: MenuClickEventHandler,
  isEditDisabled: boolean,
  type: string,
) => (
  <Menu className="save-set-option-menu" onClick={onClick}>
    <Menu.Item
      id="participant-count"
      key="participant-count"
      className={'save-set-option' + (exceedLimit(participantCount) ? ' over' : '')}
      disabled
      icon={itemIcon(type, participantCount)}
    >
      <span>
        {participantCount} {type} selected
      </span>
      <Tooltip
        arrowPointAtCenter
        placement="topRight"
        title={'Max. 10,000 participants at a time. The first 10,000 will be processed.'}
      >
        <InfoCircleOutlined id="info" />
      </Tooltip>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key={'create'} className="save-set-option" icon={<PlusOutlined />}>
      Save as new set
    </Menu.Item>
    <Menu.Item
      key={'add_ids'}
      className="save-set-option"
      icon={<UsergroupAddOutlined />}
      disabled={isEditDisabled}
    >
      Add to existing set
    </Menu.Item>
    <Menu.Item
      key={'remove_ids'}
      className="save-set-option"
      icon={<UsergroupDeleteOutlined />}
      disabled={isEditDisabled}
    >
      Remove from existing set
    </Menu.Item>
  </Menu>
);

const SetsManagementDropdown = ({ results, sqon, type }: Props) => {
  const [isEditDisabled, setIsEditDisabled] = useState(true);
  const [modal, setModal] = useState<ModalState>(modals.hideAll);
  // const { clearQueryCache } = useQueryResolverCache();
  const dispatch = useDispatch();
  const { savedSets, isLoading, fetchingError } = useSavedSet();

  useEffect(() => {
    dispatch(fetchSavedSet());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (savedSets && !isLoading && !fetchingError && sqon) {
      setIsEditDisabled(!(savedSets.length > 0 && sqon.content.length > 0));
    }
  }, [fetchingError, isLoading, savedSets, sqon]);

  const onClick: MenuClickEventHandler = (e) => {
    const key = e.key as string;
    // @ts-ignore
    const m = modals[key];
    return setModal(m);
  };

  return (
    <div id={`${type}-set-dropdown-container`}>
      {modal.showModalSave && sqon && (
        <SaveSetModal
          title={`Save ${type.charAt(0).toUpperCase() + type.slice(1)} Set`}
          sqon={sqon}
          setType={type}
          hideModalCb={() => setModal(modals.hideAll)}
          saveSetActionType={SetActionType.CREATE_SET}
        />
      )}
      {modal.showModalAddDelete && (
        <AddRemoveSaveSetModal
          sqon={sqon}
          setActionType={modal.actionType}
          hideModalCb={() => {
            setModal(modals.hideAll);
            // clearQueryCache();
          }}
          userSets={savedSets}
        />
      )}
      <Dropdown
        overlay={menu(results.total, onClick, isEditDisabled, type)}
        placement="bottomLeft"
        trigger={['click']}
        getPopupContainer={() =>
          document.getElementById(`${type}-set-dropdown-container`) as HTMLElement
        }
      >
        <Button className={'save-set-btn'} onClick={(e) => e.preventDefault()}>
          Save participants set
          <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default SetsManagementDropdown;
