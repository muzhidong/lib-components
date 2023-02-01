<!--
 * @Author:liuxiaodong
 * @Date: 2021-09-13 09:55:43
 * @LastEditTime: 2021-10-08 10:57:17
 * @Description:  面板组件，支持头部、内容插槽
 * @param {slot} 提供header插槽
 * @param {slot} 提供body插槽
-->
<template>
  <view class="zz-panel" :class="rootClass">
    <slot name="header"></slot>
    <view class="line"></view>
    <slot name="body"></slot>
  </view>
</template>

<script>
export default {
  props: {
    // 扩展根元素类样式
    rootClass: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="less" scoped>
.zz-panel {
  width: 100%;
  padding: 0 30rpx;
  background-color: white;
  box-sizing: border-box;

  .line {
    width: 100%;
    height: 2rpx;
    margin: 29rpx 0 32rpx;
    transform: scaleY(0.5);
    background-color: rgba(10, 67, 77, 0.1);
  }
}
</style>
