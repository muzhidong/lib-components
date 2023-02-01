<template>
  <view class="container">
    <image
      v-if="showGradient"
      :src="iconShadow"
      mode="aspectFit"
      class="icon-shadow"
    />
    <scroll-view
      :scroll-x="true"
      :scroll-y="false"
      :enable-flex="true"
      :show-scrollbar="false"
      :scroll-left="scrollLeft"
      :scroll-with-animation="true"
      :class="['wrapper', 'flex-start-center', { auto: showGradient }]"
    >
      <view
        v-for="(item, index) in renderItems"
        :key="item.sId"
        :class="[
          'item',
          { active: currentIdx === index, line2: language !== 'CN' }
        ]"
        @tap="onTab(item, index)"
        >{{ item.name }}</view
      >
    </scroll-view>
  </view>
</template>

<script>
let systemInfo;
let widthArr;
let maxOffset;
export default {
  props: {
    items: {
      type: Array,
      // 格式一：['标题一','标题二']
      // 格式二：[{ id: 1, name: '标题一'},{ id: 2, name: '标题二'}]
      default: []
    },
    selectedIdx: {
      type: Number,
      default: 0
    },
    language: {
      type: String,
      default: 'CN'
    }
  },
  data() {
    return {
      currentIdx: 0,
      // TODO:图片路径
      iconShadow: '',
      showGradient: false,
      scrollLeft: 0
    };
  },
  computed: {
    renderItems() {
      return this.items.map((item) => {
        const sId = `sel${`${Math.random()}`.replace('0.', '').slice(0, 7)}`;
        if (typeof item === 'object') {
          return {
            ...item,
            sId
          };
        }
        return {
          name: item,
          sId
        };
      });
    }
  },
  watch: {
    items() {
      this.checkOverflow();
    },
    selectedIdx(val) {
      this.scrollToSelectedTab(val);
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      // 获取系统信息
      systemInfo = uni.getSystemInfoSync();
      // 检查是否溢出
      this.checkOverflow();
    },
    // 检查是否溢出
    checkOverflow() {
      this.$nextTick(() => {
        this.createSelectorQuery()
          .select('.wrapper')
          .fields({
            size: true
          })
          .exec((res) => {
            // 计算内容宽度是否大于可见宽度
            this.showGradient = res[0].width >= systemInfo.windowWidth;
            // 最大偏移量
            maxOffset = res[0].width - systemInfo.windowWidth;
          });
        this.createSelectorQuery()
          .selectAll('.item')
          .fields({
            size: true
          })
          .exec((res) => {
            if (res[0].length === 0) return;
            // 获取各项目宽度
            widthArr = res[0].map((item) => item.width);
            // 滚动到选中Tab
            this.scrollToSelectedTab(this.selectedIdx);
          });
      });
    },
    // 切换Tab
    onTab(item, index) {
      if (this.currentIdx === index) return;
      this.scrollToSelectedTab(index);
      this.$emit('onTab', item);
    },
    // 滚动到选中的Tab
    scrollToSelectedTab(idx) {
      this.currentIdx = idx;

      if (!this.showGradient || !widthArr) return;

      if (idx === 0) {
        this.scrollLeft = 0;
      } else {
        // 偏移量
        const offset = widthArr.slice(0, idx).reduce((total, item, index) => {
          return total + +item * (idx === index ? 1.14 : 1) + 25;
        }, 0);
        // 居中显示要减少的偏移量
        const rest =
          (systemInfo.windowWidth - 30 - (widthArr[idx] * 1.14 + 25)) / 2;
        this.scrollLeft = Math.min(
          Math.max(offset - rest, 0),
          maxOffset + widthArr[widthArr.length - 1] * 0.14
        );
      }
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 130rpx;
  background: #00a0b5;
  overflow: hidden;
  position: relative;

  .icon-shadow {
    position: absolute;
    top: 50%;
    right: 30rpx;
    transform: translateY(-50%);
    width: 22rpx;
    height: 72rpx;
    z-index: 10;
  }

  .wrapper {
    width: fit-content;
    height: 100%;
    padding: 29rpx 30rpx 0;
    box-sizing: border-box;
    overflow-anchor: visible;
    &.auto {
      width: auto;
    }

    .item {
      margin-right: 50rpx;
      color: #fff;
      white-space: nowrap;
      opacity: 0.7;
      font-size: 28rpx;
      box-sizing: border-box;
      position: relative;

      &:not(:last-child) {
        margin-right: 50rpx;
      }

      &.active {
        opacity: 1;
        font-size: 32rpx;
        font-weight: bold;
        &::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: -10rpx;
          transform: translateX(-50%);
          width: 65rpx;
          height: 7rpx;
          background-image: linear-gradient(180deg, #f9fcfd 0%, #ecf0f9 100%);
          border-radius: 6rpx;
        }
      }

      &.line2 {
        min-width: 260rpx;
        text-align: center;
        line-height: 1;
        white-space: normal;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        &.active {
          min-width: 320rpx;
        }
      }
    }
  }
}
</style>
