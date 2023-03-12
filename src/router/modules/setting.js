// 审批模块的路由规则
import Layout from '@/layout'
export default {
  path: '/setting', // 路径按照模块名编写
  name: 'settings', // 路由规则的name 表示路由规则的名称
  component: Layout, // 组件
  children: [{
    //  二级路由
    path: '', // 二级路由的path什么也不写的时候表示 该路由为二级路由的默认路由 自动显示
    // 按需导入
    component: () => import('@/views/setting'),
    name: 'settings',
    // 路由的元信息 在路由中存储数据的地方
    meta: {
      icon: 'setting',
      title: '设置' // 这里为什么非要叫title? 因为layout组件中用到了这个组件
    }
  }]
}
