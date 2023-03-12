<template>
  <div ref="myDiv" class="radar-echart" />
</template>

<script>
// echarts需要 div给定宽和高
var echarts = require('echarts/lib/echarts') // 引入echarts主模块
require('echarts/lib/chart/radar') // 引入雷达图
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
//  需要拿到dom元素再去渲染
//   created() {
//     console.log(this.$refs.myDiv)
//   },
  //   只能在mounted中 获取到dom元素
  mounted() {
    const myChart = echarts.init(this.$refs.myDiv) // 初始化图表实例
    // 得到实例对象
    const option = {
      title: {
        text: '人力资源基础绩效表'
      },
      legend: {
        data: ['Allocated Budget', 'Actual Spending']
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: '考勤', max: 100 },
          { name: '工资', max: 100 },
          { name: '社保', max: 100 },
          { name: '工作效率', max: 100 },
          { name: '知识分享', max: 100 },
          { name: '代码行数', max: 100 }
        ]
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [10, 2, 100, 20, 100, 100],
              name: '龙哥'
            },
            {
              value: [30, 30, 30, 30, 30, 30],
              name: '岩哥'
            },
            {
              value: [70, 70, 70, 70, 70, 70],
              name: '志兄'
            }
          ]
        }
      ]
    }
    myChart.setOption(option)
  }
}
</script>

<style>
.radar-echart {
    width: 600px;
    height: 400px;
}
</style>
