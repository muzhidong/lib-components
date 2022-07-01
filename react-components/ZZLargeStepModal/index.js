import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Steps } from 'antd';
import styles from './index.less';

const { Step } = Steps;

// 支持步进的大弹窗组件
class ZZLargeStepModal extends Component {
  static isFromInner = false;

  constructor() {
    super();
    this.state = {
      visible: false,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    if (!ZZLargeStepModal.isFromInner)
      return {
        visible: nextProps.visible,
      };
    ZZLargeStepModal.isFromInner = false;
    return null;
  }

  onCancel = () => {
    ZZLargeStepModal.isFromInner = true;
    this.setState({ visible: false });
  };

  renderTitle = () => {
    const { title, desc } = this.props;
    return (
      <div class="flex-start-end">
        <div style={{ color: '#40a9ff', fontSize: 16, fontWeight: 'bold' }}>{title}</div>
        <div style={{ padding: 2 }}>|</div>
        <div style={{ fontSize: 14 }}>{desc}</div>
      </div>
    );
  };

  render() {
    const { visible } = this.state;
    const { modalProp, currentStep, stepArr, children, footer } = this.props;
    return (
      <Modal
        visible={visible}
        title={this.renderTitle()}
        wrapClassName={styles.modalContainer}
        width={'90vw'}
        bodyStyle={{ height: document.body.clientHeight * 0.8 }}
        maskClosable={true}
        closable={true}
        onCancel={this.onCancel}
        footer={null}
        {...modalProp}
      >
        <Steps current={currentStep} size="small" className={styles.stepsContainer}>
          {stepArr.map((step) => {
            return <Step key={Math.floor(Math.random() * 1000)} title={step} />;
          })}
        </Steps>
        {/* 自定义表单内容 */}
        <div className={styles.main}>{children}</div>
        {/* 自定义底部按钮 */}
        <div className={styles.footer}>{footer && footer()}</div>
      </Modal>
    );
  }
}
ZZLargeStepModal.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  desc: PropTypes.string,
  modalProp: PropTypes.object,
  currentStep: PropTypes.number,
  stepArr: PropTypes.array,
  footer: PropTypes.func,
};
ZZLargeStepModal.defaultProps = {
  visible: false,
  title: '标题',
  desc: '描述',
  modalProp: {},
  currentStep: 0,
  stepArr: ['第一步', '第二步', '第三步'],
  footer: () => {},
};
export default ZZLargeStepModal;
