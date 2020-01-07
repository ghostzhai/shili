import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  colors: [
    'rgba(111,82,184,1)',
    'rgba(255,214,24,1)',
    'rgba(47,195,47,1)',
    'rgba(86,185,247,1)',
    'rgba(234,180,4,1)',
    'rgba(222,103,44,1)'
  ],
  propertiesSetting: {
    TEXT: function (value) {
      if (!value) return value
      return value.toString()
    },
    INT: function (value) {
      if (!value) return value
      return parseInt(value)
    },
    DOUBLE: function (value) {
      if (!value) return value
      return parseFloat(value)
    },
    FLOAT: function (value) {
      if (!value) return value
      return parseFloat(value)
    },
    e_TEXT: function (value) {
      if (!value) return value
      return '"' + value.toString() + '"'
    },
    e_INT: function (value) {
      if (!value) return value
      return parseInt(value)
    },
    e_DOUBLE: function (value) {
      if (!value) return value
      return parseFloat(value)
    },
    e_FLOAT: function (value) {
      if (!value) return value
      return parseFloat(value)
    }
  },
  explore_path: null,  // 探寻路径
  import_database: {
    database_page: {
      status: false,
      data: null
    },
    table_page: {
      status: false,
      clear: false,
      data: []
    },
    relation_page: {
      status: false,
      data: []
    },
    result: {
      status: false,
      data: null
    }
  },    // 数据库导入四个步骤的状态数据存储
  // 查询下拉使用
  propertyList: null,         // 所有属性列表
  sidesList: null,        // 所有边类型

  search_path: null,        // 路径查询的结果
  all_entity: null,             // 所有实体
  all_correlation: null,             // 所有关联
  isShowSearchResult: false,   //是否显示搜索结果
  all_graph: null, // 搜索结果
  graph: {},// 源数据
  component_graph: null,// 公共子组件zoomChart需要的数据
  refresh_graph: null,// 图表刷新用数据
  all_node: null,// 所有节点的类型
  node_colors: null,// 根据节点的label的颜色缓存
  all_link: null,// 所有关联的类型
  all_properties: null, // 所有属性的类型
  all_index: null, // 所有的索引
  searchArr: [],
  root: null,// 搜索出来的根节点
  component_root: null,
  chart: null,// zoomChart对象
  component_chart: null,// 公共子组件的zoomChart对象
  link_node: null,// 选择一个关联的可选节点

  graph_state: null, // 记录可视化页状态
  exportData: null, //得到的导出数据

  zt_list: null, // 子图数据
  ls_list: null, // 历史数据
  all_rules_list: [],   //获取所有的规则列表

  change_history: null,//获取到的实体/关联修改记录
  gremlin_messsage: '', //gremlin返回的数据
  text_res: null// 搜索规则模式结果
}

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {}
})

export default store
