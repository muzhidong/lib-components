import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, InputNumber } from 'antd';
import styles from './index.less';

const { TextArea } = Input;

class ZZBox extends Component {
  renderText = (tplConfig) => {
    const { componentProps, basicProps } = tplConfig;
    return (
      <Form.Item {...basicProps}>
        <div {...componentProps}>{componentProps.value}</div>
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

  renderInputNumber = (tplConfig) => {
    const { componentProps, basicProps } = tplConfig;
    return (
      <Form.Item {...basicProps}>
        <InputNumber {...componentProps} />
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

  renderItem = (tplConfig, i) => {
    const { tplType } = tplConfig;
    const tplCfg = {
      ...tplConfig,
      basicProps: {
        ...tplConfig.basicProps,
        style: { ...(tplConfig.basicProps.style || {}), fontWeight: 'bold' },
      },
      componentProps: {
        ...tplConfig.componentProps,
        style: { ...(tplConfig.componentProps.style || {}), fontWeight: 'normal' },
      },
    };
    let item;
    switch (tplType) {
      case 'input':
        item = this.renderInput(tplCfg);
        break;
      case 'inputNumber':
        item = this.renderInputNumber(tplCfg);
        break;
      case 'textarea':
        item = this.renderTextArea(tplCfg);
        break;
      default:
        item = this.renderText(tplCfg);
        break;
    }
    return (
      <div key={i} className={styles.item} style={tplCfg.wrapperStyle}>
        {item}
      </div>
    );
  };

  render() {
    const { title, templates } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.header}>{title}</div>
        <div className={styles.main}>
          {templates &&
            templates.map((tplConfig, i) => {
              return this.renderItem(tplConfig, i);
            })}
        </div>
      </div>
    );
  }
}
ZZBox.propTypes = {
  title: PropTypes.string,
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      wrapperStyle: PropTypes.object,
      tplType: PropTypes.string,
      basicProps: PropTypes.object,
      componentProps: PropTypes.object,
    }),
  ),
};
ZZBox.defaultProps = {
  title: '标题',
  templates: [],
};
export default ZZBox;
