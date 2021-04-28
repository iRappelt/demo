import Vue from 'vue'
import Router from 'vue-router'
import Table from '../components/Table'
import Content from '../components/Content'
import Account from '../components/Account'
import Home from '../components/Home'
import AddAccount from '../components/AddAccount'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/content',
      name: 'Content',
      component: Content,
      redirect: '/content/home',
      children: [
        {
          path: 'home',
          component: Home,
          name: 'Home',
          meta: {
            breadNumber: 1
          }
        },
        {
          path: 'home/account',
          component: Account,
          name: 'Account',
          meta: {
            breadNumber: 2
          }
        },
        {
          path: 'home/account/add',
          component: AddAccount,
          name: 'Add',
          meta: {
            breadNumber: 3
          }
        }
      ]
    },
    {
      path: '/',
      redirect: '/table'
    },
    {
      path: '/table',
      name: 'Table',
      component: Table
    }
  ],
  mode: 'history'
})

// 解决在element-ui中重复点击导航栏出现路由重复错误的问题
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
