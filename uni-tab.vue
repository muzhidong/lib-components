<template>
  <view class='container'>
    <!-- 正常模式，所有Tab居中显示 -->
    <view v-if="mode === MODE.NORMAL" class="normal flex-center-center">
      <view class="wrapper flex-start-center">
        <view v-for="(item, index) in renderItems" 
          :key="item.id" 
          :class="['item', {'active': currentIdx === index}]"
          @tap="onTab(item,index)"
        >{{item.name}}</view>
      </view>
    </view>
    <!-- 滚动模式, 所有Tab水平排列，支持滑动、定位 -->
    <scroll-view v-else 
      :scroll-x="true"
      :scroll-y="false"
      :enable-flex="true" 
      :scroll-into-view="currentId"
      :show-scrollbar="false"
      :enhanced="true"
      class="scroll flex-start-center">
      <view v-for="(item, index) in renderItems" 
        :key="item.id"
        :id="item.sId"
        :class="['item', {'active': currentIdx === index}]"
        @tap="onTab(item,index)"
      >{{item.name}}</view>
    </scroll-view>
  </view>
</template>

<script>
const MODE = {
  NORMAL: 1,
  SCROLL: 2,
}
export default {
  props:{
    items:{
      type: Array,
      // 格式一：['标题一','标题二']
      // 格式二：[{ id: 1, name: '标题一'},{ id: 2, name: '标题二'}]
      default:[],
    },
  },
  data(){
    return {
      MODE,
      mode: MODE.NORMAL,
      currentIdx: 0,
      currentId: '',
    }
  },
  computed:{
    renderItems(){
      return this.items.map(item => {
        const sId =  `sel${`${Math.random()}`.replace('0.','').slice(0, 7)}`;
        if(typeof item === 'object'){
          if(item.id){
            return {
              ...item,
              sId,
            }
          }
          return {
            ...item,
            id: sId,
            sId,
          }
        }
        return {
          name: item,
          id: sId,
          sId,
        }
      })
    }
  },
  watch:{
    items(){
      this.setMode();
    }
  },
  mounted(){
    this.setMode();
  },
  methods:{
    setMode(){
      setTimeout(()=>{
        // 内部控制采用合适的模式
        if(this.createSelectorQuery){
          const {
            windowWidth,
          } = wx.getSystemInfoSync();
          this.createSelectorQuery()
            .select(`.normal .wrapper`)
            .boundingClientRect()
            .exec((res)=>{
              // console.log(res);
              const {
                width
              } = res[0]
              if(width > windowWidth * 0.95){
                this.mode = MODE.SCROLL;
              }
            });
        }
      })
    },
    onTab(item, index){
      if(this.currentIdx === index) return;
      this.currentIdx = index;
      this.currentId = item.sId;
      this.$emit('onTab', item);
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  width: 100%;
  height: 100rpx;
  background: #fff;

  .normal {
    height: 100%;

    .wrapper {
      height: 100%;
    }
  }

  .item {
    height: 100%;
    color: #666;
    line-height: 100rpx;
    font-size: 28rpx;
    white-space: nowrap;
    box-sizing: border-box;

    &:not(:last-child) {
      margin-right: 50rpx;
    }

    &.active {
      border-bottom: 4rpx solid #006F83;
      color: #006F83;
      font-weight: bold;
    }
  }

  .scroll {
    padding-left: 30rpx;
    white-space: nowrap;
    box-sizing: border-box;
    .item {
      display: inline-block;
      margin-right: 50rpx;
    }
  }
}
</style>
