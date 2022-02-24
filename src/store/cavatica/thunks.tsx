import { createAsyncThunk } from '@reduxjs/toolkit';
import { notification } from 'antd';
import { isEmpty } from 'lodash';
import { CavaticaApi } from 'services/api/cavatica';
import {
  CAVATICA_TYPE,
  ICavaticaBillingGroup,
  ICavaticaCreateProjectBody,
  ICavaticaProject,
} from 'services/api/cavatica/models';
import { RootState } from 'store/types';
import { ICavaticaTreeNode, TCavaticaProjectWithMembers } from './types';
import intl from 'react-intl-universal';
import { IFileEntity, IFileResultTree } from 'graphql/files/models';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { sendRequest } from 'services/api';
import { ARRANGER_API_PROJECT_URL } from 'provider/ApolloProvider';
import { SEARCH_FILES_QUERY } from 'graphql/files/queries';
import { hydrateResults } from 'graphql/models';
import { termToSqon } from '@ferlab/ui/core/data/sqon/utils';
import { BooleanOperators } from '@ferlab/ui/core/data/sqon/operators';
import { CAVATICA_FILE_BATCH_SIZE } from 'views/DataExploration/utils/constant';
import { handleThunkApiReponse } from 'store/utils';
import EnvironmentVariables from 'helpers/EnvVariables';
import ExternalLink from 'components/uiKit/ExternalLink';

const USER_BASE_URL = EnvironmentVariables.configFor('CAVATICA_USER_BASE_URL');

const fetchAllProjects = createAsyncThunk<
  TCavaticaProjectWithMembers[],
  void,
  { rejectValue: string; state: RootState }
>(
  'cavatica/fetch/projects',
  async (_, thunkAPI) => {
    const { data, error } = await CavaticaApi.fetchProjects();
    const projects = data?.items || [];

    if (error) {
      notification.error({
        message: intl.get('api.cavatica.error.title'),
        description: intl.get('api.cavatica.error.projects.fetch'),
      });
      return thunkAPI.rejectWithValue(error.message);
    }

    const projectList = await Promise.all(
      (projects || []).map(async (project) => {
        const [memberResponse] = await Promise.all([CavaticaApi.fetchProjetMembers(project.id)]);

        return { ...project, memberCount: memberResponse.data?.items.length || 0 };
      }),
    );

    return projectList;
  },
  {
    condition: (_, { getState }) => {
      const { cavatica } = getState();

      return isEmpty(cavatica.projects);
    },
  },
);

const beginAnalyse = createAsyncThunk<
  IFileEntity[],
  {
    sqon: ISqonGroupFilter;
    fileIds: string[];
  },
  { rejectValue: string; state: RootState }
>('cavatica/begin/analyse', async (args, thunkAPI) => {
  const sqon: ISqonGroupFilter = { ...args.sqon } || {
    op: BooleanOperators.and,
    content: [],
  };

  if (args.fileIds.length > 0) {
    sqon.content = [
      ...sqon.content,
      termToSqon({
        field: 'file_id',
        value: args.fileIds,
      }),
    ];
  }

  const { data, error } = await sendRequest<{ data: IFileResultTree }>({
    url: ARRANGER_API_PROJECT_URL,
    method: 'POST',
    data: {
      query: SEARCH_FILES_QUERY.loc?.source.body,
      variables: {
        sqon,
        first: CAVATICA_FILE_BATCH_SIZE,
      },
    },
  });

  if (error) {
    notification.error({
      message: 'Error',
      description: 'Unable to fetch selected files',
    });
    return thunkAPI.rejectWithValue(error.message);
  }

  const {
    data: { file },
  } = data!;

  return hydrateResults(file?.hits?.edges || []);
});

const fetchAllBillingGroups = createAsyncThunk<
  ICavaticaBillingGroup[],
  void,
  { rejectValue: string; state: RootState }
>(
  'cavatica/fetch/billingGroups',
  async (_, thunkAPI) => {
    const { data, error } = await CavaticaApi.fetchBillingGroups();

    return handleThunkApiReponse({
      error,
      data: data?.items || [],
      reject: thunkAPI.rejectWithValue,
      onError: () =>
        notification.error({
          message: intl.get('api.cavatica.error.title'),
          description: intl.get('api.cavatica.error.billingGroups.fetch'),
        }),
    });
  },
  {
    condition: (_, { getState }) => {
      const { cavatica } = getState();

      return isEmpty(cavatica.billingGroups);
    },
  },
);

const createProjet = createAsyncThunk<
  {
    isAnalyseModalVisible: boolean;
    newProject: ICavaticaProject;
  },
  {
    openAnalyseModalOnDone?: boolean;
    showSuccessNotification?: boolean;
    showErrorNotification?: boolean;
    body: ICavaticaCreateProjectBody;
  },
  { rejectValue: string; state: RootState }
>('cavatica/create/project', async (args, thunkAPI) => {
  const { data, error } = await CavaticaApi.createProject(args.body);

  return handleThunkApiReponse({
    error,
    reject: thunkAPI.rejectWithValue,
    onError: () => {
      if (args.showErrorNotification) {
        notification.error({
          message: intl.get('api.cavatica.error.title'),
          description: intl.get('api.cavatica.error.projects.create'),
        });
      }
    },
    onSuccess: () => {
      if (args.showSuccessNotification) {
        notification.success({
          message: intl.get('api.cavatica.success.title'),
          description: intl.get('api.cavatica.success.projects.create'),
        });
      }
    },
    data: {
      isAnalyseModalVisible: args.openAnalyseModalOnDone || false,
      newProject: data!,
    },
  });
});

const startBulkImportJob = createAsyncThunk<
  any,
  ICavaticaTreeNode,
  { rejectValue: string; state: RootState }
>('cavatica/bulk/import', async (node, thunkAPI) => {
  const { cavatica } = thunkAPI.getState();
  const selectedFiles = cavatica.filesToCopy;
  const isProject = node.type === CAVATICA_TYPE.PROJECT;

  const cavaticaDRSItems = selectedFiles.map((file) => ({
    drs_uri: file.access_urls,
    [isProject ? 'project' : 'parent']: node.id,
  }));

  const { data, error } = await CavaticaApi.startBulkDrsImportJob({
    items: cavaticaDRSItems,
  });

  return handleThunkApiReponse({
    error,
    data,
    reject: thunkAPI.rejectWithValue,
    onError: () =>
      notification.error({
        message: intl.get('api.cavatica.error.title'),
        description: intl.get('api.cavatica.error.bulk.import'),
      }),
    onSuccess: () =>
      notification.success({
        message: intl.get('api.cavatica.success.title'),
        description: (
          <div>
            {intl.getHTML('api.cavatica.success.bulk.import.copySuccess', {
              destination: node.title,
            })}
            <br />
            <br />
            {intl.get('api.cavatica.success.bulk.import.possibleDelays')}
            <br />
            <br />
            <a
              href={`${USER_BASE_URL}${isProject ? node.id : node.project!}`}
              style={{ color: 'unset', textDecoration: 'underline' }}
              rel="noreferrer"
              target="_blank"
            >
              {intl.get('api.cavatica.success.bulk.import.openProject')}
            </a>
          </div>
        ),
        duration: 5,
      }),
  });
});

export { fetchAllProjects, fetchAllBillingGroups, createProjet, beginAnalyse, startBulkImportJob };
