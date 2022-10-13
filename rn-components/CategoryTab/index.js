import React, { Component } from 'react';
import {
  TouchableOpacity, ScrollView, Text, View, Image
} from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import screenUtils from 'app/utils/screenUtils';
import ImagesConfig from 'app/config/ImagesConfig';
import appStyles from 'app/styles/appStyles';
import styles from './styles';

class CategoryTab extends Component {
  static isFromInner = false;

  scrollViewRef = null;

  itemWidthArr = [];

  initFlag = true;

  constructor(props) {
    super(props);
    this.state = {
      selectedIdx: 0
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

  onLayout = (e, index) => {
    const w = e.nativeEvent.layout.width;
    this.itemWidthArr[index] = this.state.selectedIdx === index ? w - 8 : w;
    if (this.initFlag && this.itemWidthArr.filter(i => !!i).length === this.props.tabs.length) {
      this.scroll(this.state.selectedIdx);
      this.initFlag = false;
    }
  }

  onChange = (tab, idx) => {
    CategoryTab.isFromInner = true;
    this.setState({
      selectedIdx: idx
    }, () => {
      this.props.onChange({ ...tab, idx });
    });
    this.scroll(idx);
  }

  scroll = idx => {
    let offset = this.itemWidthArr.slice(0, idx).reduce((total, item) => total + item, 0);
    offset -= ((screenUtils.ScreenWidth - 30) - (this.itemWidthArr[idx] + 8)) / 3;
    this.scrollViewRef.scrollTo({
      x: offset,
      y: 0,
      animated: true
    });
  }

  render() {
    const {
      tabs
    } = this.props;
    const {
      selectedIdx
    } = this.state;
    return (
      <View style={styles.tabContainer}>
        <Image style={styles.shadow} source={ImagesConfig.shadow} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={ref => { this.scrollViewRef = ref; }}
        >
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => { this.onChange(tab, index); }}
              activeOpacity={appStyles.activeOpacity.normal}
            >
              <View
                style={[styles.tab, tabs.length - 1 !== index && styles.space]}
                onLayout={e => { this.onLayout(e, index); }}
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
