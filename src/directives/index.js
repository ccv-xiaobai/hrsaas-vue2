// 注册自定义指令
// 处理图片异常 最基本的手段 监测图片dom的error事件

export const imagerror = {
  // 指令的参数
  // 当指令作用的dom对象插入元素之后触发
  // 将指令作用在图片上
  inserted(dom, options) {
    dom.src = dom.src || options.value // 如果没有赋值的话 可以直接用默认图片
    // options是一个对象 value
    // 图片只要异常 就处理图片默认值
    dom.onerror = function() {
      dom.src = options.value // 从哪里来呢  可以通过传入的方式设置
    }
  },
  // 更新属性之后会触发的函数- inserted只会执行一次  这里我们知道就可以了 因为后续的vue3已经删除掉了这个钩子函数
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}

// export const aa = {}
// export const bb = {}
