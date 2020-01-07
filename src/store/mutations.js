const GET_GRAPH = 'GET_GRAPH'
const GET_ALL_GRAPH = 'GET_ALL_GRAPH'
const REFRESH_GRAPH = 'REFRESH_GRAPH'
const GET_ALL_NODE = 'GET_ALL_NODE'
const GET_ALL_LINK = 'GET_ALL_LINK'
const GET_ALL_PROPERTIES = 'GET_ALL_PROPERTIES'
const GET_ALL_INDEX = 'GET_ALL_INDEX'
const GET_PATH = 'GET_PATH'
const GET_ALL_ENTITY = 'GET_ALL_ENTITY'
const GET_ALL_CORRELATION = 'GET_ALL_CORRELATION'
const GET_EXPOET_DATA = 'GET_EXPOET_DATA' // 导出的OWL数据
const GET_ALL_RULES_LIST = 'GET_ALL_RULES_LIST' // 获取所有的规则列表
const ADD_RULES_LIST = 'ADD_RULES_LIST'
const DELE_RULES_LIST = 'DELE_RULES_LIST'
const GET_EXPLORE_PATH = 'GET_EXPLORE_PATH'

const ADD_NODE = 'ADD_NODE'
const UPDATE_NODE = 'UPDATE_NODE'
const DELETE_NODE = 'DELETE_NODE'
const GET_NODE_BY_ID = 'GET_NODE_BY_ID'
const GET_ALL_ENTITY_KINDS = 'GET_ALL_ENTITY_KINDS'
const DELETE_PROPERTY = 'DELETE_PROPERTY'

const GET_COMPONENT_CHART = 'GET_COMPONENT_CHART'

const ADD_LINK = 'ADD_LINK'
const UPDATE_LINK = 'UPDATE_LINK'
const DELETE_LINK = 'DELETE_LINK'

const LINK_NODE = 'LINK_NODE'

const SET_ROOT = 'SET_ROOT'
const SET_SEARCH_FLAG = 'SET_SEARCH_FLAG'
const SET_DATABASE_DATABASE = 'SET_DATABASE_DATABASE'
const SET_DATABASE_TABLES = 'SET_DATABASE_TABLES'
const SET_STATE = 'SET_STATE'

const CLEAR_STORE = 'CLEAR_STORE'

const GET_ZT_LIST = 'GET_ZT_LIST'
const DELETE_ZT = 'DELETE_ZT'

const GET_LS_LIST = 'GET_LS_LIST'
const DELETE_LS = 'DELETE_LS'

const GET_OWL_GRAPH = 'GET_OWL_GRAPH'
const CHANGE_HISTORY = 'CHANGE_HISTORY'

const SET_GREMLIN_MESSAGE = 'SET_GREMLIN_MESSAGE'

const TEXT_RESULT = 'TEXT_RESULT'

import {graph} from '@/util/index'

