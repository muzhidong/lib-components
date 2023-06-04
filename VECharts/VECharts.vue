<template>
  <div id="container">
    <img :id="'image' + id" class="image" />
    <div :ref="'chart' + id" class="chart" :style="chartStyle"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'VEChart',
  props: {
    // 图表id，保证唯一
    id: {
      type: String | Number,
      required: true
    },
    // 图表配置项
    options: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // 图表数据源，即dataset.source配置项
    source: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 图表是否延迟到下一帧更新
    lazyUpdate: {
      type: Boolean,
      default: false
    },
    // 图表绘制大小与展示大小的放大倍数关系
    scale: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      chart: null,
      imgEl: null,
      containerEl: null,
      chartStyle: {}
    }
  },
  mounted() {
    this.init(this.id)
  },
  watch: {
    id(newValue) {
      this.init(newValue)
    },
    source(newValue) {
      if (!this.chart) return
      this.chart.setOption({
        dataset: {
          source: newValue
        }
      }, {
        lazyUpdate: this.lazyUpdate
      })
    }
  },
  methods: {
    init(id) {
      if (!this.imgEl) {
        this.imgEl = document.querySelector(`#image${id}`)
      }
      if (!this.containerEl) {
        this.containerEl = document.querySelector('#container')
      }

      if (this.containerEl) {
        const width = this.containerEl.offsetWidth
        const height = this.containerEl.offsetHeight
        this.chartStyle = {
          width: Math.min(width * this.scale, 9999) + 'px',
          height: Math.min(height * this.scale, 9999) + 'px'
        }
      }

      this.$nextTick(() => {
        if ([null, undefined].includes(id)) return
        this.chart = echarts.init(this.$refs[`chart${id}`])

        this.chart.setOption(this.options)
        const lineStyle = this.options?.series?.[0]?.lineStyle
        if (!lineStyle?.width) {
          this.chart.setOption({
            series: [{ lineStyle: { width: 2 * this.scale } }]
          })
        }

        const self = this
        this.chart.on('finished', function () {
          self.imgEl.src = self.chart.getDataURL()
          self.imgEl.addEventListener('load', function () {
            self.imgEl.style.display = 'inline-block'
          })
        })

        if (this.source.length === 0) return
        this.chart.setOption({
          dataset: {
            source: this.source
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.image {
  display: none;
  width: 100%;
  height: 100%;
  border: 0 none;
  object-fit: contain;
}
.chart {
  position:fixed;
  top: -9999px;
  left: -9999px;
}
</style>
