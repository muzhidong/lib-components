<!--
 * @Author: liuxiaodong
 * @Date: 2022-02-09 14:52:11
 * @LastEditTime: 2022-04-06 10:16:22
 * @Description: 时间范围选择器类型
-->
<template>
  <view>
    <view class="container" @tap="onTogglePicker">
      <view>{{field}}</view>
      <view class="right">
        <view class="right-text">{{(controlled? tempStartTime: startTime)|format}}-{{(controlled? tempEndTime: endTime)|format}}</view>
        <view class="arrow right"></view>
      </view>
    </view>
    <view class="mask" v-show="showPicker">
      <view class="mask-wrapper">
        <view class="flex-1" @tap.stop="onTogglePicker"></view>
        <view class="flex-0" style="min-height: 443rpx;">
          <view class="picker">
            <view class="picker-wrapper">
              <view class="picker-header">
                <view class="header-left" @tap.stop="onTogglePicker">取消</view>
                <view class="header-middle">{{attrOpts.title}}</view>
                <view class="header-right" @tap.stop="confirm">确认</view>
              </view>
              <view class="picker-body">
                <view class="axis">
                  <view v-for="(s, i) in seg" :key="i" class="point" :style="{left: (i + 1) / 24 * 100 + '%'}"></view>
                  <view class="drag" :style="{left: `${startTime / 24 * 100 + '%'}`}" @touchstart="onBeginTimeStart" @touchmove="onBeginTimeMove" @touchend="onBeginTimeEnd">
                    <view>{{startTime|format}}</view>
                    <image src="@/static/drag.png" mode="aspectFit" class="icon-drag"/>
                    <image src="@/static/point.png" mode="aspectFit" class="icon-point"/>
                  </view>
                  <view class="drag" :style="{left:`${endTime / 24 * 100 + '%'}`}" @touchstart="onEndTimeStart" @touchmove="onEndTimeMove" @touchend="onEndTimeEnd">
                    <view>{{endTime|format}}</view>
                    <image src="@/static/drag.png" mode="aspectFit" class="icon-drag"/>
                    <image src="@/static/point.png" mode="aspectFit" class="icon-point"/>
                  </view>
                  <view class="range" :style="{left: `${startTime  / 24 * 100 + '%'}`, width: `${(endTime - startTime) / 24 * 100 + '%'}`}"></view>
                </view>
                <view class="number">
                  <view>00:00</view>
                  <view>24:00</view>
                </view>
              </view>
             </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const throttle = function(fn, delay = 50) {
  let timer;
  return function(...rest) {
    if (!timer) {
      timer = setTimeout(function() {
        fn.call(this, ...rest);
        timer = null;
      }, delay);
    }
  }
}

