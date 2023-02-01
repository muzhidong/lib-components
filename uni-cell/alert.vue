<!--TODO: 重构-->
<template>
  <modal :isShow.sync="isShow">
    <view
      class="alert-box"
      :style="{ width: boxWidth ? boxWidth : '550rpx' }"
      slot="content"
    >
      <block v-if="closeBtn">
        <image
          @tap.stop="onCancel"
          class="btn-close"
          src="@/static/close_icon.png"
        ></image>
      </block>
      <view class="alert-box__title">
        <slot name="title"></slot>
      </view>
      <view class="alert-box__content">
        <slot name="content">内容</slot>
      </view>
      <view class="alert-option">
        <view class="alert-option__btn" @tap.stop="onCancel" v-if="!oneBtn">{{
          buttonConfig.cancelText
        }}</view>
        <view
          class="alert-option__btn fill"
          :style="{ width: oneBtn ? '100%' : '' }"
          @tap.stop="onOk"
          >{{ buttonConfig.confirmText }}</view
        >
      </view>
    </view>
  </modal>
</template>
<script>
import Modal from './base-modal';

export default {
  components: { modal: Modal },
  props: {
    isShow: {
      type: [Boolean],
      default: true
    },
    title: {
      type: [String, Number],
      default: ''
    },
    buttonConfig: {
      type: [Object],
      default: { confirmText: '确认', cancelText: '取消' }
    },
    oneBtn: {
      type: [String, Number, Boolean],
      default: false
    },
    boxWidth: {
      type: [String],
      default: '550rpx'
    },
    closeBtn: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onCancel() {
      this.$emit('onCancel');
    },
    onOk() {
      this.$emit('onOk');
    }
  }
};
</script>
<style lang="less" scoped>
.btn-close {
  position: absolute;
  top: 20rpx;
  right: 30rpx;
  width: 40rpx;
  height: 40rpx;
}
.alert-box {
  width: 550rpx;
  box-sizing: border-box;
  min-height: 210rpx;
  border-radius: 8rpx;
  background: #fff;
  padding: 40rpx 30rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  &__title {
    font-size: 34rpx;
    color: #0a434d;
    font-weight: bold;
    padding-bottom: 30rpx;
  }
  &__content {
    font-size: 30rpx;
    color: #0a434d;
    text-align: left;
    margin-bottom: 30rpx;
  }
  .alert-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    &__btn {
      width: 47%;
      border: 2rpx solid #006f83;
      border-radius: 8rpx;
      font-size: 30rpx;
      color: #006f83;
      padding: 5rpx 0;
    }
    &__btn.fill {
      color: #fff;
      background: #006f83;
    }
  }
}
</style>
