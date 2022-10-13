import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Steps, Spin } from 'antd';
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
    this.props.onCancel();
  };

  renderTitle = () => {
    const { title, desc } = this.props;
    return (
      <div className="flex-start-end">
        <div className={styles.title}>{title}</div>
        {desc && (
          <>
            <div style={{ padding: 2 }}>|</div>
            <div style={{ fontSize: 14 }}>{desc}</div>
          </>
        )}
      </div>
    );
  };

  render() {
    const { visible } = this.state;
    const { modalProp, currentStep, stepArr, children, footer, showStep, loading } = this.props;
    const h = document.body.clientHeight * 0.8;
    return (
      <Modal
        visible={visible}
        title={this.renderTitle()}
        wrapClassName={styles.modalContainer}
        width={'90vw'}
        bodyStyle={{ height: h }}
        maskClosable={true}
        closable={true}
        onCancel={this.onCancel}
        footer={null}
        {...modalProp}
      >
        <Spin spinning={loading}>
          {showStep && (
            <Steps current={currentStep} size="small" className={styles.stepsContainer}>
              {stepArr.map((step, index) => {
                return <Step key={index} title={step} />;
              })}
            </Steps>
          )}
          {/* 自定义表单内容 */}
          <div
            className={styles.main}
            style={showStep ? { height: h - 48 } : { paddingTop: 0, height: h - 48 }}
          >
            <div className={styles.wrapper}>{children}</div>
          </div>
          {/* 自定义底部按钮 */}
          <div className={styles.footer}>{footer && footer()}</div>
        </Spin>
      </Modal>
    );
  }
}
ZZLargeStepModal.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  desc: PropTypes.string,
  modalProp: PropTypes.object,
  showStep: PropTypes.bool,
  currentStep: PropTypes.number,
  stepArr: PropTypes.array,
  footer: PropTypes.func,
  onCancel: PropTypes.func,
  loading: PropTypes.bool,
};
ZZLargeStepModal.defaultProps = {
  visible: false,
  title: '',
  desc: '',
  modalProp: {},
  showStep: true,
  currentStep: 0,
  stepArr: [],
  footer: () => {},
  onCancel: () => {},
  loading: false,
};
export default ZZLargeStepModal;
