import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, InputNumber, TimePicker, Radio, Row, Col, Select } from 'antd';
import styles from './index.less';

const { TextArea } = Input;

class ZZBox extends Component {
  constructor() {
    super();
    this.state = {
      currentSelectedValue: {},
    };
  }

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

  renderTimePicker = (tplConfig) => {
    const { componentProps, basicProps } = tplConfig;
    return (
      <Form.Item {...basicProps}>
        <TimePicker {...componentProps} />
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

  onSelectChange = (componentProps, value, option) => {
    componentProps?.onChange?.(value, option);
    if (componentProps.renderSuffix) {
      this.setState({
        currentSelectedValue: value,
      });
    }
  };

  renderSelect = (tplConfig) => {
    const { componentProps, basicProps } = tplConfig;
    return (
      <>
        <Form.Item {...basicProps}>
          <Select
            {...componentProps}
            onChange={(value, option) => {
              this.onSelectChange(componentProps, value, option);
            }}
          />
        </Form.Item>
        {componentProps?.renderSuffix?.(this.state.currentSelectedValue)}
      </>
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
      case 'timePicker':
        item = this.renderTimePicker(tplCfg);
        break;
      case 'textarea':
        item = this.renderTextArea(tplCfg);
        break;
      case 'radio':
        item = this.renderRadio(tplCfg);
        break;
      case 'select':
        item = this.renderSelect(tplCfg);
        break;
      default:
        item = this.renderText(tplCfg);
        break;
    }
    return (
      <Col key={i} className={styles.item} style={tplCfg.wrapperStyle} {...(tplCfg.col ?? {})}>
        {item}
      </Col>
    );
  };

  render() {
    const { title, containerStyle, templates } = this.props;

    return (
      <div className={styles.container} style={containerStyle}>
        <div className={styles.header}>{title}</div>
        <Row className={styles.main}>
          {templates &&
            templates.map((tplConfig, i) => {
              return this.renderItem(tplConfig, i);
            })}
        </Row>
      </div>
    );
  }
}
/**
 * 简单示例：
 * <ZZBox
 *   title="APP账号信息"
 *   templates={[
      {
        tplType: 'text',
        componentProps: {
          value: '',
        },
        basicProps: {
          name: 'appUserDescription',
          label: 'APP账号',
        },
      },
    ]}
  />
 */
ZZBox.propTypes = {
  // 块区域的标题
  title: PropTypes.string,
  // 块区域的容器自定义样式
  containerStyle: PropTypes.object,
  // 块区域的模板数据，是一个数组，每个元素是一个由以下4个属性组成的对象，
  // 模板被包裹的样式wrapperStyle
  // 模板类型tplType（使用什么组件）
  // 基础属性basicProps
  // 组件属性componentProps
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
  containerStyle: {},
  templates: [],
};
export default ZZBox;
