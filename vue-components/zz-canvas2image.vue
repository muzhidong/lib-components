<template>
  <canvas :canvas-id="canvasId" 
    :id="canvasId"
    :style="{
      width: width + 'px',
      height: height + 'px',
    }" 
    class="canvas"
    @error="onCanvasError"></canvas>
</template>

<script>
const CACHE_NAME = 'canvas2image';
const IMAGE_TYPE = {
  NORMAL: 'normal',
  COMPOSE: 'compose',
}
export default {
  props:{
    // 自定义画布ID
    canvasId:{
      type: String,
      default: ''
    },
    // 绘制内容
    content:{
      type: Array,
      // 目前暂只支持绘制图片类型，后续根据需求做扩展。数组元素格式如下，
      // {
      //   type: 'image',
      //   top: 0,
      //   left: 0,
      //   src: '图片网络或本地路径',
      //   isBackground: true,
      // }
      default:[],
    },
    // 外部调用合成方法时loading配置
    loading:{
      type: Object,
      default(){
        return {
          show: true,
          title: '保存中...',
        }
      }
    },
    // 生成的图片类型，只支持jpg和png
    imageType: {
      type: String,
      default: 'png'
    }
  },
  watch:{
    content(newValue){
      this.canvasContent = [];
      const arr = newValue.filter(item => item.type === 'image' && !!item.src);
      for(let index in arr){
        const item = arr[index];
        this.handleImage(item.src, (res)=>{
          if(item.isBackground){
            this.width = res.width;
            this.height = res.height;
          }
          this.canvasContent[index] =  {
            ...res,
            ...item,
          };
        })
      }
    },
  },
  data(){
    return {
      width: 300,
      height: 225,
      canvasEle: {},
      canvasContext: {},
      canvasContent: [],
    }
  },
  mounted(){
    this.getCanvasContext();
    wx.setStorageSync(CACHE_NAME, []);
  },
  methods:{
    onCanvasError(e){
      console.log('canvas Error:', e.errMsg);
    },

    addImageCache(key, value, type = IMAGE_TYPE.NORMAL){
      const cache = wx.getStorageSync(CACHE_NAME)
      cache.push({
        key: type === IMAGE_TYPE.NORMAL? encodeURIComponent(key.substr(-20)): key,
        value,
        type,
      })
      wx.setStorageSync(CACHE_NAME, cache);
    },

    getImageCache(key, type = IMAGE_TYPE.NORMAL){
      const cache = wx.getStorageSync(CACHE_NAME)
      const arr = cache.filter(item => item.type === type);
      if(type === IMAGE_TYPE.NORMAL){
        return arr.find(item => item.key === encodeURIComponent(key.substr(-20)))
      }else if(type === IMAGE_TYPE.COMPOSE){
        return arr.find(item => item.key === key)
      }
    },

    handleImage(src, successCb){
      const cache = this.getImageCache(src);
      if(cache){
        successCb && successCb(cache.value);
        return;
      }

      this.cacheImage(src, successCb)
    },

    cacheImage(src, successCb, retry = true){
      wx.getImageInfo({
        src,
      }).then((res)=>{
        this.addImageCache(src, res);
        successCb && successCb(res);
      }).catch((err)=>{
        console.log('fail', err.errMsg)
        // 失败重试一次
        if(retry){
          this.cacheImage(src, successCb, false)
        }
      })
    },

    getCanvasContext(){
      if(this.createSelectorQuery){
        this.createSelectorQuery()
        .select(`#${this.canvasId}`)
        .fields({
          context: true,
          node: true,
        })
        .exec((res)=>{
          this.canvasEle = res[0].node;
          this.canvasContext = res[0].context;
        });
        return;
      }
      wx.showToast({
        title: '当前微信版本不支持该功能，请升级微信',
        icon: 'none', 
      }) 
    },

    composePicture(options = {}){
      const {
        composePicId,
        success,
        fail,
      } = options;
      return new Promise((resolve, reject)=>{
        if(!this.canvasContext) {
          const err = new Error('画布上下文不存在！');
          fail && fail(err);
          return reject(err);
        }

        const cache = this.getImageCache(composePicId, IMAGE_TYPE.COMPOSE);
        if(cache){
          success && success(cache.value);
          return resolve(cache.value);
        }

        this.loading.show && wx.showLoading({
          title: this.loading.title,
          mask: true,
        });
        for(let item of this.canvasContent){
          if(item.type === 'image'){
            this.drawImage(item);
          }
        }

        this.canvasContext.draw(false, () => {
          setTimeout(() => {
            wx.canvasToTempFilePath({
              width: this.width,
              height: this.height,
              x: 0,
              y: 0,
              fileType: this.imageType,
              canvasId: this.canvasId,
              success: (res) => {
                this.loading.show && wx.hideLoading({
                  noConflict: true,
                });
                this.addImageCache(composePicId, res.tempFilePath, IMAGE_TYPE.COMPOSE);
                success && success(res.tempFilePath);
                resolve(res.tempFilePath);
              },
              fail: (err) => {
                this.loading.show && wx.hideLoading({
                  noConflict: true,
                });
                fail && fail(err);
                reject(err);
              },
            }, this)
          }, 500)
        })
      })
    },

    drawImage(item){
      let {
        path: imageRes,
        sx = 0,
        sy = 0,
        left:dx = 0,
        top:dy = 0,
        width: sWidth,
        height: sHeight,
        dWidth,
        dHeight,
      } = item;
      if(!dWidth) dWidth = sWidth;
      if(!dHeight) dHeight = sHeight;
      this.canvasContext.save();
      this.canvasContext.drawImage(imageRes, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
      this.canvasContext.restore();
    },
  }
}
</script>

<style type="less" scoped>
.canvas{
  position: absolute;
  top: -9999rpx;
  left: -9999rpx;
}
</style>
