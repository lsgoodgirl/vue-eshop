// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/style.css'
import { i18n, loadLanguageAsync } from './assets/js/i18n-setup'
import VeeValidate, { Validator } from 'vee-validate'
import en from 'vee-validate/dist/locale/en'
import ja from 'vee-validate/dist/locale/ja'
import zhTW from 'vee-validate/dist/locale/zh_TW'
import msMY from 'vee-validate/dist/locale/ms_MY'
import store from './store/index'

Vue.config.productionTip = process.env.NODE_ENV === 'production'

Vue.use(VeeValidate)

let host = Vue.config.productionTip ? window.location.host : process.env.HOST
let domainName = host.match(/(\w+)\.(\w+\.\w+)/)[2]
let lang = ''
switch (domainName) {
  case 'etlobby.com':
    lang = 'ja'
    Validator.localize(lang, ja)
    break
  case 'hiqushop.com':
    lang = 'zh_TW'
    Validator.localize(lang, zhTW)
    break
  case 'couposhop.com':
    lang = 'ms_MY'
    Validator.localize(lang, msMY)
    break
  default:
    lang = 'en'
    Validator.localize(lang, en)
}
router.beforeEach((to, from, next) => {
  loadLanguageAsync(lang).then(() => next())
})

console.log(i18n.locale)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
