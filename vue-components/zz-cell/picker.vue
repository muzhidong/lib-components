<!--
 * @Author: liuxiaodong
 * @Date: 2022-02-25 11:06:21
 * @LastEditTime: 2022-04-06 10:16:21
 * @Description: 选择器类型，暂时只支持单列选择器。
-->
<template>
  <view>
    <block v-if="attrOpts.useDefaultSlot ===  undefined? true: attrOpts.useDefaultSlot">
      <!-- 默认视图 -->
      <view class="container" @tap="onOpenPicker">
        <view class="picker-flex-0">{{field}}</view>
        <view class="right">
          <view class="right-text">
            <block v-if="attrOpts.prefix">{{attrOpts.prefix || ''}}</block>
            {{value}}
            <block v-if="attrOpts.suffix">{{attrOpts.suffix || ''}}</block>
          </view>
          <view class="arrow right"></view>
        </view>
      </view>
    </block>
    <!-- 自定义视图 -->
    <slot></slot>
    <!-- 选择器弹窗 -->
    <block v-if="attrOpts.forceUpdateOnCancel">
      <view class="mask" v-if="showPicker">
        <view class="mask-wrapper">
          <view class="picker-flex-1" @tap.stop="onTogglePicker"></view>
          <view class="picker-flex-0" style="min-height: 443rpx;">
            <view class="picker">
              <view class="picker-wrapper">
                <view class="picker-header">
                  <view class="header-left picker-flex-0" @tap.stop="onTogglePicker">取消</view>
                  <view class="header-middle picker-flex-1">{{attrOpts.title || ''}}</view>
                  <view class="header-right picker-flex-0" @tap.stop="confirm">确认</view>
                </view>
                <view class="picker-body">
                  <picker-view
                    :value="initValue"
                    @change="onChange"
                    @pickstart="onPickStart"
                    @pickend="onPickEnd">
                    <block v-if="attrOpts.mode === 'multi'">
                      <picker-view-column v-for="(arr,i) in renderRange" :key="i" class="column">
                        <view v-for="(item,j) in arr" :key="j" class="item">{{item}}</view>
                      </picker-view-column>
                    </block>
                    <block v-else>
                      <picker-view-column class="column">
                        <view v-for="(item,i) in renderRange" :key="i" class="item">{{item}}</view>
                      </picker-view-column>
                    </block>
                  </picker-view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </block>
    <block v-else>
      <view class="mask" v-show="showPicker">
        <view class="mask-wrapper">
          <view class="picker-flex-1" @tap.stop="onTogglePicker"></view>
          <view class="picker-flex-0" style="min-height: 443rpx;">
            <view class="picker">
              <view class="picker-wrapper">
                <view class="picker-header">
                  <view class="header-left picker-flex-0" @tap.stop="onTogglePicker">取消</view>
                  <view class="header-middle picker-flex-1">{{attrOpts.title || ''}}</view>
                  <view class="header-right picker-flex-0" @tap.stop="confirm">确认</view>
                </view>
                <view class="picker-body">
                  <picker-view
                    :value="initValue"
                    @change="onChange"
                    @pickstart="onPickStart"
                    @pickend="onPickEnd">
                    <block v-if="attrOpts.mode === 'multi'">
                      <picker-view-column v-for="(arr,i) in renderRange" :key="i" class="column">
                        <view v-for="(item,j) in arr" :key="j" class="item">{{item}}</view>
                      </picker-view-column>
                    </block>
                    <block v-else>
                      <picker-view-column class="column">
                        <view v-for="(item,i) in renderRange" :key="i" class="item">{{item}}</view>
                      </picker-view-column>
                    </block>
                  </picker-view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </block>
  </view>
</template>

