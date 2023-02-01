<!--
 * @Author: liuxiaodong
 * @Date: 2022-02-09 14:52:11
 * @LastEditTime: 2022-03-14 16:46:30
 * @Description: 单元格，目前支持开关类型、弹窗类型、时间范围选择器类型、单（多）列选择器类型4种
 * 使用示例：
  开关类型，
  <cell type="switch" field="开关字段" fieldId="aaa" :underline="true"/>
  // 受控，绑定的onChange实际触发change事件
  <cell type="switch" field="开关字段" fieldId="bbb" :underline="true" :attrOpts="{ checked: true, color: 'red'}" @onChange="onChange"/>
  // 非受控，绑定的onChange实际触发tap事件
  <cell type="switch" field="开关字段" fieldId="ccc" :underline="true" :attrOpts="{ disabled: true,}" @onChange="onChange" />
  // 使用checkbox样式
  <cell type="switch" field="开关字段" fieldId="ddd" :underline="true" :attrOpts="{ type: 'checkbox',}" />
  // 调整大小
  <cell type="switch" field="开关字段" fieldId="eee" :attrOpts="{ scale: .7,}" />
  
  弹窗类型，    
  <cell field="弹窗字段" fieldId="aaa"/>
  // 使用modal默认样式
  <cell type="modal" field="弹窗字段" fieldId="bbb" :underline="true"
    :attrOpts="{value: '168', prefix: '¥', modalTitle: '标题...', modalContent: { desc: '描述...', tip: '提示...',  minLimit: 1, maxLimit: 10, unit: '元',}}" 
    @onChange="onChange" />
  // 自定义modal标题和内容
  <cell type="modal" field="弹窗字段" fieldId="ccc" :underline="true" :attrOpts="{value: '58', suffix: '单', useModalDefaultSlot: false}" >
    <view slot='title'>这是标题</view>
    <view slot='content'>这是内容</view>
  </cell>
  // 受控modal，暴露closeModal API控制关闭弹窗
  <cell type="modal" field="弹窗字段" fieldId="ddd" :controlled="true" :underline="true"
    :attrOpts="{value: '168', prefix: '¥', modalTitle: '标题...', modalContent: {desc: '描述...', tip: '提示...',  minLimit: 1, maxLimit: 10,  unit: '元',}}" 
    @onChange="onChange" />
  
  范围选择器类型，
  // 非受控
  <cell type="range" field="时间范围选择器字段" fieldId="aaa" :underline="true" :attrOpts="{title: '服务时间', startTime: 5, endTime: 19,}" @onChange="onChange"/>
  // 受控，暴露successCloseRange和failCloseRange成功或失败两种回调API控制关闭范围弹窗
  <cell type="range" field="时间范围选择器字段" fieldId="bbb" :underline="true" :controlled="true" :attrOpts="{title: '服务时间', startTime: 5, endTime: 19,}" @onChange="onChange"/>
  
  单或多列选择器类型，
  // 单列选择器
  <cell type="picker" field="单列选择器" fieldId="aaa" 
    :attrOpts="{title: '标题', mode:'single', range:[0,1,2,3,4,5,6,7], values: [3]}" 
    @onChange="onChange"/>
  <cell type="picker" field="单列选择器-禁用" fieldId="bbb" 
    :attrOpts="{title: '标题', mode:'single', range:[0,1,2,3,4,5,6,7], disabled: true}" 
    @onChange="onChange"/>
  <cell type="picker" field="单列选择器-数组元素为对象" fieldId="ccc" 
    :attrOpts="{title: '标题', mode:'single', range:[{value:1},{value:2},{value:3}], rangeKey:['value']}" 
    @onChange="onChange"/>
  <cell type="picker" field="单列选择器-初始化" fieldId="ddd" 
    :attrOpts="{title: '标题', mode:'single', range:[], emptyTip:'这是一段空提示', prefix: '前缀', suffix: '后缀', emptyDefaultValue: '空值',}" 
    @onChange="onChange"/>
  // 多列选择器
  <cell type="picker" field="多列选择器" fieldId="eee" 
    :attrOpts="{title: '标题', mode:'multi', range:[['中国','美国','澳大利亚'],['苹果','梨','草莓'],['语文','数学','英语']]}" @onChange="onChange"/>
  // 自定义内容，暴露openPicker API打开选择器弹窗
  <cell type="picker" field="自定义内容" fieldId="fff" 
    :attrOpts="{title: '哪个孩子可爱？哪个孩子可爱？哪个孩子可爱？哪个孩子可爱？', useDefaultSlot: false, range:['笨笨','聪聪','妞妞']}" @onChange="onChange" ref="child">
    <view @tap="open">这是我的选择器，快点我</view>
  </cell>
  // 受控，暴露successClosePicker和failClosePicker成功或失败两种回调API控制关闭选择器弹窗
  <cell type="picker" field="受控" fieldId="ggg" :controlled="true" ref="child2"
      :attrOpts="{title: '标题', range:['周一','周二','周三', '周四','周五','周六','周日']}" @onChange="onChange" />

