// 完成多语言的实例化
import Vue from 'vue'
import Cookies from 'js-cookie'
import VueI18n from 'vue-i18n'
import elementEN from 'element-ui/lib/locale/lang/en' // 引入英文语言包
import elementZH from 'element-ui/lib/locale/lang/zh-CN'
import CustomZH from './zh' // 自定义中文包
import CustomEN from './en' // 自定义英文包
Vue.use(VueI18n)
// 实例化

export default new VueI18n({
//    i18n参数
  locale: Cookies.get('language') || 'china', // 从cookie中获取语言类型 获取不到就是中文
  // 当前的语言类型 是由我们自己定义 zh  en ja
  messages: {
    //   语言包 一共有多少种语言 放到语言包里
    china: {
      // 语言包
      ...elementZH,
      ...CustomZH
    },
    en: {
      // 英文语言包
      ...elementEN,
      ...CustomEN
    }
  }
})
