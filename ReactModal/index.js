import React, { Component } from 'react';
import { Button, Form, Modal, DatePicker, Input, Radio, Upload } from 'antd';
import PropTypes from 'prop-types';
import styles from './index.less';

const { TextArea } = Input;

const isFunction = function(target){
  return toString.call(target) === "[object Function]"
}

/**
 *  表单弹框，通过模板数据创建表单
 *  后续可根据场景添加表单组件
 */
class ZZModal extends Component {
  static propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool,
    centered: PropTypes.bool,
    closable: PropTypes.bool,
    onCloseModal: PropTypes.func.isRequired,
    resetFields: PropTypes.bool,
    header: PropTypes.func,
    templates: PropTypes.arrayOf(
      PropTypes.shape({
        // 每个模板都有模板类型tplType、表单属性basicProps、应用组件属性componentProps
        tplType: PropTypes.string,
        basicProps: PropTypes.object,
        componentProps: PropTypes.object,
      }),
    ).isRequired,
    footer: PropTypes.func,
    leftBtnProps: PropTypes.object,
    rightBtnProps: PropTypes.object,
  };

  static defaultProps = {
    title: '',
    visible: false,
    centered: false,
    closable: true,
    onCloseModal: () => {},
    resetFields: false,
    header: null,
    templates: [],
    footer: null,
    leftBtnProps: {
      text: '取消',
    },
    rightBtnProps: {
      text: '确定',
      type: 'primary',
      htmlType: 'submit',
    },
  };

  constructor() {
    super();
    this.form = null;
  }

  componentDidUpdate() {
    // 用于设置或重置值
    if (!this.form) return;

    if (this.props.resetFields) {
      this.form.resetFields();
    } else {
      const values = {};
      this.props.templates.forEach((tpl) => {
        if (tpl.tplType === 'upload') {
          values[tpl.basicProps.name] = tpl?.componentProps?.defaultFileList || null;
        } else {
          values[tpl.basicProps.name] = tpl?.componentProps?.value || null;
        }
      });
      this.form.setFieldsValue(values);
    }
  }

  renderText = (tplConfig) => {
    const { componentProps, basicProps } = tplConfig;
    return (
      <Form.Item {...basicProps}>
        <div {...componentProps}>{componentProps.text}</div>
      </Form.Item>
    );
  };

  renderRadio = (tplConfig) => {
    const { componentProps, basicProps } = tplConfig;
    return (
      <Form.Item {...basicProps}>
        <Radio.Group {...componentProps} />
      </Form.Item>
    );
  };

  renderUpload = (tplConfig) => {
    const { componentProps, basicProps } = tplConfig;
    return (
      <Form.Item {...basicProps}>
        <Upload {...componentProps}>{componentProps.children}</Upload>
      </Form.Item>
    );
  };

  renderInput = (tplConfig) => {
    const { componentProps, basicProps } = tplConfig;
    return (
      <Form.Item {...basicProps}>
        <Input {...componentProps} />
      </Form.Item>
    );
  };

  renderTextArea = (tplConfig) => {
    const { componentProps, basicProps } = tplConfig;
    return (
      <Form.Item {...basicProps}>
        <TextArea {...componentProps} />
      </Form.Item>
    );
  };

  renderDatePicker = (tplConfig) => {
    const { componentProps, basicProps } = tplConfig;
    return (
      <Form.Item {...basicProps}>
        <DatePicker {...componentProps} />
      </Form.Item>
    );
  };

  renderItem = (tplConfig, i) => {
    const { tplType } = tplConfig;
    let item;
    switch (tplType) {
      case 'datePicker':
        item = this.renderDatePicker(tplConfig);
        break;
      case 'input':
        item = this.renderInput(tplConfig);
        break;
      case 'textarea':
        item = this.renderTextArea(tplConfig);
        break;
      case 'upload':
        item = this.renderUpload(tplConfig);
        break;
      case 'radio':
        item = this.renderRadio(tplConfig);
        break;
      default:
        item = this.renderText(tplConfig);
        break;
    }
    return <div key={i}>{item}</div>;
  };

  getLabelTextMaxLength = (templates) => {
    if (!templates) return {};
    const len = templates
      .map((tpl) => {
        return tpl.basicProps.label && tpl.basicProps.label.length;
      })
      .reduce((last, current) => {
        return Math.max(current, last);
      }, 0);
    return {
      span: len,
    };
  };

  onFinish = (e) => {
    const { callback } = this.props;
    if (isFunction(callback)) {
      callback(e);
    }
  };

  render() {
    const {
      title,
      visible,
      centered,
      closable,
      onCloseModal,
      header,
      templates,
      footer,
      leftBtnProps,
      rightBtnProps,
    } = this.props;

    const leftBtnDefaultClickProp = {
      onClick: () => {
        if (isFunction(onCloseModal)) {
          onCloseModal();
        }
      },
    };

    return (
      <Modal
        title={title}
        visible={visible}
        centered={centered}
        closable={closable}
        footer={null}
        onCancel={onCloseModal}
      >
        {header && header()}
        <Form
          labelAlign="right"
          labelCol={this.getLabelTextMaxLength(templates)}
          onFinish={this.onFinish}
          ref={(ref) => {
            this.form = ref;
          }}
        >
          {templates &&
            templates.map((tplConfig, i) => {
              return this.renderItem(tplConfig, i);
            })}
          {footer ? (
            footer()
          ) : (
            <div className={styles.flexAround}>
              <Button {...leftBtnDefaultClickProp} {...leftBtnProps}>
                {leftBtnProps.text}
              </Button>
              <Button {...rightBtnProps}>{rightBtnProps.text}</Button>
            </div>
          )}
        </Form>
      </Modal>
    );
  }
}

export default ZZModal;
