<template>
  <view class='container'>
    <swiper
      :autoplay="autoplay"
      :current="current"
      :circular="circular"
      :display-multiple-items="displayMultipleItems"
      :interval="interval"
      :indicator-dots="indicatorDots"
      :indicator-color="indicatorColor"
      :indicator-active-color="indicatorActiveColor"
      :previous-margin="previousMargin"
      :next-margin="nextMargin"
      :easing-function="easingFunction"
      :vertical="vertical"
      :style="[containerStyle]"
      @change="onChange">
        <swiper-item v-for="(item,index) in list" :key="index">
          <slot :data="item" :isCurrent="index === currentIdx">
            <view>{{index}}</view>
          </slot>
        </swiper-item>
    </swiper>
  </view>
</template>


<script>
export default {
  props:{
    autoplay:{
      type: Boolean,
      default: false,
    },
    circular:{
      type: Boolean,
      default: false,
    },
    current:{
      type: Number,
      default: 0,
    },
    displayMultipleItems:{
      type: Number,
      default: 1,
    },
    interval:{
      type: Number,
      default: 5000,
    },
    indicatorDots:{
      type: Boolean,
      default: false,
    },
    indicatorColor:{
      type: String,
      default: 'rgba(0,0,0,.3)',
    },
    indicatorActiveColor:{
      type: String,
      default: '#000',
    },
    previousMargin:{
      type: String,
      default: '0px',
    },
    nextMargin:{
      type: String,
      default: '0px',
    },
    easingFunction:{
      type: String,
      default: 'default',
    },
    vertical:{
      type: Boolean,
      default: false,
    },
    list:{
      type: Array,
      default: [],
    },
    containerStyle:{
      type: Object,
      default(){
        return {}
      }
    },
  },
  data(){
    return {
      currentIdx: 0,
    }
  },
  watch:{
    current(value){
      this.currentIdx = value;
    }
  },
  mounted(){
    this.currentIdx = this.current;
  },
  methods:{
    onChange(e){
      const {
        detail:{
          current
        }
      } = e;
      this.currentIdx = current;
      this.$emit('onChange', current);
    }
  }
}
</script>

<style lang='less' scoped>
.container{
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