export default {
  [GET_EXPLORE_PATH](state, data) {
    state.explore_path = data
  },
  [SET_GREMLIN_MESSAGE](state, data) {
    state.gremlin_messsage = data
  },
  [CLEAR_STORE](state, data) {
    data.forEach((v) => {
      state[v] = null
    })
  },
  [SET_STATE](state, data) {
    state.graph_state = Object.assign({}, data)
  },
  [DELETE_PROPERTY](state, data) {
    let pro_key = Object.keys(data.property)[0]
    if (state.refresh_graph) {
      if (data.type === 'node') {
        state.refresh_graph.graph.vertices.forEach((v) => {
          v.id === data.id ? delete v.properties[pro_key] : ''
        })
      } else {
        state.refresh_graph.graph.edges.forEach((v) => {
          v.id === data.id ? delete v.properties[pro_key] : ''
        })
      }
    } else if (state.component_root) {
      delete state.component_root.properties[pro_key]
    } else if (state.component_graph) {
      if (data.type === 'node') {
        state.component_graph.graph.vertices.forEach((v) => {
          v.id === data.id ? delete v.properties[pro_key] : ''
        })
      } else {
        state.component_graph.graph.edges.forEach((v) => {
          v.id === data.id ? delete v.properties[pro_key] : ''
        })
      }
    }
  },
  [CHANGE_HISTORY](state, data) {
    state.change_history = data.data
  },
  [GET_OWL_GRAPH](state, data) {
    let edges = [], vertices = [], obj = {}

    state.all_link.edgelabels.forEach((v) => {
      v.from = v.source_label
      v.to = v.target_label
      edges.push(v)
    })
    state.all_node.vertexlabels.forEach((v, i) => {
      v.id = v.name
      vertices.push(v)
      obj[v.name] = state.colors[i % state.colors.length]
    })

    state.node_colors = obj

    state.component_graph = {
      graph: {
        edges: edges,
        vertices: vertices
      }
    }
  },
  [SET_DATABASE_TABLES](state, data) {
    state.import_database.table_page.status = data.status
    if (data.clear) {
      state.import_database.table_page.data = []
    } else {
      var dataList = state.import_database.table_page.data
      for (var i = 0; i < dataList.length; i++) {
        if (dataList[i].tableName === data.data.tableName) {
          state.import_database.table_page.data.splice(i, 1)
          return
        }
      }
      if (JSON.stringify(data.data) !== '{}') {
        state.import_database.table_page.data.push(data.data)
      }
    }
  },
  [SET_DATABASE_DATABASE](state, data) {
    state.import_database.database_page.status = data.status
    state.import_database.database_page.data = data.data
  },
  [GET_ALL_CORRELATION](state, data) {
    state.all_correlation = data.data
  },
  [GET_ALL_ENTITY](state, data) {
    state.all_entity = data.data
  },
  [GET_PATH](state, data) {
    state.search_path = data.data
  },
  [SET_SEARCH_FLAG](state, data) {
    state.isShowSearchResult = data
  },
  [GET_ALL_GRAPH](state, data) {
    state.all_graph = data.data
  },
  [GET_GRAPH](state, data) {
    state.graph = data.data
  },
  [REFRESH_GRAPH](state, data) {
    state.refresh_graph = data.data
  },
  [GET_ALL_NODE](state, data) {
    let obj = {}
    data.data.vertexlabels.forEach((v, i) => {
      obj[v.name] = state.colors[i % state.colors.length]
    })

    state.node_colors = obj
    state.all_node = data.data
  },
  [GET_ALL_LINK](state, data) {
    state.all_link = data.data
  },
  [GET_ALL_PROPERTIES](state, data) {
    state.all_properties = data.data
  },
  [GET_ALL_INDEX](state, data) {
    state.all_index = data.data
  },
  [SET_ROOT](state, data) {
    state.refresh_graph = data.data.data
    if (!state.root) {
      state.root = data.params
    } else {
      state.root = data.params
    }
  },
  [GET_NODE_BY_ID](state, data) {
    if (!state.root) {
      state.refresh_graph = {
        graph: {
          vertices: [data.data.graph.vertices[0]]
        }
      }
      state.root = data.data.graph.vertices[0]
    } else {
      state.refresh_graph = {
        graph: {
          vertices: [data.data.graph.vertices[0]]
        }
      }
      state.root = data.data.graph.vertices[0]
    }
  },
  [ADD_NODE](state, data) {
    if (state.all_graph) {
      state.all_graph.graph.vertices.push(data)
      return false
    }

    if (state.refresh_graph) {
      state.refresh_graph.graph.vertices.push(data)
    } else if (state.root && !state.refresh_graph) {
      state.refresh_graph = {
        graph: {
          vertices: [data, state.root]
        }
      }
    } else {
      data.name = data.properties[graph_key]
      state.refresh_graph = {
        graph: {
          vertices: [data]
        }
      }
      state.root = data
    }
  },
  [UPDATE_NODE](state, data) {
    if (state.component_graph && !state.component_root) {
      let o_nodes = []
      let nodes = state.component_graph.graph.vertices
      nodes.forEach((v, i) => {
        let id = '"' + v.id + '"'
        if (id === data.id) {
          for (let p in v.properties) {
            v.properties[p] = data.properties[p]
          }
        }
        o_nodes.push(v)
      })
      return
    } else if (state.component_root) {
      state.component_root.properties = Object.assign({}, data.properties)
      return
    }

    if (state.refresh_graph) {
      let o_nodes = []
      let nodes = state.refresh_graph.graph.vertices
      nodes.forEach((v, i) => {
        let id = '"' + v.id + '"'
        if (id === data.id) {
          for (let p in v.properties) {
            v.properties[p] = data.properties[p]
          }
        }
        o_nodes.push(v)
      })

      state.refresh_graph.graph.vertices = o_nodes
    } else {
      let nodes = state.refresh_graph.graph.vertices
      nodes.forEach((v, i) => {
        v.id === data.id ? v = Object.assign(v, data) : v
      })
    }
  },
  [DELETE_NODE](state, data) {
    if (state.refresh_graph) {
      let n_index, l_index = []
      let nodes = state.refresh_graph.graph.vertices
      let links = state.refresh_graph.graph.edges
      links.forEach((v, i) => {
        v.inV === data || v.outV === data ? l_index.push(i) : l_index
      })
      nodes.forEach((v, i) => {
        v.id === data ? n_index = i : n_index
      })
      l_index.forEach((i) => {
        links.splice(i, 1)
      })
      nodes.splice(n_index, 1)
    } else {
      state.root = null
    }
  },
  [LINK_NODE](state, data) {
    state.link_node = data.data
  },
  [ADD_LINK](state, data) {
    if (state.component_graph) {
      state.component_graph.graph.edges.push(data.data.data)
      state.component_graph.graph.vertices.push(data.params.target)
      return false
    }

    if (state.refresh_graph) {
      if (!state.refresh_graph.graph.edges) {
        state.refresh_graph.graph.edges = []
      }
      state.refresh_graph.graph.edges.push(data.data.data)
      state.refresh_graph.graph.vertices.push(data.params.target)
    } else if (!state.refresh_graph && state.root) {
      state.refresh_graph = {
        graph: {
          vertices: [data.params.target, state.root],
          edges: [data.data.data]
        }
      }
    }
  },
  [UPDATE_LINK](state, data) {
    let link = data.graph.edges[0]
    if (state.component_graph) {
      let links = state.component_graph.graph.edges
      links.forEach((v, i) => {
        v.id === link.id ? v = Object.assign(v, link) : v
      })
      return
    }

    let links = state.refresh_graph.graph.edges
    links.forEach((v, i) => {
      v.id === link.id ? v = Object.assign(v, link) : v
    })
  },
  [DELETE_LINK](state, data) {
    if (state.component_graph) {
      let index
      let links = state.component_graph.graph.edges
      links.forEach((v, i) => {
        v.id === data ? index = i : index
      })
      links.splice(index, 1)
      return false
    }

    let index
    let links = state.refresh_graph.graph.edges
    links.forEach((v, i) => {
      v.id === data ? index = i : index
    })
    links.splice(index, 1)
  },
  [GET_COMPONENT_CHART](state, data) {
    if ((!state.component_root) && data.data.data) {
      data.data.data.graph.vertices.forEach((v) => {
        v.id === data.id ? state.component_root = v : ''
      })
    }
    console.log('component_root', state.component_root)
    state.component_graph = data.data.data
  },
  [GET_EXPOET_DATA](state, data) { // 得到导出OWL
    state.exportData = data
  },
  [GET_ZT_LIST](state, data) {
    state.zt_list = data
  },
  [DELETE_ZT](state, data) {
    if (!state.zt_list) return false
    // state.zt_list.splice(data, 1)
  },
  [GET_LS_LIST](state, data) {
    state.ls_list = data
  },
  [DELETE_LS](state, data) {
    if (!state.ls_list) return false
    state.ls_list.splice(data, 1)
    console.log(data.data)
    state.exportData = data.data
  },
  [GET_ALL_RULES_LIST](state, data) { // 获取所有的规则列表
    state.all_rules_list = data
  },
  [ADD_RULES_LIST](state, data) { // 添加一个规则
    if (state.all_rules_list) {
      state.all_rules_list.push(data)
    }
  },
  [DELE_RULES_LIST](state, data) { // 删除一个规则
    if (!state.all_rules_list) return false
    state.all_rules_list = state.all_rules_list.filter((item) => {
      return item.id !== data
    })
  },
  [TEXT_RESULT](state, data) { // 搜索规则模式结果
    state.text_res = data
  }
}
