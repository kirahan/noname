import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
Vue.use(ElementUI)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false


router.beforeEach((to, from, next) => {
    console.log(to)
    if (to.meta.title) {//如果设置标题，拦截后设置标题
        document.title = to.meta.title
    }else {
        document.title = 'weizhaodao'
    }
    next()
})


/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')
