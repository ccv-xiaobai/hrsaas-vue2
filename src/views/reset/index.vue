<template>
  <div>
    <el-alert
      v-if="beginReset"
      :title="`${count}秒后开始重置数据`"
      type="warning"
      :closable="false"
    />
    <el-row type="flex" justify="center" align="middle" style="height:600px">

      <el-button
        type="primary"
        style="width:200px; height:200px; font-size:26px"
        circle
        @click="resetData"
      >重置人资数据</el-button>
    </el-row>
  </div>

</template>
<script>
import { Loading } from 'element-ui'

import request from '@/utils/request'
export default {
  data() {
    return {
      count: 5,
      beginReset: false
    }
  },
  methods: {
    async resetData() {
      if (this.beginReset) return
      this.timeCut()
      await new Promise(() => setTimeout(async() => {
        const loadingInstance1 = Loading.service({
          text: '数据正在重置'
        })
        await request({
          url: '/reset',
          method: 'post'
        })
        this.beginReset = false
        this.count = 5
        loadingInstance1.close()
        this.$message.success('数据重置成功')
      }, 5000))
    },
    timeCut() {
      this.beginReset = true
      this.count--
      this.timer = setInterval(() => {
        if (this.count === 0) {
          clearInterval(this.timer)
          return
        }
        this.count--
      }, 1000)
    }
  }
}
</script>
