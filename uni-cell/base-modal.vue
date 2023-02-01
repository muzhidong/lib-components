<!--TODO: 重构-->
<template>
  <view class="modal-container" v-if="isShow" catchtouchmove="preventTouchMove">
    <view class="modal-container__mask" @tap.stop="closeModal"></view>
    <slot name="content">内容</slot>
  </view>
</template>

<script>
export default {
  props: {
    maskClosable: {
      type: [Boolean],
      default: false
    },
    isShow: {
      type: [Boolean],
      default: false,
      twoWay: true
    }
  },

  methods: {
    closeModal() {
      if (this.maskClosable) {
        this.isShow = false;
      }
    },
    preventTouchMove() {}
  }
};
</script>

<style lang="less" scoped>
.modal-container {
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  &__mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: -1;
  }
}
</style>
