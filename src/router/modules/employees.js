// 审批模块的路由规则
import Layout from '@/layout'
export default {
  path: '/employees', // 路径按照模块名编写
  name: 'employees', // 路由规则的name 表示路由规则的名称
  component: Layout, // 组件
  children: [{
    //  二级路由
    path: '', // 二级路由的path什么也不写的时候表示 该路由为二级路由的默认路由 自动显示
    // 按需导入
    component: () => import('@/views/employees'),
    name: 'employees',
    // 路由的元信息 在路由中存储数据的地方
    meta: {
      icon: 'people',
      title: '员工' // 这里为什么非要叫title? 因为layout组件中用到了这个组件
    }
  }, {
    path: 'detail/:id', // query传参  动态路由传参
    component: () => import('@/views/employees/detail'),
    hidden: true, // 不在左侧菜单显示
    meta: {
      title: '员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
    }
  }, {
    path: 'print/:id', // query传参  动态路由传参
    component: () => import('@/views/employees/print'),
    hidden: true, // 不在左侧菜单显示
    meta: {
      title: '打印' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
    }
  }]
}
