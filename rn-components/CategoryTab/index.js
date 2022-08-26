import React, { Component } from 'react';
import {
  TouchableOpacity, ScrollView, Text, View, Image
} from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import screenUtils from 'app/utils/screenUtils';
import ImagesConfig from 'app/config/ImagesConfig';
import styles from './styles';
// TODO:宽度不大于页宽去阴影；选中Tab滚动距离有偏差
class CategoryTab extends Component {
  static isFromInner = false;

  scrollViewRef = null;

  constructor(props) {
    super(props);
    this.state = {
      selectedIdx: 0,
      showGradient: false
    };
  }

  static getDerivedStateFromProps(nextProps) {
    if (!CategoryTab.isFromInner) {
      return {
        selectedIdx: nextProps.selectedTabIdx
      };
    }
    CategoryTab.isFromInner = false;
    return null;
  }

  onScrollViewLayout = e => {
    const w = e.nativeEvent.layout.width;
    if (w >= screenUtils.ScreenWidth - 30) {
      this.setState({
        showGradient: true
      });
    }
  }

  onChange = (tab, idx) => {
    CategoryTab.isFromInner = true;
    this.setState({
      selectedIdx: idx
    }, () => {
      this.props.onChange({ ...tab, idx });
    });
    this.scrollViewRef.scrollTo({
      x: ((screenUtils.ScreenWidth - 30) / 5) * idx,
      y: 0,
      animated: true
    });
  }

  render() {
    const {
      tabs
    } = this.props;
    const {
      selectedIdx,
      showGradient
    } = this.state;
    return (
      <View style={styles.tabContainer}>
        {showGradient && (
          <Image style={styles.shadow} source={ImagesConfig.shadow} />
        )}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={ref => { this.scrollViewRef = ref; }}
          onLayout={this.onScrollViewLayout}
        >
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => { this.onChange(tab, index); }}
            >
              <View
                style={[styles.tab, tabs.length - 1 !== index && styles.space]}
              >
                <Text style={[styles.text, selectedIdx === index && styles.active]}>{tab.name}</Text>
                {selectedIdx === index && (
                  <LinearGradient
                    style={styles.underline}
                    colors={['#F9FCFD', '#ECF0F9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <View />
                  </LinearGradient>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }
}
CategoryTab.propTypes = {
  // 类别列表
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })
  ).isRequired,
  // 当前选中索引
  selectedTabIdx: PropTypes.number,
  // 自定义tab变化回调函数
  onChange: PropTypes.func.isRequired
};
CategoryTab.defaultProps = {
  selectedTabIdx: 0
};
export default CategoryTab;
