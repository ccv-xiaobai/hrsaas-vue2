<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 基础布局 -->
      <!-- <page-tools :show-before="true"> -->
      <page-tools show-before>
        <!-- 工具栏 -->
        <span slot="before">共{{ page.total }}条记录</span>
        <template slot="after">
          <el-button size="small" type="danger" @click="exportData">简单表头导出</el-button>
          <el-button size="small" type="info" @click="exportData(true)">复杂表头导出</el-button>
          <el-button size="small" type="success" @click="$router.push('/import')">excel导入</el-button>
          <el-button size="small" :disabled="!checkPermission('add-user')" type="primary" @click="showDialog= true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-card>
        <el-table :data="list">
          <!-- prop属性 -->
          <!-- type=index表示索引下标 + 1 -->
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像">
            <template v-slot="{ row }">
              <img
                v-imagerror="require('@/assets/common/bigUserHeader.png')"
                style="width:100px; height: 100px"
                :src="row.staffPhoto"
                alt=""
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="手机号" sortable="" prop="mobile" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <!-- 传入插槽- 作用域插槽 -->
            <template v-slot="{ row }">
              <!-- 过滤器   表达式值 | 过滤器 -->
              <!-- 过滤器想要传参？？？ -->
              {{ row.timeOfEntry | formatDate("yyyy/MM/dd") }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template v-slot="{ row }">
              <!-- 没有值 -->
              <!-- 用switch组件 enable等于1 表示当前用户是ok的 否则状态是没设置的-->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280">
            <!-- <template slot-scope="{ row }"> -->
            <template v-slot="{ row }">
              <!-- 放置按钮 -->
              <el-button size="small" type="text" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button size="small" type="text">转正</el-button>
              <el-button size="small" type="text">调岗</el-button>
              <el-button size="small" type="text">离职</el-button>
              <el-button size="small" type="text" @click="editRole(row.id)">角色</el-button>
              <el-button :disabled="!checkPermission('del-user')" size="small" type="text" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="height: 80px" type="flex" justify="center" align="middle">
          <!-- 放置分页组件 -->
          <!-- layout表示分页组件要显示部件内容 -->
          <el-pagination
            :total="page.total"
            :current-page="page.page"
            :page-size="page.size"
            background
            layout="prev,pager,next"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <add-employee :show-dialog.sync="showDialog" />
    <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
    <el-dialog title="扫码预览" :visible.sync="showCodeDialog">
      <!-- 显示二维码的元素 -->
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' // 引入枚举对象
import AddEmployee from './components/add-employee.vue'
import AssignRole from './components/assign-role.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
export default {
  components: {
    AddEmployee, AssignRole
  },
  data() {
    return {
      EmployeeEnum,
      //  定义分页数据
      page: {
        page: 1, // 默认第一页
        size: 10,
        total: 0
      },
      list: [],
      loading: false,
      showDialog: false,
      showCodeDialog: false,
      showRoleDialog: false, // 控制角色分配弹层的显示
      userId: null // 记录当前用户点击的id
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async  getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      // rows就是当前整页的数据
      this.list = rows
      await new Promise(resolve => setTimeout(() => resolve(), 300))
      this.loading = false
    },
    // 切换页码
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 格式化聘用格式
    // 需要返回值- 和计算属性没关系
    formatEmployment(row, column, cellValue, index) {
      // 可以通过row获取对应的值
      // 也可以直接用cellValue 但是请注意 需要配置prop
      const obj = this.EmployeeEnum.hireType.find(item => (item.id + '') === (cellValue + ''))
      // 找满足条件的对象
      return obj ? obj.value : '未知'
    },
    async deleteEmployee(id) {
      try {
        await this.$confirm('您确定删除该员工吗')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 导出excel
    exportData(isComplex) {
      // 定义对应关系- 把英文的key转化成中文的key所对应的值
      const headers = {
        '姓名': 'username',
        '手机': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 懒加载 script-loader
      import('@/vendor/Export2Excel').then(async excel => {
        // 此时表明该模块已经动态引入
        // excel.export_json_to_excel({
        //   header: ['财产', '姓名', '身高', '体重', '学历', '籍贯'], // 表头 必填
        //   // [{ height: 180 }]
        //   data: [[1000, '老高', '180cm', '92kg', '河北', '大专'], [5, '朱德政', '190cm', '50kg', '博士后', '中国']], // 具体数据 必填
        //   filename: '全球杰出十大青年履历表', // 非必填
        //   autoWidth: true, // 非必填
        //   bookType: 'xlsx' // 非必填
        // })
        // 处理data数据- 导出所有的数据- 获取 page-size
        // total 1000 - size 1000  1
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        // rows就是所有的数据 rows [{},{},{}] => [[],[],[],[]]
        const data = this.formatJson(headers, rows) // 转化数据表结构
        const multiHeader = isComplex ? [['姓名', '主要信息', '', '', '', '', '部门']] : []
        const merges = isComplex ? ['A1:A2', 'B1:F1', 'G1:G2'] : []
        excel.export_json_to_excel({
          header: Object.keys(headers),
          multiHeader,
          data,
          merges,
          filename: 'ihrm人力资源用户表', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    // 格式化json数据
    // rows [{},{},{},{}}] => [[],[],[],[]]
    formatJson(headers, rows) {
      // 对第一层的数组进行遍历
      // {
      //             "id": "604f764971f93f3ac8f365c2",
      //             "mobile": "13800000002",
      //             "username": "管理员3",
      //             "password": "e10adc3949ba59abbe56e057f20f883e",
      //             "timeOfEntry": "2018-11-02",
      //             "formOfEmployment": 1,
      //             "workNumber": "9002",
      //             "correctionTime": "2018-11-30",
      //             "departmentName": "总裁办",
      //             "staffPhoto": "http://q6cu3t6jv.bkt.clouddn.com/1063705989926227968?t=1616204161907"
      //         }
      // 转化成
      // ["604f764971f93f3ac8f365c2","13800000002", "管理员3"]
      // [[],[],[]]
      return rows.map(item => {
        //   Object.values(headers) ['username', 'mobile', 'formOfEmployment']
        // ["604f764971f93f3ac8f365c2","13800000002", "管理员3"]
        return Object.values(headers).map(value => {
          // 此时value就是 字段名
          // item[value] 对应的就是 13800000002 -管理员3 -2018-11-02
          // 需要针对几个字段处理- 聘用形式
          if (value === 'formOfEmployment') {
            // 当字段为聘用形式时 需要知道其值所对应的真的文本
            const obj = this.EmployeeEnum.hireType.find(o => (o.id + '') === (item[value] + ''))
            // 寻找聘用形式对应的文本内容
            return obj ? obj.value : '未知'
          } else if (value === 'timeOfEntry' || value === 'correctionTime') {
            // 当字段是日期时
            return formatDate(item[value])
          }
          return item[value]
        })
      })
    },
    showQrCode(url) {
      if (url) {
        // 当有url地址的情况下
        this.showCodeDialog = true // 打开弹层- 立刻渲染？渲染是异步的
        // toCanvas(dom, info)
        // 应该等到上次的数据更新完成之后 再去进行获取dom 此时才可以进行
        // this.$nextTick() 传入回调函数 vue渲染异步的
        this.$nextTick(() => QrCode.toCanvas(this.$refs.myCanvas, url)) // 转化二维码
      } else {
        this.$message.warning('你还未上传头像')
      }
    },
    // 此时id就是编辑的用户的id
    async editRole(id) {
      this.userId = id // 记录当前点击的用户id
      // 可以通过此id进行获取当前用户所拥有的角色
      // 父组件调用子组件方法
      await this.$refs.assignRole.getUserDetailById(id) // 调用子组件方法
      this.showRoleDialog = true // 分配角色窗口弹出
    }
  }
}
</script>

<style>

</style>
