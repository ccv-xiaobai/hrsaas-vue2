<template>
  <el-row type="flex" align="middle" justify="space-between" style="width:100%;height:40px">
    <!-- 行组件 -->
    <el-col :span="12">
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown @command="operateDepts">
            <!-- 下拉菜单组件 -->
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 问题1： 下拉图片的堆叠问题 -->
            <!-- 原因就是标题名称都一样，node-key属性 -->
            <!-- 没有给node-key属性， name一旦重复导致冲突 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <!-- 如果在根节点上使用 -->
              <template v-if="!isRoot">
                <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                <el-dropdown-item command="del">删除部门</el-dropdown-item>
              </template>

            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
      <!-- 右侧内容 -->
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  // props对象接收形式
  props: {
    treeNode: {
      type: Object, // 指定传入的必须是一个Object类型
      required: true // 表示如果此值不传 就会报错
    },
    isRoot: {
      type: Boolean, // 是否在根节点上个使用
      default: false
    }
  },
  methods: {
    operateDepts(type) {
      if (type === 'add') {
        // 新增功能
        // 告诉父组件 弹层打开 还要 告诉父组件 是哪个部门要添加子部门
        this.$emit('addDepts', this.treeNode)
      } else if (type === 'edit') {
        // 编辑功能
        // 通知父组件 弹层 并且也要记录编辑哪个部门
        this.$emit('editDepts', this.treeNode) // 触发编辑部门事件
      } else {
        // 删除功能 调用删除接口？？？？？
        // 正常的删除 都得提示
        this.$confirm('确定要删除该部门吗').then(() => {
          // 需要调用删除接口
          return delDepartments(this.treeNode.id)
        }).then(() => {
          // 进入到then就成功？？？？
          // 只要进入then意味着成功了
          this.$emit('delDepts') // 触发自定义事件
          this.$message.success('删除组织架构成功')
          // 只是将后端数据删除了 前端没有变化
          // 子组件告诉父组件 => 去更新数据
        })
        // elementui的 confirm是一个promise
        // 点击了确定 进入then  点击了catch
      }
    }
  }
}
</script>

<style>

</style>
