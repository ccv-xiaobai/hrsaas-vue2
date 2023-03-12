import request from '@/utils/request'

export function getDepartments() {
  return request({
    url: '/company/department'
    // token已经统一注入
  })
}
// restful接口规范
// 删除组织架构
export function delDepartments(id) {
  return request({
    method: 'delete',
    url: `/company/department/${id}`
  })
}
// 新增部门接口

export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}
// 获取企业详情的信息
export function getDepartmentDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}
// 更新部门
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
