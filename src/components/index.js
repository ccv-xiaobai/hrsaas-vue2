import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import Lang from './Lang'
import TagsView from './TagsView'
// Vue.use() => 调用里面的install方法
export default {
  // 会传入Vue对象
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
    Vue.component('Lang', Lang)
    Vue.component('TagsView', TagsView)

    // 休眠函数
    Vue.prototype.$sleep = function(timer = 500) {
      return new Promise(resolve => {
        setTimeout(() => resolve(), timer)
      })
    }
  }
}
