import Vue from 'vue'
import App from './App.vue'
import router from './router'
import elementUi from 'element-ui'
import global from './global/global'
Vue.prototype.GLOBAL = global //挂载到Vue实例上面
import 'element-ui/lib/theme-chalk/index.css'
import base from './global/base.js'

Vue.use(elementUi)
Vue.use(base)

Vue.config.productionTip = false

// 路由判断登录 根据路由配置文件的参数
router.beforeEach((to, from, next) => {
 if (to.matched.some(record => record.meta.requireAuth)){ // 判断该路由是否需要登录权限
  if (localStorage.nameCN) { // 判断当前的token是否存在 ； 登录存入的token
   next();
  }
  else {
   next({
    path: '/',
    query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
   })
  }
 }
 else {
  next();
 }
});

new Vue({
	router,
	render: function(h) {
		return h(App)
	}
}).$mount('#app')