export default {
  props:{
    field:{
      type: String,
      required: true,
    },
    fieldId:{
      type: String,
      required: true,
    },
    controlled: {
      type: Boolean,
      default: false,
    },
    attrOpts:{
      type: Object,
      default(){
        return {
          title: '标题',
          startTime: 7,
          endTime: 18,
        }
      }
    }
  },
  data(){
    return {
      showPicker: false,
      startTime: 0,
      endTime: 24,
      seg: new Array(23),
      axisWidth: 0,
      axisLeft: 0,
      beginTimeMoveFlag: false,
      endTimeMoveFlag: false,
      // 缓存值
      tempStartTime: 0,
      tempEndTime: 24,
    }
  },
  filters:{
    format(value){
      if(new RegExp("\\d{1,2}:00","g").test(value)) return value;
      return (value + '').length === 1? `0${value}:00`: `${value}:00`;
    }
  },
  watch:{
    attrOpts:function(newValue){
      this.init(newValue);
    }
  },
  mounted(){
    this.init(this.attrOpts);
  },
  methods:{
    init(attrOpts){
      const {
        startTime,
        endTime
      } = attrOpts;
      this.startTime = startTime;
      this.endTime = endTime;
      this.tempStartTime = startTime;
      this.tempEndTime = endTime;
    },
    success(){
      this.showPicker = false;
      this.tempStartTime = this.startTime;
      this.tempEndTime = this.endTime;
    },
    fail(){
      this.showPicker = false;
    },
    onTogglePicker(){
      this.showPicker = !this.showPicker;
      if(this.showPicker && this.axisWidth === 0 && this.axisLeft === 0){
        setTimeout(()=>{
          uni.createSelectorQuery().in(this).select('.axis').boundingClientRect((res)=>{
            // console.log(res);
            this.axisWidth = res.width;
            this.axisLeft = res.left;
          }).exec();
        })
      }
    },
    confirm(){
      this.onTogglePicker();
      this.$emit('onChange',{
        type: 'range',
        id: this.fieldId,
        startTime: this.startTime,
        endTime: this.endTime,
      })
    },
    onBeginTimeStart(e){
      // 记录开始时间准备移动
      // console.log(e);
      this.beginTimeMoveFlag = true;
    },
    onBeginTimeMove: throttle(function(e){
      // 结束时间移动标志位为false才继续
      if(this.endTimeMoveFlag) {
        this.beginTimeMoveFlag = false;
        return;
      }
      const {
        touches: [
          {pageX},
        ]
      } = e;
      const maxThreshold = (this.endTime - 1) / 24 * this.axisWidth;
      // 获取x轴方向相对于父元素的位置，确定落在位置（超过结束时间上一个时间点，直接取结束上一个时间点）
      const offsetLeft = pageX - this.axisLeft;
      // console.log(pageX,offsetLeft,maxThreshold);
      if(offsetLeft >= maxThreshold) {
        this.startTime = this.endTime - 1;
      }else if(offsetLeft <= 0){
        this.startTime = 0;
      }else{
        this.startTime = Math.ceil(offsetLeft / (this.axisWidth / 24));
      }
    }, 100),
    onBeginTimeEnd(e){
      // 记录开始时间停止移动
      // console.log(e);
      this.beginTimeMoveFlag = false;
    },
    onEndTimeStart(e){
      // 记录结束时间准备移动
      // console.log(e);
      this.endTimeMoveFlag = true;
    },
    onEndTimeMove: throttle(function(e){
      // 开始时间移动标志位为false才继续
      if(this.beginTimeMoveFlag) {
        this.endTimeMoveFlag = false;
        return;
      }
      const {
        touches: [
          {pageX},
        ]
      } = e;
      const minThreshold = (this.startTime + 1) / 24 * this.axisWidth;
      // 获取x轴方向相对于父元素的位置，确定落在位置（小于开始时间下一个时间点，直接取开始下一个时间点）
      const offsetLeft = pageX - this.axisLeft;
      // console.log(pageX,offsetLeft,minThreshold);
      if(offsetLeft <= minThreshold) {
        this.endTime = this.startTime + 1;
      }else if(offsetLeft >= this.axisWidth){
        this.endTime = 24;
      }else{
        this.endTime = Math.ceil(offsetLeft / (this.axisWidth / 24));
      }
    }, 100),
    onEndTimeEnd(e){
      // 记录结束时间停止移动
      // console.log(e);
      this.endTimeMoveFlag = false;
    },
  },
}
</script>

<style lang='less' scoped>
.flex-1{
  flex-grow: 1;
  flex-shrink: 1;
}
.flex-0{
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
          color: #333;
          font-weight: bold;
        }

        .header-right{
          color: #006D83;
        }
      }

      .picker-body{
        flex-grow: 1;
        flex-shrink: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 70rpx 40rpx 0;
        box-sizing: border-box;

        .axis{
          width: 100%;
          height: 4rpx;
          box-sizing: border-box;
          background: #E4E4E4;
          position: relative;

          &::before{
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            transform: translate(-50%, -50%);
            width: 12rpx;
            height: 12rpx;
            border: 3rpx solid #E4E4E4;
            background-color: white;
            border-radius: 50%;
          }

          &::after{
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            transform: translate(50%, -50%);
            width: 12rpx;
            height: 12rpx;
            border: 3rpx solid #E4E4E4;
            background-color: white;
            border-radius: 50%;
          }

          .point{
            position: absolute;
            top: -8rpx;
            width: 4rpx;
            height: 8rpx;
            background-color: #E4E4E4;
          }

          .drag{
            position: absolute;
            top: 0;
            transform: translate(-50%, -87%);
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #333;
            line-height: 45rpx;
            font-size: 32rpx;
            z-index: 99;

            .icon-drag{
              width: 35rpx;
              height: 35rpx;
            }

            .icon-point{
              width: 26rpx;
              height: 26rpx;
              margin-top: 16rpx;
            }
          }

          .range{
            position: absolute;
            height: 8rpx;
            background-color: #00A0B5;
            border-radius: 4rpx;
          }
        }

        .number{
          display: flex;
          justify-content: space-between;
          width: 100%;
          padding-top: 20rpx;
          color:#999;
          line-height: 33rpx;
          font-size: 24rpx;
        }

      }
    }
  }
}
</style>
