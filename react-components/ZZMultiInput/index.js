import React, { Component } from 'react';
import { Input, message } from 'antd';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import iconAdd from '../../assets/referral/icon_add.png';
import iconDel from '../../assets/referral/icon_del.png';
import styles from './index.less';

let tempList;

class ZZMultiInput extends Component {
  constructor(props) {
    super();
    tempList = ZZMultiInput.init(props);
    this.state = {
      list: tempList,
      currentFocusIdx: 0,
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
    const list = tempList;
    if (list.length < maxCount) {
      list.splice(index + 1, 0, ' ');
      this.setState({ list });
      onChange?.(list.map((item) => item.trim()));
    } else {
      message.info(`最多添加${this.props.maxCount}个`);
    }
    this.setState({
      currentFocusIdx: index + 1,
    });
  };

  onDel = (index) => {
    const { onChange } = this.props;
    const list = tempList;
    if (list.length > 1) {
      list.splice(index, 1);
      this.setState({ list });
      onChange?.(list.map((item) => item.trim()));
    } else {
      message.info(`至少保留一个`);
    }
    this.setState({
      currentFocusIdx: index - 1,
    });
  };

  onChange = debounce((e, index) => {
    const { onChange } = this.props;
    tempList.splice(index, 1, e.target.value);
    onChange?.(tempList.map((item) => item.trim()));
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
                defaultValue={value}
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
  // 在AntDesign表单中使用时自动绑定
  value: PropTypes.array,
  // 用于在非表单中获取值
  onChange: PropTypes.func,
};
ZZMultiInput.defaultProps = {
  defaultCount: 1,
  maxCount: 10,
  inputComponentProps: {},
  value: [],
  onChange: () => {},
};
export default ZZMultiInput;
