import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/dashboard/DashboardView.vue'
import Activity from '../views/activity/ActivityView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/activity/:id',
    name: 'Activity',
    component: Activity
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
