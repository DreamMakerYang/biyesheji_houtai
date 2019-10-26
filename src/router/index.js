import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      hidden: true,
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/user',
    component: Layout,
    redirect: 'noRedirect',//当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
    name: 'User',
    meta: { title: '用户管理', icon: 'user' },
    children: [
      {
        path: 'add',
        name: 'add',
        component: () => import('@/views/user/add'),
        meta: { title: '添加用户', icon: 'add' }
      },
      {
        path: 'sel',
        name: 'sel',
        component: () => import('@/views/user/sel'),
        meta: { title: '查看用户', icon: 'sel' }
      },
      {
        path: 'del',
        name: 'del',
        component: () => import('@/views/user/del'),
        meta: { title: '删除用户', icon: 'del' }
      }
    ]
  },

  {
    path: '/dynamic',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Dynamic',
    meta: { title: '动态管理', icon: 'dynamic' },
    children: [
      {
        path: 'wait',
        name: 'dynamicwait',
        component: () => import('@/views/dynamic/wait'),
        meta: { title: '待审批', icon: 'form' }
      },
      {
        path: 'success',
        name: 'dynamicsuccess',
        component: () => import('@/views/dynamic/success'),
        meta: { title: '已发布', icon: 'success' }
      },
      {
        path: 'del',
        name: 'dynamicdel',
        component: () => import('@/views/dynamic/del'),
        meta: { title: '已删除', icon: 'del' }
      }
    ]
  },
  {
    path: '/news',
    component: Layout,
    redirect: 'noRedirect',
    name: 'News',
    meta: { title: '新闻管理', icon: 'news' },
    children: [
      {
        path: 'wait',
        name: 'newswait',
        component: () => import('@/views/news/wait'),
        meta: { title: '待审批', icon: 'form' }
      },
      {
        path: 'success',
        name: 'newssuccess',
        component: () => import('@/views/news/success'),
        meta: { title: '已发布', icon: 'success' }
      },
      {
        path: 'del',
        name: 'newsdel',
        component: () => import('@/views/news/del'),
        meta: { title: '已删除', icon: 'del' }
      }
    ]
  },
  {
    path: '/rubbish',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Rubbish',
    meta: { title: '垃圾管理', icon: 'home' },
    children: [
      {
        path: 'wait',
        name: 'rubbishwait',
        component: () => import('@/views/rubbish/wait'),
        meta: { title: '待审批', icon: 'form' }
      },
      {
        path: 'success',
        name: 'rubbishsuccess',
        component: () => import('@/views/rubbish/success'),
        meta: { title: '已发布', icon: 'success' }
      },
      {
        path: 'del',
        name: 'rubbishdel',
        component: () => import('@/views/rubbish/del'),
        meta: { title: '已删除', icon: 'del' }
      }
    ]
  },
  {
    path: '/know',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Know',
    meta: { title: '小知识管理', icon: 'know' },
    children: [
      {
        path: 'wait',
        name: 'knowwait',
        component: () => import('@/views/know/wait'),
        meta: { title: '待审批', icon: 'form' }
      },
      {
        path: 'success',
        name: 'knowsuccess',
        component: () => import('@/views/know/success'),
        meta: { title: '已发布', icon: 'success' }
      },
      {
        path: 'del',
        name: 'knowdel',
        component: () => import('@/views/know/del'),
        meta: { title: '已删除', icon: 'del' }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Setting',
    children: [
      {
        path: 'img',
        name: 'settingimg',
        component: () => import('@/views/setting/index'),
        meta: { title: '网站设置', icon: 'setting' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
