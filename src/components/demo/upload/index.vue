<template>
  <div>
    <div class="container">
      <h2>ImgCutter裁剪</h2>
      <ImgCutter/>
      <!-- 999999999999 -->
      <div class="content-title">支持裁剪</div>
      <div class="plugins-tips">
        vue-cropperjs：一个封装了 cropperjs 的 Vue 组件。
        访问地址：<a href="https://github.com/Agontuk/vue-cropperjs" target="_blank">vue-cropperjs</a>
      </div>
      <div class="crop-demo">
        <img :src="cropImg" class="pre-img">
        <div class="crop-demo-btn">选择图片
          <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage" />
        </div>
      </div>

      <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
        <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" :canScale="option.canScale" :autoCrop="option.autoCrop" :fixedNumber="option.fixedNumber" :centerBox="option.centerBox" style="width:100%;height:300px;">
        </vue-cropper>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelCrop">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- <el-button @click="exports">下载/xls/pdf/png</el-button>  -->
    <uploadCom tipTitle="比例=16：9" :aspectRatio='16 / 9' :minWidth="800" :minHeight="450" :originalUrl='cover1' :cropperUrl='coverCropper1' :policyData='policyData' accept=".jpg,.jpeg,.png,.webp,.bmp,.gif,.RGB" type="coverImg1" @getUrl='getUrl' />
    <uploadCom tipTitle="比例=4：3" :aspectRatio='4 / 3' :minWidth="800" :minHeight="600" :originalUrl='cover2' :cropperUrl='coverCropper2' :policyData='policyData' accept=".jpg,.jpeg,.png,.webp,.bmp,.gif,.RGB" type="coverImg2" @getUrl='getUrl' />
    <uploadCom tipTitle="比例=1：1" :isCropper='false' :aspectRatio='1 / 1' :minWidth="600" :minHeight="600" :originalUrl='cover3' :cropperUrl='coverCropper3' :policyData='policyData' accept=".jpg,.jpeg,.png,.webp,.bmp,.gif,.RGB" type="coverImg3" @getUrl='getUrl' />

  </div>
</template>

<script>
import axios from 'axios'
import VueCropper from 'vue-cropperjs'
import uploadCom from './uploadCom.vue'
import ImgCutter from './imgCutter.vue'
export default {
  name: 'upload',
  data () {
    return {
      defaultSrc: require('../../../assets/images/img.jpg'),
      fileList: [],
      imgSrc: '',
      cropImg: '',
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,

      cover1: '',
      coverCropper1: '',
      cover2: '',
      coverCropper2: '',
      cover3: '',
      coverCropper3: '',
      policyData: {},

      option: {
        img: '', // 裁剪图片的地址
        outputSize: 1, // 裁剪生成图片的质量(可选0.1 - 1)
        outputType: 'jpeg', // 裁剪生成图片的格式（jpeg || png || webp）
        info: true, // 图片大小信息
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        // autoCropWidth: 230, // 默认生成截图框宽度
        // autoCropHeight: 150, // 默认生成截图框高度
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [16, 9], // 截图框的宽高比例
        full: false, // false按原比例裁切图片，不失真
        fixedBox: true, // 固定截图框大小，不允许改变
        canMove: false, // 上传图片是否可以移动
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        height: true, // 是否按照设备的dpr 输出等比例图片
        infoTrue: false, // true为展示真实输出图片宽高，false展示看到的截图框宽高
        maxImgSize: 3000, // 限制图片最大宽度和高度
        enlarge: 1, // 图片根据截图框输出比例倍数
        mode: '230px 150px' // 图片默认渲染方式
      }
    }
  },
  components: {
    VueCropper,
    uploadCom,
    ImgCutter
  },
  created () {
    this.cropImg = this.defaultSrc
    this.GenPostPolicy()
  },
  methods: {
    // 获取阿里云直传的配置参数
    GenPostPolicy () {
      axios.post('http://192.168.1.97:5008/Basic/Support/GenPostPolicy', {
        data: {
          module: 'CUMS',
          upfilePath: 'OA'
        },
        sign: 'B99DD86F2011A98622A37F472570B5C4',
        sysName: 'Front_CUMS',
        ts: '1647934436000',
        version: '1.0.0'
      }).then(res => {
        this.policyData = res.data.data
      })
    },
    getUrl (data) {
      if (data.type === 'coverImg1') {
        this.cover1 = data.originalUrl
        this.coverCropper1 = data.cropperUrl
      }
      if (data.type === 'coverImg2') {
        this.cover2 = data.originalUrl
        this.coverCropper2 = data.cropperUrl
      }
      if (data.type === 'coverImg3') {
        this.cover3 = data.originalUrl
        this.coverCropper3 = data.cropperUrl
      }
    },
    setImage (e) {
      const file = e.target.files[0]
      if (!file.type.includes('image/')) {
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        this.dialogVisible = true
        this.imgSrc = event.target.result
        this.$refs.cropper && this.$refs.cropper.replace(event.target.result)
      }
      reader.readAsDataURL(file)
    },
    cropImage () {
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL()
    },
    cancelCrop () {
      this.dialogVisible = false
      this.cropImg = this.defaultSrc
    },
    imageuploaded (res) {
      console.log(res)
    },
    handleError () {
      this.$notify.error({
        title: '上传失败',
        message: '图片上传接口上传失败，可更改为自己的服务器接口'
      })
    },
    handleChange (file) {
      sessionStorage.setItem('file', JSON.stringify(file))
      this.$router.push('/magnifying')
    },
    handleRemove (file) {
      console.log(file)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    handleDownload (file) {
      console.log(file)
    },

    // 确定
    confirm () {
      this.dialogVisible = false
      console.log(this.imgSrc, 'imgSrc')
    },

    // 下载文件
    async exports () {
      const data = {
        cityId: this.formInline.cityId,
        countyId: this.formInline.countyId,
        currPage: this.page.pageCurr,
        pageSize: this.page.pageSize,
        iscId: this.loginInfo.iscId
      }
      this.downloadModule(data, 'quality/exportStageProgressCompare')
    },
    async downloadModule (data, url) {
      axios({
        url: `${window.SERVER_URL}${url}`,
        method: 'post',
        responseType: 'blob',
        data: data
      }).then(function (res) {
        const blob = new Blob([res.data], {
          type: 'application/json;charset=UTF-8'
        })
        const downloadElement = document.createElement('a')
        const href = window.URL.createObjectURL(blob) // 创建下载的链接
        downloadElement.href = href
        downloadElement.download = '分期数据治理对比统计.xls' // 下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() // 点击下载
        document.body.removeChild(downloadElement) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      })
    }

  }

}
</script>

<style scoped>
.content-title {
  font-weight: 400;
  line-height: 50px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}
.pre-img {
  width: 100px;
  height: 100px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 5px;
}
.crop-demo {
  display: flex;
  align-items: flex-end;
}
.crop-demo-btn {
  position: relative;
  width: 100px;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  margin-left: 30px;
  background-color: #409eff;
  color: #fff;
  font-size: 14px;
  border-radius: 4px;
  box-sizing: border-box;
}
.crop-input {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
</style>
