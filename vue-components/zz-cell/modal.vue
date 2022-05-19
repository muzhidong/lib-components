<!--
 * @Author: liuxiaodong
 * @Date: 2022-02-09 14:52:11
 * @LastEditTime: 2022-03-25 10:18:08
 * @Description: 弹窗类型
-->
<template>
  <view>
    <view class="container" @tap="onToggleModal">
      <view>{{field}}</view>
      <view class="right">
        <view class="right-text">
          <block v-if="attrOpts.prefix">{{attrOpts.prefix || ''}}</block>
          {{value > -1? value: (attrOpts.value || 0) }}
          <block v-if="attrOpts.suffix">{{attrOpts.suffix || ''}}</block>
        </view>
        <view class="arrow right"></view>
      </view>
    </view>
    <alert :isShow="openModal"
      :maskClosable="attrOpts.maskClosable || false"
      :buttonConfig="attrOpts.buttonConfig || buttonConfig"
      :oneBtn="attrOpts.oneBtn ||false"
      @onCancel="onToggleModal"
      @onOk="onOk">
      <block v-if="attrOpts.useModalDefaultSlot ===  undefined? true: attrOpts.useModalDefaultSlot">
        <template v-slot:title>
          <view>{{attrOpts.modalTitle}}</view>
        </template>
        <template v-slot:content>
          <view class="modal-content">
            <view>{{attrOpts.modalContent.desc}}</view>
            <view class="input-box" >
              <input class="input" type="number" @input="onInput" :value="attrOpts.value || 0" />
              <text class="unit">{{attrOpts.modalContent.unit}}</text>
            </view>
            <view v-if="attrOpts.modalContent.tip" class="tip">
              {{attrOpts.modalContent.tip}}
              <text class="hight-light">{{attrOpts.modalContent.minLimit ? `${attrOpts.modalContent.minLimit}-`: ''}}{{attrOpts.modalContent.maxLimit}}</text>
              {{attrOpts.modalContent.unit}}
            </view>
          </view>
        </template>
      </block>
      <block v-else>
        <template v-slot:title><slot name="title" /></template>
        <template v-slot:content><slot name="content" /></template>
      </block>
    </alert>
    <view hidden>
      <slot name="title" />
      <slot name="content" />
    </view>
  </view>
</template>

<script>
import alert from '@/wxcomponents/alert';
// 缓存值
let temp;
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
    // 是否受控
    controlled: {
      type: Boolean,
      default: false,
    },
    attrOpts:{
      type: Object,
      default(){
        return {
          prefix: '',
          value: -1,
          suffix: '',
          // 以下是弹窗配置
          maskClosable: false,
          buttonConfig: null,
          oneBtn: false,
          useModalDefaultSlot: true,
          modalTitle: '标题',
          modalContent: {
            desc: '描述',
            tip: '提示',
            minLimit: -1,
            maxLimit: 1,
            unit: '单位',
          },
        }
      }
    }
  },
  components:{
    alert,
  },
  data(){
    return {
      value: -1,
      event: {},
      openModal: false,
      buttonConfig: {confirmText: '确认', cancelText: '取消'},
    }
  },
  methods:{
    closeModal(){
      if(temp){
        this.value = temp;
      }
      this.onToggleModal();
    },
    onToggleModal(){
      this.openModal = !this.openModal;
    },
    onInput(e){
      this.event = e;
    },
    onOk(){
      const {
        detail: {
          value
        } = {},
      } = this.event;

      const val = value !== undefined? value : this.attrOpts.value;
      if(!this.controlled) {
        this.value = val;
        this.onToggleModal();
      }else {
        temp = val;
      }

      this.$emit('onChange', {
        value: val,
        id: this.fieldId,
        type: 'modal',
      });
    },
  }
}
</script>

<style lang='less' scoped>
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
// 弹窗默认内容样式
.modal-content{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .input-box{
    display: flex;
    border-bottom: 4rpx solid #006d82;
    margin: 20rpx 40rpx;

    .input{
      max-width: 160rpx;
      text-align: center;
      font-size:40rpx;
    }

    .unit{
      font-size:30rpx;
      color:#FFAF27;
    }

  }

  .tip{
    color: #7F7F7F;
    font-size: 26rpx;

    .hight-light{
      color: #FFAF27;
    }
  }
}
</style>