<script>
export default {
  props:{
    field:{
      type: String,
      required: true,
    },
    fieldId: {
      type: String,
      required: true,
    },
    controlled:{
      type: Boolean,
      default: false,
    },
    attrOpts:{
      type: Object,
      default(){
        return {
          // 单列为single，多列为multi
          mode: 'single',
          // 值范围,如[1,2,3]或[[1],[2],[3]]
          range: [],
          // 数组元素若为对象，则将指定的key作为值，如
          // 当range为[{a:1},{a:2}]或[[{a:1},{a:2},{a:3}],[{b:1},{b:2}]]时，对应rangeKey应为['a']或['a','b']
          rangeKey: null,
          // 默认索引
          values: [0,],
          // 标题
          title: '',
          // 范围为空时点击弹出的toast提示
          emptyTip: '',
          // 取消时是否强制更新
          forceUpdateOnCancel: false,
          // 使用默认插槽后备内容
          useDefaultSlot: true,
          // 默认视图下独有配置，分别表示值的前、后缀、多列选择器下的分隔符，范围为空时的默认值，是否禁用
          prefix: '',
          suffix: '',
          separator: '/',
          emptyDefaultValue: '',
          disabled: false,
        }
      },
      validator(value){
        const {
          mode,
          range,
          values,
        } = value;
        if(void 0 !== mode && !['single','multi'].includes(mode)) return false;
        if(void 0 !== range && !(range instanceof Array)) return false;
        if(void 0 !== values && !(values instanceof Array)) return false;
        return true;
      }
    }
  },

  data(){
    return {
      // 控制选择器显隐
      showPicker: false,
      // 默认视图显示的值
      value: '',
      // 选择器初始索引
      initValue: [],
      // 选择器变化索引
      changeValue: [],
      // 是否滚动选择中
      isScrolling: false,
    }
  },

  computed:{
    renderRange(){
      const {
        range,
        rangeKey,
        mode,
      } = this.attrOpts;

      if(!range || range.length === 0) return [];

      if(mode === 'multi'){
        if(typeof range[0][0] === 'object'){
          if(!rangeKey || !(rangeKey instanceof Array)) throw new Error('rangeKey未定义');
          return range.map((item,i) => item.map(obj=> {
            if(!rangeKey[i]) throw new Error(`第${i + 1}个rangeKey未定义`);
            return obj[rangeKey[i]] || '';
          }));
        } else {
          return range;
        }
      }else{
        if(typeof range[0] === 'object'){
          if(!rangeKey || !(rangeKey instanceof Array) || !rangeKey[0]) throw new Error('rangeKey未定义');
          return range.map(item => item[rangeKey[0]] || '');
        } else {
          return range;
        }
      }
    },
  },

  watch:{
    attrOpts(newValue){
      this.init(newValue);
    }
  },

  mounted(){
    this.init(this.attrOpts);
  },

  methods:{

    init(attrOpts){
      const {
        range = [],
        values = [0,],
        emptyDefaultValue = '',
      } = attrOpts;

      this.initValue = values;
      this.changeValue = this.initValue;

      // 默认视图下，初始化值
      this._updateValue(this.initValue);
      // 若范围选择为空时使用空默认值
      if(range.length === 0){
        this.value = emptyDefaultValue;
      }
    },

    _updateValue(currentValue = []){
      const {
        mode = 'single',
        separator = '/',
      } = this.attrOpts;

      let temp = '';
      if(mode === 'multi'){
        for(let col = 0; col < this.renderRange.length; col++){
          temp +=  this.renderRange[col][currentValue[col] || 0] + separator;
        }
      }else{
        temp +=  this.renderRange[currentValue[0]] + separator;
      }
      temp = temp.slice(0, -1);

      this.value = temp;
    },

    openPicker(){
      this.onOpenPicker();
    },

    success(){
      this._updateValue(this.changeValue);
      this.showPicker = false;
    },

    fail(){
      this.showPicker = false;
    },

    onOpenPicker(){
      const {
        disabled,
        range = [],
        emptyTip = '',
      } = this.attrOpts;

      // 禁用
      if(disabled) return;

      // 空提示
      if(range.length === 0){
        if(!emptyTip) return;
        uni.showToast({
          title: emptyTip,
          icon: 'none',
        })
        return;
      }

      this.onTogglePicker();
    },

    onTogglePicker(){
      this.showPicker = !this.showPicker;
    },

    onChange(e){
      const {
        detail:{
          value
        }
      } = e;
      this.changeValue =  value;
    },

    onPickStart(){
      this.isScrolling = true;
    },

    onPickEnd(){
      this.isScrolling = false;
    },

    confirm(){

      if(this.isScrolling) return;
      this.isScrolling = false;

      // 非受控下处理
      if(!this.controlled) {
        // 更新缓存值
        this._updateValue(this.changeValue);
        this.onTogglePicker();
      }

      this.$emit('onChange',{
        type: 'picker',
        id: this.fieldId,
        value: this.changeValue,
      })
    },
  }
}
</script>

<style lang='less' scoped>
.picker-flex-1{
  flex-grow: 1;
  flex-shrink: 1;
}
.picker-flex-0{
  flex-grow: 0;
  flex-shrink: 0;
}
.container{
  display: flex;
  flex: row nowrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100rpx;
  padding: 0 30rpx;
  color: #333;
  line-height: 45rpx;
  font-size: 32rpx;
  background-color: white;
  overflow-x: hidden;
  box-sizing: border-box;

  .right{
    display: flex;
    flex: row nowrap;

    &-text{
      color: #666;
      line-height: 40rpx;
      font-size: 28rpx;
    }

    .arrow {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 16rpx;

      &::after {
        content: '';
        display: inline-block;
        width: 10rpx;
        height: 10rpx;
        border-width: 4rpx;
        border-style: solid;
        border-color: #C9D2D3 #C9D2D3 transparent transparent;
      }

      &.right::after {
        transform: rotate(45deg);
      }
    }
  }
}
.mask{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;

  .mask-wrapper{
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .picker{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 443rpx;
    background-color: white;

    .picker-wrapper{
      display: flex;
      flex-direction: column;
      height: 100%;

      .picker-header{
        flex-grow: 0;
        flex-shrink: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 88rpx;
        padding: 0 30rpx;
        border-bottom: 2rpx solid #e9e9e9;
        font-size: 32rpx;
        box-sizing: border-box;

        .header-left{
          color: #999;
        }

        .header-middle{
          padding: 0 20rpx;
          text-align: center;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #333;
          font-weight: bold;
          overflow-x: hidden;
        }

        .header-right{
          color: #006D83;
        }
      }

      .picker-body{
        flex-grow: 1;
        flex-shrink: 1;
        width: 100%;
        box-sizing: border-box;

        .column{
          height: 355rpx;

          .item{
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }

    }
  }
}
</style>
