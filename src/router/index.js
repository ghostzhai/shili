import Vue from 'vue'
import Router from 'vue-router'
// import searchResult from '@/pages/searchResult'

Vue.use(Router)

export default new Router({
  routes: [
    {
      title: '首页',
      path: '/',
      name: 'home',
      meta: {title: 'home'},
      component: () => import('@/pages/home')
    },
    {
      title: '搜索',
      path: '/search/:type',
      name: 'search',
      meta: {title: 'search'},
      component: () => import('@/pages/search')
    },
    {
      title: '实体-可视化',
      path: '/entity',
      name: 'entity_visualization',
      meta: {title: 'entity_visualization'},
      component: () => import('@/pages/entity')
    },
    {
      title: '实体-可视化-带ID',
      path: '/entity/:id',
      name: 'entity_visualization_id',
      meta: {title: 'entity_visualization'},
      component: () => import('@/pages/entity')
    },
    {
      title: '实体-管理',
      path: '/entity//manage/:type',
      name: 'entity_manage',
      meta: {title: 'entity_manage'},
      component: () => import('@/components/entity/manage')
    },
    {
      title: '实体-管理-实体详情',
      path: '/entity/manage/entity/:id',
      name: 'entity_manage_entity_detail',
      meta: {title: 'entity_manage'},
      component: () => import('@/components/entity/entityDetail')
    },
    {
      title: '实体-管理-关系详情',
      path: '/entity/manage/link/:id',
      name: 'entity_manage_link_detail',
      meta: {title: 'entity_manage'},
      component: () => import('@/components/entity/linkDetail')
    },
    {
      title: '实体-联合添加',
      path: '/entity//union',
      name: 'entity_union',
      meta: {title: 'entity_union'},
      component: () => import('@/components/entity/union')
    },
    {
      title: '实体-清除数据',
      path: '/entity//clear',
      name: 'entity_clear',
      meta: {title: 'entity_union'},
      component: () => import('@/components/entity/clear')
    },
    {
      title: '实体-数据库导入',
      path: '/entity//import',
      name: 'entity_import',
      meta: {title: 'entity_import'},
      component: () => import('@/components/entity/eImport')
    },
    {
      title: '本体-可视化',
      path: '/owl',
      name: 'owl',
      meta: {title: 'owl'},
      component: () => import('@/pages/owl')
    },
    {
      title: '本体-管理',
      path: '/owl/:type',
      name: 'owl_manage',
      meta: {title: 'owl_manage'},
      component: () => import('@/components/owl/manage')
    },
    {
      title: '实体-导入',
      path: '/owl/import',
      name: 'owl_import',
      meta: {title: 'owl_import'},
      component: () => import('@/components/owl/import')
    },
    {
      title: '实体-导出',
      path: '/owl/export',
      name: 'owl_export',
      meta: {title: 'owl_export'},
      component: () => import('@/components/owl/export')
    },
    {
      title: '历史',
      path: '/history/:id',
      name: 'history',
      meta: {title: 'history'},
      component: () => import('@/pages/history')
    },
    {
      title: '计算-生成',
      path: '/compute/create',
      name: 'compute_create',
      meta: {title: 'compute_create'},
      component: () => import('@/components/compute/computeCreate')
    },
    {
      title: '计算-子图管理',
      path: '/compute/manager',
      name: 'compute_manager',
      meta: {title: 'compute_manager'},
      component: () => import('@/components/compute/computeManager')
    },
    {
      title: '计算-业务数据生成',
      path: '/compute/business',
      name: 'compute_business',
      meta: {title: 'compute_business'},
      component: () => import('@/components/compute/computeBusiness')
    },
    {
      title: '计算-关系补全',
      path: '/compute/relation',
      name: 'compute_relation',
      meta: {title: 'compute_relation'},
      component: () => import('@/components/compute/computeRelation')
    },
    {
      title: '计算-历史管理',
      path: '/compute/history',
      name: 'compute_history',
      meta: {title: 'compute_history'},
      component: () => import('@/components/compute/computeHistory')
    },
    {
      title: '查看子图',
      path: '/compute/subgraph/:id',
      name: 'subgraph',
      meta: {title: 'subgraph'},
      component: () => import('@/components/compute/subgraph')
    },
    {
      title: '例子',
      path: '/example',
      name: 'example',
      meta: {title: 'example'},
      component: () => import('@/pages/example')
    }
  ]
})
