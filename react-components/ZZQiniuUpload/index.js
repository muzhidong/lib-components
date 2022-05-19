import React, { Component } from 'react';
import { request } from 'umi';
import PropTypes from 'prop-types';
import { Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { getStorage, setStorage } from '@/utils/storage';
import { getQiniuUploadToken } from '@/api/referral';

import styles from './index.less';

const qiniuUploadUrl = 'https://upload.qiniup.com';
const cdn = 'https://crm-storage.distinctclinic.com';
// 设置客、服两端缓冲时间
const buffer = 2000;

class ZZQiniuUpload extends Component {
  constructor(props) {
    super();
    this.state = {
      currentFileList: props.defaultFileList,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      currentFileList: nextProps.defaultFileList,
    };
  }

  isInTypes(type) {
    const { accept } = this.props;
    const [media = '', format = ''] = type.split('/');
    let result = false;
    accept.split(',').forEach((item) => {
      if (item === type) result = true;
      if (item.indexOf('.') === 0 && item.slice(1) === format) result = true;
      if (item === `${media}/*`) result = true;
    });
    return result;
  }

  beforeUpload = (file, fileList) => {
    const { fileMaxSize, maxCount } = this.props;
    const { size, uid, type } = file;

    if (!this.isInTypes(type)) return false;

    if (fileMaxSize !== -1 && size > fileMaxSize) return false;

    const idx = fileList
      .filter((item) => item.size <= fileMaxSize)
      .findIndex((item) => item.uid === uid);

    return this.state.currentFileList.length + idx + 1 <= maxCount;
  };

  getQiniuToken = async () => {
    const qiniu = getStorage('qiniu');
    if (qiniu && new Date().getTime() <= qiniu.expireTime && qiniu.token) {
      return Promise.resolve(qiniu.token);
    }

    const {
      data: { token, expires },
    } = await getQiniuUploadToken();

    setStorage('qiniu', {
      token,
      expireTime: new Date().getTime() + expires * 1000 - buffer,
    });

    return Promise.resolve(token);
  };

  customRequest = async (e) => {
    const qiniuToken = await this.getQiniuToken();

    const formData = new FormData();
    formData.append('token', qiniuToken);
    formData.append('file', e.file);

    request(qiniuUploadUrl, {
      method: 'POST',
      data: formData,
      requestType: 'form',
    })
      .then((res) => {
        const { currentFileList } = this.state;
        currentFileList.push({
          uid: e.file.uid,
          url: `${cdn}/${res.key}`,
        });
        this.setState({
          currentFileList: [...currentFileList],
        });

        this.props.onFileListChange(currentFileList.map((item) => item.url));

        e.onSuccess();
      })
      .catch((err) => {
        message.error(err.message);
        e.onError();
      });
  };

  onRemove = (file) => {
    const { uid } = file;
    const { currentFileList } = this.state;

    const idx = currentFileList.findIndex((item) => item.uid === uid);
    currentFileList.splice(idx, 1);
    this.setState({
      currentFileList: [...currentFileList],
    });

    this.props.onFileListChange(currentFileList.map((item) => item.url));

    return true;
  };

  previewFile = (file) => {
    return Promise.resolve(this.state.currentFileList.find((item) => item.uid === file.uid)?.url);
  };

  render() {
    const { currentFileList } = this.state;
    const { maxCount } = this.props;
    return (
      <Upload
        {...this.props}
        fileList={currentFileList}
        method={'post'}
        beforeUpload={this.beforeUpload}
        customRequest={this.customRequest}
        onRemove={this.onRemove}
        previewFile={this.previewFile}
      >
        {currentFileList.length < maxCount && (
          <div className={styles.upload}>
            <PlusOutlined />
          </div>
        )}
      </Upload>
    );
  }
}

ZZQiniuUpload.propTypes = {
  // 上传成功回调
  onFileListChange: PropTypes.func,
  // 文件大小限制
  fileMaxSize: PropTypes.number,
  // 以下均是AntDesign Upload组件提供的属性
  accept: PropTypes.string,
  listType: PropTypes.string,
  multiple: PropTypes.bool,
  maxCount: PropTypes.number,
  showUploadList: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  defaultFileList: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string,
      url: PropTypes.string,
    }),
  ),
};

ZZQiniuUpload.defaultProps = {
  onFileListChange: () => {},
  fileMaxSize: -1,
  accept: 'image/*',
  listType: 'picture-card',
  multiple: true,
  maxCount: 6,
  showUploadList: true,
  defaultFileList: [],
};

export default ZZQiniuUpload;