-->
<template>
  <view style="background-color:white;">
    <block v-if="type === 'switch'">
      <block v-if="attrOpts">
        <zz-switch :field="field" :fieldId="fieldId" :attrOpts="attrOpts" @onChange="onChange"></zz-switch>
      </block>
      <block v-else>
        <zz-switch :field="field" :fieldId="fieldId" @onChange="onChange"></zz-switch>
      </block>
    </block>
    <block v-else-if="type === 'range'">
      <block v-if="attrOpts">
        <zz-range :field="field" :fieldId="fieldId" :attrOpts="attrOpts" :controlled="controlled" @onChange="onChange" ref="rangeChild"></zz-range>
      </block>
      <block v-else>
        <zz-range :field="field" :fieldId="fieldId" :controlled="controlled" @onChange="onChange" ref="rangeChild"></zz-range>
      </block>
    </block>
    <block v-else-if="type === 'picker'">
      <block v-if="attrOpts">
        <zz-picker :field="field" :fieldId="fieldId" :attrOpts="attrOpts" :controlled="controlled" @onChange="onChange" ref="pickerChild">
          <template v-slot><slot /></template>
        </zz-picker>
      </block>
      <block v-else>
        <zz-picker :field="field" :fieldId="fieldId" :controlled="controlled" @onChange="onChange" ref="pickerChild">
          <template v-slot><slot /></template>
        </zz-picker>
      </block>
    </block>
    <block v-else>
      <block v-if="attrOpts">
        <zz-modal :field="field" :fieldId="fieldId" :attrOpts="attrOpts" :controlled="controlled" @onChange="onChange" ref="modalChild">
          <template v-slot:title><slot name="title" /></template>
          <template v-slot:content><slot name="content" /></template>
        </zz-modal>
      </block>
      <block v-else>
        <zz-modal :field="field" :fieldId="fieldId" :controlled="controlled" @onChange="onChange" ref="modalChild">
          <template v-slot:title><slot name="title" /></template>
          <template v-slot:content><slot name="content" /></template>
        </zz-modal>
      </block>
    </block>
    <view class="underline" v-if="underline"></view>
  </view>
</template>

<script>
import Switch from './switch';
import Modal from './modal';
import Range from './range';
import Picker from './picker';
export default {
  props:{
    type: {
      type: String,
      default: 'modal',
      validator(value){
        return ['modal','switch','range', 'picker'].includes(value);
      }
    },
    field: {
      type: String,
      required: true,
    },
    fieldId: {
      type: String,
      required: true,
    },
    controlled: {
      type: Boolean,
      default: false,
    },
    attrOpts: {
      type: Object,
    },
    underline: {
      type: Boolean,
      default: false,
    },
  },
  components:{
    'zz-switch': Switch,
    'zz-modal': Modal,
    'zz-range': Range,
    'zz-picker': Picker,
  },
  methods:{
    onChange(data){
      // console.log('data',data);
      this.$emit('onChange', data);
    },
    // 弹窗类型
    closeModal(){
      this.$refs.modalChild.closeModal();
    },
    // 范围选择器类型
    successCloseRange(){
      this.$refs.rangeChild.success();
    },
    failCloseRange(){
      this.$refs.rangeChild.fail();
    },
    // 选择器类型
    openPicker(){
      this.$refs.pickerChild.openPicker();
    },
    successClosePicker(){
      this.$refs.pickerChild.success();
    },
    failClosePicker(){
      this.$refs.pickerChild.fail();
    },
  }
}
</script>

<style lang='less' scoped>
.underline{
  width: 100%;
  height: 2rpx;
  background-color: #E8EDEE;
  transform: translateX(30rpx);
  overflow: hidden;
}
</style>