import { Fragment, useState } from 'react';
import intl from 'react-intl-universal';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Modal, Space, Typography, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import Compressor from 'compressorjs';

import UserAvatar from 'components/UserAvatar';
import { UserApi } from 'services/api/user';
import { useAppDispatch } from 'store';
import { useUser } from 'store/user';
import { updateUser } from 'store/user/thunks';

import styles from './index.module.scss';

const ProfileImageUpload = () => {
  const { userInfo } = useUser();
  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const onBeforeUpload = (file: File) => {
    setLoading(true);

    new Compressor(file, {
      quality: 0.8,
      maxHeight: 300,
      maxWidth: 300,
      strict: true,
      mimeType: 'image/jpeg',
      success: async (compressedFile) => {
        try {
          const s3Key = await UserApi.uploadImageToS3(compressedFile);
          dispatch(
            updateUser({
              data: {
                profile_image_key: s3Key,
              },
            }),
          ).finally(() => setLoading(false));
        } catch {
          message.error(intl.get('screen.profileSettings.cards.identification.uploadImageError'));
        } finally {
          setLoading(false);
        }
      },
    });

    return false;
  };

  const handleDeleteImage = () => {
    setDeleteModalVisible(false);
    dispatch(
      updateUser({
        data: {
          profile_image_key: null,
        },
      }),
    );
  };

  return (
    <Fragment>
      <Space direction="vertical" align="center">
        <UserAvatar size={120} />
        <ImgCrop
          rotate
          modalOk={intl.get('global.save')}
          modalTitle={intl.get('screen.profileSettings.cards.identification.editPhotoModalTitle')}
        >
          <Upload showUploadList={false} maxCount={1} beforeUpload={(file) => onBeforeUpload(file)}>
            <Button size="small" loading={isLoading}>
              <UploadOutlined />
              {intl.get('screen.profileSettings.cards.identification.uploadPhotoButton')}
            </Button>
          </Upload>
        </ImgCrop>
        {userInfo?.profile_image_key && (
          <Button
            size="small"
            type="text"
            className={styles.removeImageButton}
            onClick={() => setDeleteModalVisible(true)}
          >
            {intl.get('screen.profileSettings.cards.identification.removePhotoButton')}
          </Button>
        )}
      </Space>
      <Modal
        visible={isDeleteModalVisible}
        title={intl.get('screen.profileSettings.cards.identification.removePhotoModalTitle')}
        okText={intl.get('screen.profileSettings.cards.identification.removePhotoModalButton')}
        onCancel={() => setDeleteModalVisible(false)}
        onOk={handleDeleteImage}
        okButtonProps={{ danger: true }}
      >
        <Space direction="vertical" align="center">
          <UserAvatar shape="square" size={120} />
          <div className={styles.deleteMessage}>
            <Typography.Text>
              {intl.get('screen.profileSettings.cards.identification.removePhotoModalMessage')}
            </Typography.Text>
          </div>
        </Space>
      </Modal>
    </Fragment>
  );
};

export default ProfileImageUpload;
