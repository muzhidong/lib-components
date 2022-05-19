import { displayTypeEnum, openTypeEnum } from './enum';

// 展示方式选项
const displayType = [
  { label: '文本', value: displayTypeEnum.TEXT },
  { label: '图片', value: displayTypeEnum.IMAGE },
  { label: '按钮', value: displayTypeEnum.BUTTON },
];
// 跳转方式选项
const openType = [
  { label: '小程序', value: openTypeEnum.APPLET },
  { label: 'H5', value: openTypeEnum.H5 },
];

// 初始模板
export const initialTemplate = [
  {
    tplType: 'radio',
    basicProps: {
      name: 'displayType',
      label: '展示方式',
      // required: true,
      rules: [
        {
          required: true,
          message: '请选择展示方式',
        },
      ],
    },
    componentProps: {
      options: displayType,
    },
  },
  {
    tplType: 'radio',
    basicProps: {
      name: 'openType',
      label: '跳转方式',
      rules: [
        {
          required: true,
          message: '请选择跳转方式',
        },
      ],
    },
    componentProps: {
      options: openType,
    },
  },
];
// 输入方式展示内容模板
export const inputDisplayContent = {
  tplType: 'input',
  basicProps: {
    name: 'displayContent',
    label: '展示内容',
    rules: [
      {
        required: true,
      },
    ],
  },
  componentProps: {
    placeholder: '输入文本',
  },
};
// 上传方式展示内容模板
export const uploadDisplayContent = {
  tplType: 'upload',
  basicProps: {
    name: 'displayContent',
    label: '展示内容',
    valuePropName: 'file',
    getValueFromEvent: (e) => {
      return e.file;
    },
    rules: [
      {
        required: true,
        message: '请上传展示图片',
      },
    ],
  },
  componentProps: {
    accept: 'image/*',
    method: 'post',
    listType: 'picture-card',
    multiple: false,
    maxCount: 1,
    showUploadList: false,
  },
};
// 小程序信息模板
export const appletInfo = [
  {
    tplType: 'input',
    basicProps: {
      name: 'appid',
      label: 'APPID',
      rules: [
        {
          required: true,
        },
      ],
    },
  },
  {
    tplType: 'input',
    basicProps: {
      name: 'originId',
      label: '账号原始ID',
      rules: [
        {
          required: true,
        },
      ],
    },
  },
  {
    tplType: 'input',
    basicProps: {
      name: 'name',
      label: '小程序名称',
      rules: [
        {
          required: true,
        },
      ],
    },
  },
  {
    tplType: 'input',
    basicProps: {
      name: 'path',
      label: '小程序跳转路径',
      rules: [
        {
          required: true,
        },
      ],
    },
    componentProps: {
      placeholder: '形如pages/index',
    },
  },
];
// H5信息模板
export const h5Info = {
  tplType: 'input',
  basicProps: {
    name: 'src',
    label: 'H5链接',
    rules: [
      {
        required: true,
      },
    ],
  },
};
