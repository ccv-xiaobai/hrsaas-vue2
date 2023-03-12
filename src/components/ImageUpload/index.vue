<template>
  <div>
    <!-- 放置一个上传组件 -->
    <!-- 给action 一个#号 就不会报错了 -->
    <!-- file-List是上传的文件列表 可以绑定到上传组件上能让上传组件来显示 -->
    <!-- upload组件显示的是 file-list -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :file-list="fileList"
      :class="{disabled: fileComputed }"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" style="width: 180px" :percentage="percent" />
    <!-- 放置一个弹层 -->
    <!-- sync修饰符自动将弹层关闭了 -->
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgUrl" alt="" width="100%">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云sdk
// 实例化COS对象
const cos = new COS({
  SecretId: 'AKIDHNJyZv2tiW5QUH3IK7ew0ziAPTItQgss', // 身份识别 ID
  SecretKey: 'oKgoeDfwykGXZKp44qNfiV3MRWVKvHQL' // 身份密钥
}) // 实例化的包 已经具有了上传的能力 可以上传到该账号里面的存储桶了
export default {
  data() {
    return {
      fileList: [],
      showDialog: false, // 控制图片的显示或者隐藏
      imgUrl: '', // 存储点击的图片地址
      currentFileUid: null, // 记录当前正在上传的uid
      showPercent: false,
      percent: 0 // 记录当前的百分比
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed() {
      // 如果它为true 表示就不显示 +号上传了
      return this.fileList.length === 1
    }
  },
  methods: {
    // 点击预览事件
    preview(file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      // console.log(file.url)
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove(file) {
      // console.log(file) file是要删除的文件
      // console.log(fileList) fileList是删过之后的文件
      this.fileList = this.fileList.filter(item => item.uid !== file.uid) // 将当前的删除文件排除在外
    },

    // 不能用push，因为这个钩子会执行很多次
    changeFile(file, fileList) {
    // file是当前文件 fileList是当前的最新数组
      // console.log(fileList)
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
      // 要开始做文件上传的检查了
      // console.log( file ) 文件类型=> file.type   文件大小=> file.size
      // 先检查文件的类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) { // if( !types.some( item => item === file.type ) )
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false // 上传终止
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      // 已经确定当前上传的就是当前的file了
      // console.log(file)
      this.currentFileUid = file.uid // 记住当前的uid
      this.showPercent = true
      return true
    },
    // 进行上传操作
    upload(params) {
      // console.log(params.file)
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          // 上传到腾讯云 => 哪个存储桶 哪个地狱的存储桶 文件 格式 名称 回调
          Bucket: 'xiaoxiaoqing-23-1317142052', // 存储桶
          Region: 'ap-nanjing', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          // 进度条
          onProgress: (params) => {
            // console.log(params)
            this.percent = params.percent * 100
          }
        }, (err, data) => {
          // data返回数据之后应该如何处理
          // console.log(err || data)
          // data中有一个statusCode === 200 的时候说明上传成功
          if (!err && data.statusCode === 200) {
            // 此时说明文件上传成功  要获取成功的返回地址
            // fileList才能上传显示到上传组件上 此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
            // 目前虽然是一张图片 但是注意 fileList是一个数组
            // 需要知道当前上传成功的是那一张图片
            this.fileList = this.fileList.map(item => {
              // 去找谁的uid等于刚刚记录下来的id
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性
                return { url: 'http://' + data.Location, upload: true }
                // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                // 保存 => 图片有大有小 => 上传速度就有快有慢  => 要根据有没有upload这个标记决定是否要去保存
              }
              return item
            })
            // 关闭进度条
            // 重置百分比
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 1000)

            // 将上传成功的地址 回写到了fileList中 fileList变化 => upload组件 就会根据fileList的变化而去渲染视图
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none
}
</style>
