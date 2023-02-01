import React, { Component } from 'react';
import { Input, message } from 'antd';
import PropTypes from 'prop-types';
// TODO:优化项，不依赖lodash
import { debounce } from 'lodash';
// TODO:图片资源
import iconAdd from '../../assets/referral/icon_add.svg';
import iconDel from '../../assets/referral/icon_del.svg';
import styles from './index.less';

let tempList;

class ZZMultiInput extends Component {
  constructor(props) {
    super();
    tempList = ZZMultiInput.init(props);
    this.state = {
      list: tempList,
      currentFocusIdx: -1,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    tempList = ZZMultiInput.init(nextProps);
    return {
      list: tempList,
    };
  }

  static init(props) {
    const { defaultCount, value } = props;
    const list = ' '.repeat(defaultCount).split('');
    if (value.length > 0) {
      value.forEach((val, idx) => {
        list[idx] = val;
      });
    }
    return list;
  }

  onAdd = (index) => {
    const { maxCount, onChange } = this.props;
    if (tempList.length < maxCount) {
      tempList.splice(index + 1, 0, ' ');
      this.setState({
        currentFocusIdx: index + 1,
      });
      onChange?.(tempList.map((item) => item.trim()));
    } else {
      message.info(`最多添加${maxCount}个`);
    }
  };

  onDel = (index) => {
    const { onChange, onValidate } = this.props;
    if (tempList.length > 1) {
      tempList.splice(index, 1);
      this.setState({
        currentFocusIdx: index - 1,
      });
      onChange?.(tempList.map((item) => item.trim()));
      onValidate?.(tempList.map((item) => item.trim()));
    } else {
      message.info(`至少保留一个`);
    }
  };

  onChange = debounce((e, index) => {
    const { onChange, onValidate } = this.props;
    tempList.splice(index, 1, e.target.value);
    onChange?.(tempList.map((item) => item.trim()));
    onValidate?.(tempList.map((item) => item.trim()));
    this.setState({
      currentFocusIdx: index,
    });
  }, 500);

  render() {
    const { list, currentFocusIdx } = this.state;
    const { inputComponentProps } = this.props;
    return (
      <div className={styles.container}>
        {list.map((value, index) => {
          return (
            <div
              className={styles.item}
              key={`${`${Math.random()}`.replace('0.', '').slice(0, 10)}`}
            >
              <Input
                {...inputComponentProps}
                className={styles.input}
                defaultValue={value.trim()}
                onChange={(e) => {
                  this.onChange(e, index);
                }}
                autoFocus={currentFocusIdx === index}
              />
              <img
                src={iconAdd}
                className={styles.icon}
                alt="icon_add"
                onClick={() => {
                  this.onAdd(index);
                }}
              />
              <img
                src={iconDel}
                className={styles.icon}
                alt="icon_delete"
                onClick={() => {
                  this.onDel(index);
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }
}
ZZMultiInput.propTypes = {
  defaultCount: PropTypes.number,
  maxCount: PropTypes.number,
  inputComponentProps: PropTypes.object,
  // 以下在AntDesign表单中使用时自动添加
  value: PropTypes.array,
  onChange: PropTypes.func,
  onValidate: PropTypes.func,
};
ZZMultiInput.defaultProps = {
  defaultCount: 1,
  maxCount: 10,
  inputComponentProps: {},
  value: [],
  onChange: () => {},
  onValidate: () => {},
};
export default ZZMultiInput;
