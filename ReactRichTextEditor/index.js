import React, { useState, useEffect } from 'react';

import { Spin, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
// TODO:优化项，不依赖lodash
import { throttle } from 'lodash-es';

import ZZModal from '../ZZModal';
// TODO:优化项，抽取为属性，对外暴露
import { upload } from '@/api/faq';

import {
  initialTemplate,
  inputDisplayContent,
  uploadDisplayContent,
  appletInfo,
  h5Info,
} from './template';
import { displayTypeEnum, openTypeEnum } from './enum';
import { getPreviewHtml } from './preview';
import styles from './index.less';

// 富文本编辑器对象
let mceEditor;
// 小程序信息模板
let appletInfoTpl;
// 表单模板缓存对象
let formTplTemp;

export default function ZZRichTextEditor(props) {
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [templates, setTemplates] = useState(initialTemplate);
  const [uploadPicSrc, setUploadPicSrc] = useState('');

  uploadDisplayContent.componentProps = {
    ...uploadDisplayContent.componentProps,
    customRequest: (e) => {
      // console.log(e);
      upload(e.file)
        .then((res) => {
          setUploadPicSrc(res.data.url);

          // 同时设置表单值
          formTplTemp[1].componentProps = {
            ...formTplTemp[1].componentProps,
            defaultFileList: [e.file],
          };
          setTemplates(formTplTemp);

          e.onSuccess();
        })
        .catch((err) => {
          message.error(err.message);
          e.onError();
        });
    },
    children: (
      <div className={styles.upload}>
        {uploadPicSrc ? (
          <img className={styles.uploadImg} src={uploadPicSrc} alt="上传图片" />
        ) : (
          <PlusOutlined />
        )}
      </div>
    ),
  };

  const insertDisplayContentTpl = (displayContentTpl, val) => {
    let idx = formTplTemp.findIndex((tpl) => tpl.basicProps.name === 'displayContent');
    // 重置修改模块的属性值
    let temp;
    if (displayContentTpl.tplType === 'input') {
      temp = displayContentTpl;
      temp.componentProps.value = '';
    }
    if (idx > -1) {
      formTplTemp.splice(idx, 1, temp || displayContentTpl);
    } else {
      formTplTemp.splice(1, 0, temp || displayContentTpl);
    }

    idx = formTplTemp.findIndex((tpl) => tpl.basicProps.name === 'displayType');
    formTplTemp[idx].componentProps.value = val;
  };

  const insertAppletTpl = (val) => {
    formTplTemp = formTplTemp.filter((tpl) => !['src'].includes(tpl.basicProps.name));
    let idx = formTplTemp.findIndex((tpl) => tpl.basicProps.name === 'appid');
    // 重置引用模块的属性值
    appletInfoTpl = appletInfoTpl.map((tpl) => {
      return {
        ...tpl,
        componentProps: {
          ...tpl.componentProps,
          value: '',
        },
      };
    });
    if (idx > -1) {
      formTplTemp.splice(idx, appletInfo.length, ...appletInfoTpl);
    } else {
      formTplTemp.push(...appletInfoTpl);
    }

    idx = formTplTemp.findIndex((tpl) => tpl.basicProps.name === 'openType');
    formTplTemp[idx].componentProps.value = val;
  };

  const insertH5Tpl = (val) => {
    formTplTemp = formTplTemp.filter(
      (tpl) => !['appid', 'originId', 'name', 'path'].includes(tpl.basicProps.name),
    );
    let idx = formTplTemp.findIndex((tpl) => tpl.basicProps.name === 'src');
    // 重置引用模块的属性值
    h5Info.componentProps.value = '';
    if (idx > -1) {
      formTplTemp.splice(idx, 1, h5Info);
    } else {
      formTplTemp.push(h5Info);
    }

    idx = formTplTemp.findIndex((tpl) => tpl.basicProps.name === 'openType');
    formTplTemp[idx].componentProps.value = val;
  };

  // 监听展示方式或跳转方式选择变化
  const onChange = (e) => {
    const val = e.target.value;
    formTplTemp = [...formTplTemp];
    switch (val) {
      case 'text':
      case 'button':
        insertDisplayContentTpl(inputDisplayContent, val);
        break;
      case 'image':
        insertDisplayContentTpl(uploadDisplayContent, val);
        break;
      case 'applet':
        insertAppletTpl(val);
        break;
      case 'H5':
        insertH5Tpl(val);
        break;
      default:
        break;
    }

    formTplTemp = formTplTemp.map((tpl) => {
      if (['displayType', 'openType'].includes(tpl.basicProps.name)) {
        return {
          tplType: tpl.tplType,
          basicProps: tpl.basicProps,
          componentProps: {
            ...tpl.componentProps,
            onChange: (event) => {
              onChange(event);
            },
          },
        };
      }
      return tpl;
    });

    setTemplates(formTplTemp);
  };

  // 监听输入类型模板值变化
  const onInput = throttle((e) => {
    // console.log(e);
    const {
      target: { id, value },
    } = e;
    const idx = formTplTemp.findIndex((tpl) => tpl.basicProps.name === id);
    // 修改模块属性值
    formTplTemp[idx].componentProps.value = value;
  }, 200);

  const init = () => {
    formTplTemp = initialTemplate.map((tpl) => {
      if (['displayType', 'openType'].includes(tpl.basicProps.name)) {
        return {
          ...tpl,
          componentProps: {
            ...tpl.componentProps,
            onChange: (e) => {
              onChange(e);
            },
          },
        };
      }
      return tpl;
    });

    setTemplates(formTplTemp);
    setUploadPicSrc('');
  };

  useEffect(() => {
    init();

    inputDisplayContent.componentProps = {
      ...inputDisplayContent.componentProps,
      onChange: (e) => {
        onInput(e);
      },
    };
    appletInfoTpl = appletInfo.map((info) => {
      return {
        ...info,
        componentProps: {
          ...info.componentProps,
          onChange: (e) => {
            onInput(e);
          },
        },
      };
    });
    h5Info.componentProps = {
      ...h5Info.componentProps,
      onChange: (e) => {
        onInput(e);
      },
    };
  }, []);

  // 监听表单完成
  const onFinish = (e) => {
    // console.log(e);
    const { displayType, displayContent, openType, appid, originId, path, src, name } = e;
    const appletAttrs = `data-type='${openType}' data-appid='${appid}' data-originid='${originId}' data-path='${path}' data-name='${name}' data-click`;
    const h5Attrs = `data-type='${openType}' data-src='${src}' data-click`;
    const btnStyle = `'min-width: 287px;
      max-width: 100%;
      height: 40px;
      padding: 9px 10px;
      border: 1px solid #006F83;
      line-height:1;
      color: #006D83;
      text-overflow: ellipsis;
      white-space: nowrap;
      background-color: white;
      font-size: 16px;
      border-radius: 4px;
      box-sizing: border-box;
      cursor: pointer;
      overflow: hidden;'`;
    const flexCenter = `'display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;'`;

    let content = '';
    if (displayType === displayTypeEnum.TEXT) {
      if (openType === openTypeEnum.APPLET) {
        content = `<div style=${flexCenter}><span style='cursor: pointer;' ${appletAttrs} >${displayContent}</span></div><br/>`;
      } else if (openType === openTypeEnum.H5) {
        content = `<div style=${flexCenter}><span style='cursor: pointer;' ${h5Attrs} >${displayContent}</span></div><br/>`;
      }
    }
    if (displayType === displayTypeEnum.IMAGE) {
      if (openType === openTypeEnum.APPLET) {
        content = `<img style='cursor: pointer;' ${appletAttrs} src=${uploadPicSrc} />`;
      } else if (openType === openTypeEnum.H5) {
        content = `<img style='cursor: pointer;' ${h5Attrs} src=${uploadPicSrc} />`;
      }
    }
    if (displayType === displayTypeEnum.BUTTON) {
      if (openType === openTypeEnum.APPLET) {
        content = `<div style=${flexCenter}><button style=${btnStyle} ${appletAttrs} >${displayContent}</button></div><br/>`;
      } else if (openType === openTypeEnum.H5) {
        content = `<div style=${flexCenter}><button style=${btnStyle} ${h5Attrs} >${displayContent}</button></div><br/>`;
      }
    }
    mceEditor.insertContent(content);
    setModalVisible(false);
    // 重置
    init();
  };

  const onPreview = () => {
    const content = getPreviewHtml(mceEditor);
    const dataApi = mceEditor.windowManager.open({
      title: 'Preview',
      size: 'medium',
      body: {
        type: 'panel',
        items: [
          {
            name: 'preview',
            type: 'iframe',
            sandboxed: true,
          },
        ],
      },
      buttons: [],
      initialData: { preview: content },
    });
    dataApi.focus('close');
  };

  const editorOpts = {
    min_width: 375,
    height: 500,
    placeholder: '',
    content_css: 'writer',
    language: 'zh_CN',
    // 显示菜单栏
    menubar: true,
    // 隐藏底栏的元素路径
    elementpath: false,
    // 隐藏右下角技术支持
    branding: false,
    // 隐藏状态条
    statusbar: false,
    // 引入插件
    plugins:
      'advlist autolink lists image charmap print anchor ' +
      'searchreplace visualblocks code fullscreen ' +
      'insertdatetime media table paste help wordcount ' +
      'directionality visualchars template codesample hr pagebreak nonbreaking textpattern emoticons autoresize ',
    // 工具栏配置
    toolbar:
      'undo redo | formatselect fontsizeselect bold italic underline strikethrough removeformat |' +
      'forecolor backcolor | alignleft aligncenter alignright alignjustify |' +
      'bullist numlist outdent indent lineheight | ' +
      'applet image media anchor emoticons hr pagebreak insertdatetime | fullscreen mobilepreview |',

    // 允许粘贴图片
    paste_data_images: true,

    // powerpaste插件配置
    powerpaste_word_import: 'propmt',
    powerpaste_html_import: 'propmt',
    powerpaste_allow_local_images: true,

    // 字体配置
    font_formats:
      "默认='Helvetica Neue', Helvetica, Arial, sans-serif;宋体=宋体;幼圆=幼圆;微软雅黑=微软雅黑;黑体=黑体;楷体=楷体",

    // 图片上传回调
    images_upload_handler: (info, success, failure) => {
      // console.log(info, success, failure);
      upload(info.blob())
        .then((res) => {
          success(res.data.url);
        })
        .catch((err) => {
          message.error(err.message);
          failure();
        });
    },

    // 自定义富文本初始化样式
    content_style: `
      body {
        width: 750px;
        padding: 0;
        margin: auto;
        overflow-x: hidden;
        word-break: break-all;
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: pre-wrap;
      }
      img {
        max-width: 100% !important;
      }
      table {
        max-width: 100% !important;
        width: 100% !important;
      }
    `,

    // external_plugins: '',
    setup(editor) {
      editor.ui.registry.addButton('applet', {
        icon: 'link',
        text: '插入小程序或H5链接',
        onAction() {
          setModalVisible(true);
        },
      });
      editor.ui.registry.addButton('mobilepreview', {
        icon: 'preview',
        text: '',
        onAction() {
          onPreview();
        },
      });
    },
  };

  const onEditorInit = (evt, editor) => {
    // console.log(evt, editor);
    mceEditor = editor;
    setLoading(false);
  };

  const onEditorChange = throttle((richText) => {
    const style = `<style>img{max-width:100% !important;}table{max-width:100% !important;width:100% !important;}p{margin:0 auto;}</style>`;
    props.onEditorChange(`${richText}${style}`);
  }, 3000);

  return (
    <>
      <Spin size="large" tip="Loading..." spinning={loading}>
        <Editor
          apiKey="1notfi8zn224f0knmbmw65damz7pf7tleushl9k4ckljycnb"
          init={editorOpts}
          initialValue={props.initialRichText}
          onInit={onEditorInit}
          onEditorChange={(newValue, editor) => {
            onEditorChange(newValue, editor);
          }}
        />
      </Spin>
      <ZZModal
        templates={templates}
        visible={modalVisible}
        onCloseModal={() => {
          setModalVisible(false);
          // 重置
          init();
        }}
        callback={onFinish}
        resetFields={!modalVisible}
      />
    </>
  );
}
