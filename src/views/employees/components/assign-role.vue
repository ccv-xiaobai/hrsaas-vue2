<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <!-- 动态渲染el-checkbox-->
      <!-- item.label表示要存储的值 -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        <!-- item的名称作为显示值 -->
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
// 获取角色列表
import { getRoleList } from '@/api/setting'
// 获取用户的基本信息 里面有当前用户所拥有的角色信息
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'

export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [], // 承载所有的角色 // [1,2,3,4,5,6,7,8]
      roleIds: [] // 定义当前选中的数组变量  [1,2,3]
    }
  },
  created() {
    // 获取角色列表  渲染到页面上
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      // 这里传分页数据- 接口暂时没有获取所有角色列表的接口
      // 后端有默认值 默认查第一页 10条数据
      const { rows } = await getRoleList()
      this.list = rows // 赋值给data数据
    },
    // 获取用户的基本信息  用户的id
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      // 读取当前用户的所拥有的角色列表
      this.roleIds = roleIds // 赋值
    },
    // 分配角色 关闭弹层
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds }) // 分配角色
      // 关闭窗体
      this.$emit('update:showRoleDialog', false)
    },
    btnCancel() {
      // 重置数据
      this.roleIds = []
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>
