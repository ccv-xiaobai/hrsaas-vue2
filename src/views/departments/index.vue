<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 定义基础布局 -->
      <el-card class="tree-card">
        <!-- 卡片组件 -->
        <!-- 头部的内容 -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 放置树形组件 data用来展示数据  props用来配置从哪里读取-->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <!-- 传入插槽 -->
          <!-- el-tree的插槽内容 会被循环生成 有多少个节点 就会循环生成多少次 -->
          <!-- 作用域插槽 el-tree循环每一个的时候 给插槽塞入一个数据 获取到当前循环的节点数据 -->
          <!-- <template slot-scope="{ data }"> -->
          <template v-slot="{ data }">
            <!-- 不会生成实质标签 -->
            <!-- 监听谁的事件就在谁的标签上写@事件名 -->
            <tree-tools :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts" @editDepts="editDepts" />
          </template>
          <!-- vue标签的运行方式 先去执行作用域插槽的赋值 然后执行props传值 -->
        </el-tree>
      </el-card>
    </div>
    <!-- 在标签中 属性的驼峰命令 可以按照小写字母加横线的写法 -->
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import AddDept from './components/add-dept.vue'
import { getDepartments } from '@/api/departments'
import { transListToTreeData } from '@/utils'

// Object(...) is not a function  是因为你把一个对象当成了一个函数去使用
export default {
  components: {
    TreeTools, AddDept
  },
  data() {
    return {
      loading: false, // 定义一个进度条变量
      // 组织架构的数据
      departs: [],
      defaultProps: {
        // 如果这里是空的  默认 label: 'label' children: "children"
        label: 'name'
      },
      company: { },
      showDialog: false, // 控制窗体的显示和隐藏
      node: null // 用来记录当前要添加子部门的数据
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // 单独定义一个方法
    async getDepartments() {
      this.loading = true // 打开遮罩
      const result = await getDepartments()
      this.departs = transListToTreeData(result.depts, '')
      this.company = {
        name: result.companyName,
        manager: '负责人',
        id: '' // 因为通过该节点找子部门的时候 undefined 不等于"""
      }
      // await总是会等到后面的promise进行reslove
      await new Promise(resolve => setTimeout(() => resolve(), 500))
      this.loading = false
    },
    // 新增弹层打开 并且记录当前的节点
    addDepts(node) {
      // node是要添加子部门的部门 要记录下来 以作备用
      this.showDialog = true
      this.node = node
    },
    // 打开编辑弹层 记录编辑的节点
    editDepts(node) {
      this.showDialog = true
      // 记录用node就可以
      this.node = node // 赋值是同步的，但是props传递到子组件是一个异步渲染的过程
      // 此时就可以调用子组件的方法
      // ref 可以获取子组件的实例
      this.$refs.addDept.getDepartmentDetail(node.id) // 调用子组件的方法
    }
  }
}
</script>

<style scoped>
 .tree-card {
  padding: 30px  140px;
  font-size:14px;
 }
</style>
