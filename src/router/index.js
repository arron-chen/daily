import Vue from 'vue'
import Router from 'vue-router'
import report from '../components/report'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'report',
      component: report
    }
  ]
})
