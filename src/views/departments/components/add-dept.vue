<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 内容 -->
    <!-- body内容 -->
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item prop="manager" label="部门负责人">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <!-- 渲染列表 -->
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- 表单 -->
    <!-- 确定和取消 -->
    <!-- 底部内容 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="8">
        <el-button @click="btnCancel">取消</el-button>
        <el-button type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
// 获取当前最新的组织架构
import { getDepartments, addDepartments, getDepartmentDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 自定义校验函数 校验部门名称
    const checkNameRepeat = async(rule, value, callback) => {
      // 规则 同级部门中禁止出现重复部门
      // 不能允许 value在当前的组织架构里面的同级部门存在相同的名称
      // 获取最新的组织架构
      const { depts } = await getDepartments()
      // depts找出当前的同级部门
      // treenode 是当前点击添加子部门那个数据  treeNode的所有子节点是我的同级部门
      // 所有的子部门的pid等于父级部门的id treeNode市场部
      // 首先区分场景
      let isRepeat = false
      if (this.formData.id) {
        // 认为此时是编辑场景 都得满足之前的规则 同级部门下 不能存在重复的名称
        // 前端研究院 - vue项目- react项目-  react项目 让不让我存？让 - 不让我存- vue项目 让不让存
        // value 是react项目 this.treeNode就是react项目
        // depts.filter(item => item.pid === this.treeNode.pid) 相当于找出和我同级的部门 - 包括我自己？- 排除我自己
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
        // some表示数组的一个方法
      }
      isRepeat ? callback(new Error(`部门名称${value}重复`)) : callback()
    }
    // 校验部门编码
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      // 在所有模块中不重复
      if (this.formData.id) {
        // 编辑  只需要排除自己 再去判断就可以了
        isRepeat = depts.some(item => item.id !== this.treeNode.id && item.code === value)
      } else {
        isRepeat = depts.some(item => item.code === value)
      }
      isRepeat ? callback(new Error(`编码${value}已经重复`)) : callback()
    }
    return {
      peoples: [], // 接收获取的员工简单列表的数据
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' }, {
            validator: checkNameRepeat, trigger: 'blur'
          }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' }, {
            validator: checkCodeRepeat, trigger: 'blur'
          }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      }
    }
  },
  computed: {
    // 当前标题显示内容
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    async  getEmployeeSimple() {
      this.peoples = await getEmployeeSimple() // 获取数据
    },
    // 点击确定
    btnOK() {
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          // 表示校验通过
          // 调用新增接口
          let text = '新增'
          if (this.formData.id) {
            text = '更新'
            // 如果存在id 就认为是编辑
            await updateDepartments(this.formData)
            // 更新父组件内容  关闭弹层
          } else {
            // 需要将我是谁的子部门标识设置上 我的pid等于我父部门的id
            await addDepartments({ ...this.formData, pid: this.treeNode.id }) // 调到新增接口
            // 表示新增成功
          }
          this.$emit('addDepts')
          this.$emit('update:showDialog', false) // update:props名称 标准规范
          this.$message.success(`${text}部门成功`)
        }
      })
    },
    btnCancel() {
      // 重置数据
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      this.$refs.deptForm.resetFields() // 重置校验字段
      this.$emit('update:showDialog', false) // update:props名称 标准规范 // 关闭
    },
    // 获取详情
    async getDepartmentDetail(id) {
      //
      this.formData = await getDepartmentDetail(id)
    }
  }
}
</script>

<style>

</style>
