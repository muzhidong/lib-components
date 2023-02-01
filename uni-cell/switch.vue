<!--
 * @Author: liuxiaodong
 * @Date: 2022-02-09 14:52:11
 * @LastEditTime: 2022-02-28 14:59:50
 * @Description: 开关类型
-->
<template>
  <view class="container">
    <view>{{field}}</view>
    <switch :checked="attrOpts.checked || false"
      :disabled="attrOpts.disabled || false"
      :type="attrOpts.type || 'switch'"
      :color="attrOpts.color || '#00A0B5'"
      @change="onChange"
      @tap="onTap"
      :style="{transform: `scale(${attrOpts.scale || .8})`}"
    />
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
    attrOpts:{
      type: Object,
      default(){
        return {
          checked: false,
          disabled: false,
          type: 'switch',
          color: '#00A0B5',
          scale: .8,
        }
      },
      validator(value){
        const {
          type,
        } = value;
        if(void 0 !== type && !['switch','checkbox'].includes(type)) return false;
        return true;
      }
    }
  },
  methods:{
    onChange(e){
      // 受控处理
      this.$emit('onChange', {
        value: e.detail.value,
        id: this.fieldId,
        type: 'switch',
        event: 'change',
      });
    },
    onTap(){
      // 非受控处理
      if(!this.attrOpts.disabled) return;
      this.$emit('onChange', {
        id: this.fieldId,
        type: 'switch',
        event: 'tap',
      });
    }
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
}
</style>