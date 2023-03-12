<template>
  <upload-excel :on-success="onSuccess" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    async onSuccess({ results }) {
      // 将拿到excel数据导入到数据库
      // 数据结构的操作
      console.log(results)
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = []
      // 先对results进行遍历循环
      results.forEach(item => {
        const userInfo = {} // 新建一个对象
        Object.keys(item).forEach(key => {
          // 此时key是中文 => 英文
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            // 转化可识别的格式
            userInfo[userRelations[key]] = this.formatDate(item[key], '/') // 值
            return // 表示不再往下走
          }
          // 要转化哪些字段
          userInfo[userRelations[key]] = item[key]
        })
        arr.push(userInfo) // 生成新的数组
      })
      // 拿到新数组之后
      await importEmployee(arr) // 登导入成功
      // 回到上一个页面
      this.$router.push('/employees')
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
