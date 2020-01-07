import {kg} from '../api/index'
import {notification, Modal} from 'ant-design-vue'
import {graph} from '@/util/index'

export default {
  // 清空store存储数据
  clear({commit, state}, params) {
    commit('CLEAR_STORE', params)
  },
  // 设置当前可视化右侧菜单状态
  set_state({commit, state}, params) {
    commit('SET_STATE', params)
  },
  // 传送要导入的数据库结构
  postImportData({commit, state}, params) {
    return kg.postImportData({data: params, type: 'form'})
  },
  // 选择要导入的数据库表
  setImportTable({commit, state}, params) {
    commit('SET_DATABASE_TABLES', params)
  },
  // 存储数据库链接测试结果
  setDatabaseInfo({commit, state}, params) {
    return kg.test_database({data: params, type: 'form'}).then((result) => {
      let databaseData = {
        status: false,
        data: params
      }
      if (result.data.code >= 200 || result.data.code < 300) {
        databaseData.status = true
        commit('SET_DATABASE_DATABASE', databaseData)
      }
    })
  },
  // 获取探寻路径
  getExplorePath({commit, state}, params) {
    return kg.getExplorePath({data: params}).then((result) => {
      if (result.data.code >= 200 || result.data.code < 300) {
        commit('GET_EXPLORE_PATH', result.data.data)
      }
    })
  },
  // 获取一个实体节点
  getMediaById({commit, state}, params) {
    return kg.g_board({
      data: {
        'id': 'card_1',
        'code': 'g.V("' + params + '")'
      }
    }).then((data) => {
      return data.data
    })
  },
  // 获取一个实体节点
  getALimitEntity({commit, state}) {
    return kg.g_board({
      data: {
        'id': 'card_1',
        'code': 'g.V().limit(1)'
      }
    }).then((data) => {
      return data.data
    })
  },
  //读取所有本体
  getAllEntity({commit, state}, params) {
    const searchStr = 'graph.schema().getVertexLabels()'
    return kg.g_board({
      data: {
        'id': 'card_1',
        'code': searchStr
      }
    }).then((data) => {
      commit('GET_ALL_ENTITY', data)
    })
  },
  //读取所有关联
  getAllCorrelation({commit, state}, params) {
    const searchStr = 'graph.schema().getEdgeLabels()'
    return kg.g_board({
      data: {
        'id': 'card_1',
        'code': searchStr
      }
    }).then((data) => {
      commit('GET_ALL_CORRELATION', data)
    })
  },
  //读取路径
  getPath({commit, state}, params) {
    return kg.g_get_path({
      data: params
    }).then((data) => {
      commit('GET_PATH', data)
    })
  },
  setSearchFlag({commit, state}, params) {
    commit('SET_SEARCH_FLAG', params)
  },
  getOWLGraph({commit, state}) {
    commit('GET_OWL_GRAPH')
  },
  // 清除全部
  clearAll({commit, state}, params) {
    debugger
    return kg.clearAll()
  },
  // 直接操作hugeGraph,参数为字符串，不需要返回值
  setGraph({commit, state}, params) {
    return kg.g_board({
      data: {
        'id': 'card_1',
        'code': params
      }
    })
  },
  // 查询数量
  getAllGraphNum({commit, state}, params) {
    return kg.g_board({
      data: {
        'id': 'card_1',
        'code': params
      }
    })
  },
  getAllGraph({commit, state}, params) {
    return kg.g_board({
      data: {
        'id': 'card_1',
        'code': params
      }
    }).then((data) => {
      if (data.data.code === 500) {
        alert('查询错误:' + data.data.message)
      } else {
        commit('GET_ALL_GRAPH', data)
        commit('GET_COMPONENT_CHART', {data: data})
      }
    })
  },
  // 根据关联类型查找可关联的节点
  getLinkNode({commit, state}, params) {
    return kg.g_board({
      data: {
        'id': 'card_1',
        'code': 'g.V().hasLabel("' + params + '").dedup()'
      }
    }).then((data) => {
      commit('LINK_NODE', data)
    })
  },
  getGraph({commit, state}, params) {
    return kg.g_board({
      data: {
        'id': 'card_1',
        'code': 'g.V().filter({ it.get().value("' + graph_key +
        '").contains("' + params + '") })'
      }
    }).then((data) => {
      commit('GET_GRAPH', data)
    })
  },
  // 刷新实体用的数据
  refreshGraph({commit, state}, params) {
    if (!state.root) {
      notification.error({
        message: '错误',
        description: '请先进行关键词搜索选择根节点，再执行操作'
      })
      return false
    }
    let searchStr = ''
    let nodes = graph.arrayToString(params.checkedEntities)
    let links = graph.arrayToString(params.checkedLinks)
    let level = params.level ? params.level : parseInt(params.autoLevel)
    if (params.checkedEntities.length > 0) searchStr = 'hasLabel(' + nodes +
      ')'
    return kg.g_board({
      data: {
        'id': 'card_1',
        'code': 'g.V("' + state.root.id +
        '").emit(' + searchStr + ').repeat(__.both(' + links +
        ')).until(loops().is(' + level + ')).path()'
      }
    }).then((data) => {
      commit('REFRESH_GRAPH', data)
      return true
    })
  },
  // 获取所有节点类型
  getAllNode({commit, state}, reload) {
    if (state.all_node && !reload) {
      return new Promise((resolve, reject) => {
        resolve(state.all_node)
      })
    }
    return kg.g_all_nodes().then((data) => {
      commit('GET_ALL_NODE', data)
      return data.data
    })
  },
  // 获取所有关联类型
  getAllLink({commit, state}, reload) {
    if (state.all_link && !reload) {
      return new Promise((resolve, reject) => {
        resolve(state.all_link)
      })
    }
    return kg.g_all_links().then((data) => {
      commit('GET_ALL_LINK', data)
      return data.data
    })
  },
  // 获取所有属性类型
  getAllProperties({commit, state}, reload) {
    if (state.all_properties && !reload) {
      return new Promise((resolve, reject) => {
        resolve(state.all_properties)
      })
    }
    return kg.g_all_properties().then((data) => {
      commit('GET_ALL_PROPERTIES', data)
      return data.data
    })
  },
  // 获取所有索引
  getAllIndex({commit, state}, reload) {
    if (state.all_index && !reload) {
      return new Promise((resolve, reject) => {
        resolve(state.all_index)
      })
    }
    return kg.g_board({
      data: {
        'id': 'card_1',
        'code': 'graph.schema().getIndexLabels()'
      }
    }).then((data) => {
      commit('GET_ALL_INDEX', data)
      return data.data
    })
  },
  // 设置实体根节点
  setRoot({commit, state}, params) {
    return kg.g_board({
      data: {
        'id': 'card_1',
        'code': 'g.V("' + params.id +
        '").emit().repeat(__.both()).until(loops().is(1))'
      }
    }).then((data) => {
      commit('SET_ROOT', {params, data})
      return true
    })
  },
  // 新增实体节点
  addNode({commit, state}, params) {
    let content = {
      id: params.id,
      label: params.label,
      properties: {}
    }
    for (let p in params.values) {
      let value = params.values[p]
      state.all_properties.propertykeys.forEach((v, i) => {
        p === v.name
          ? value = state.propertiesSetting[v.data_type](value)
          : value
      })
      content.properties[p] = value
    }
    return kg.g_add({data: content}).then((nodeData) => {
      if (nodeData.status < 200 || nodeData.status >= 300) {
        notification.error({
          message: '错误',
          description: '新建节点错误'
        })
        return false
      }
      notification.success({
        message: '成功',
        description: '新建节点成功'
      })
      commit('ADD_NODE', content)
      return nodeData
    })
  },
  // 更新实体节点
  updateNode({commit, state}, params) {
    let content = {
      id: '"' + params.id + '"',
      label: params.values.label,
      properties: {}
    }
    delete params.values.id
    delete params.values.label
    for (let p in params.values) {
      let value = params.values[p]
      state.all_properties.propertykeys.forEach((v, i) => {
        p === v.name
          ? value = state.propertiesSetting[v.data_type](value)
          : value
      })
      content.properties[p] = value
    }
    return kg.g_update({path: {id: content.id}, data: content})
      .then((data) => {
        if (data.status < 200 || data.status >= 300) {
          notification.error({
            message: '错误',
            description: '编辑节点错误'
          })
          return false
        }
        notification.success({
          message: '成功',
          description: '更新节点成功'
        })
        commit('UPDATE_NODE', content)
      })
  },
  // 删除实体节点
  deleteNode({commit, state}, params) {
    return kg.g_board({
      data: {
        'id': 'card_1',
        'code': 'g.V("' + params + '").drop()'
      }
    }).then((data) => {
      if (data.status < 200 || data.status >= 300) {
        notification.error({
          message: '错误',
          description: '删除节点错误'
        })
        return false
      }
      commit('DELETE_NODE', params)
      notification.success({
        message: '成功',
        description: '删除节点成功'
      })
      return true
    })
  },
  // 删除实体节点
  deleteNodeRF({commit, state}, params) {
    return kg.g_delete({path: {id: '"' + params + '"'}, no_data: true})
      .then((data) => {
        if (data.status < 200 || data.status >= 300) {
          notification.error({
            message: '错误',
            description: '删除节点错误'
          })
          return false
        }
        return true
      })
  },
  // 删除节点属性
  deleteProperties({commit, state}, params) {
    let content = {
      label: params.label,
      properties: params.property
    }
    let url = 'g_delete_property'
    let id = '"' + params.id + '"'
    if (params.type !== 'node') {
      id = params.id
      url = 'g_delete_link_property'
    }
    return kg[url]({path: {id: id}, data: content, no_data: true})
      .then((data) => {
        if (data.status < 200 || data.status >= 300) {
          notification.error({
            message: '错误',
            description: '删除节点错误'
          })
          return false
        }
        commit('DELETE_PROPERTY', params)
      })
  },
  // 新增关联
  addLink({commit, state}, params) {
    let properties = {}
    delete params.values.link
    for (let lp in params.values) {
      let value = params.values[lp]
      state.all_properties.propertykeys.forEach((v, i) => {
        lp === v.name
          ? value = state.propertiesSetting[v.data_type](value)
          : value
      })
      properties[lp] = value
    }
    let content = {
      label: params.link.name,  	//关系边的类型label（传入）
      outV: params.source.id,		//关系边的起始节点的id（传入）
      inV: params.target.id,			//关系边的终止节点的id（传入）
      outVLabel: params.source.label,	//关系边的起始节点的label（传入）
      inVLabel: params.target.label,	//关系边的终止节点的label（传入）
      properties: properties
    }
    return kg.g_add_link({data: content}).then((data) => {
      if (data.status < 200 || data.status >= 300) {
        notification.error({
          message: '错误',
          description: '新建关联错误'
        })
        return false
      }
      notification.success({
        message: '成功',
        description: '新建关联成功'
      })
      commit('ADD_LINK', {params, data})
      return data
    })
  },
  // 更新关联
  updateLink({commit, state}, params) {
    let content = {
      properties: {}
    }
    let property = ''
    delete params.values.id
    delete params.values.label
    for (let p in params.values) {
      let value = params.values[p]
      state.all_properties.propertykeys.forEach((v, i) => {
        p === v.name
          ? value = state.propertiesSetting['e_' + v.data_type](value)
          : value
      })

      property += '.property("' + p + '",' + value + ')'
      content.properties[p] = value
    }
    return kg.g_board({
      data: {
        'id': 'card_1',
        'code': 'g.E("' + params.id + '")' + property
      }
    })
      .then((data) => {
        if (data.status < 200 || data.status >= 300) {
          notification.error({
            message: '错误',
            description: '更新关联错误'
          })
          return false
        }
        notification.success({
          message: '成功',
          description: '更新关联成功'
        })
        commit('UPDATE_LINK', data.data)
      })
  },
  // 删除关联
  deleteLink({commit, state}, params) {
    return kg.g_board({
      data: {
        'id': 'card_1',
        'code': 'g.E("' + params + '").drop()'
      }
    }).then((data) => {
      if (data.status < 200 || data.status >= 300) {
        notification.error({
          message: '错误',
          description: '删除关联错误'
        })
        return false
      }
      notification.success({
        message: '成功',
        description: '删除关联成功'
      })
      commit('DELETE_LINK', params)
      return true
    })
  },
  // 通过ID获取实体节点
  getNodeById({commit, state}, params) {
    return kg.g_board({
      data: {
        'id': 'card_1',
        'code': params
      }
    }).then((data) => {
      commit('GET_NODE_BY_ID', data)
    })
  },
  getComponentChart({commit, state}, params) {
    let node_types = [], link_types = []
    state.all_node.vertexlabels.forEach((v) => {
      node_types.push(v.name)
    })
    state.all_link.edgelabels.forEach((v) => {
      link_types.push(v.name)
    })
    let str = 'g.V("' + params.id +
      '").emit().repeat(__.both()).until(loops().is(' + parseInt(params.level) +
      ')).path()'
    if (parseInt(params.level) === 0) {
      str = 'g.V("' + params.id + '")'
    }
    return kg.g_board({
      data: {
        'id': 'card_1',
        'code': str
      }
    }).then((data) => {
      commit('GET_COMPONENT_CHART', {id: params.id, data})
      return true
    })
  },
  getComponentLink({commit, state}, params) {
    return kg.g_board({
      data: {
        'id': 'card_1',
        'code': 'g.E("' + params + '")'
      }
    }).then((data) => {
      commit('GET_COMPONENT_CHART', {data: data})
      return true
    })
  },
  upload({commit, state}, params) {
    return kg.g_upload({data: params}).then((data) => {
      if (data.status < 200 || data.status >= 300) {
        notification.error({
          message: '错误',
          description: '上传失败'
        })
        return false
      }
      notification.success({
        message: '成功',
        description: '上传成功'
      })
      return data.data
    })
  },
  /**
   * 执行gremlin语句
   */
  gremlin({commit, state}, searchStr) {
    return new Promise(resolve => {
      kg.g_board({
        data: {
          'id': 'card_1',
          'code': searchStr
        }
      }).then((data) => {
        resolve(data.data)
      })
    })
  },
  //导入owl
  importOwl({commit, state}, params) {
    return kg.import_owl({data: params}).then((data) => {
      if (data.data.code >= 200 && data.data.code < 300) {
        notification.success({
          message: '成功',
          description: '导入成功'
        })
        return data.data
      } else {
        notification.error({
          message: '错误',
          description: '导入失败'
        })
        return false
      }
    })
  },
  //导出owl
  exportOwl({commit, state}) {
    return kg.export_owl().then((data) => {
      console.log('action========', data)
      if (data.status < 200 || data.status >= 300) {
        notification.error({
          message: '错误',
          description: '导出OWl错误'
        })
        return false
      }
      commit('GET_EXPOET_DATA', data.data)
    })
  },
  // 计算_子图管理-读取数据
  computeZT_read({commit, state}, params) {
    return kg.get_graph_list().then((data) => {
      commit('GET_ZT_LIST', data.data)
      return data.data && data.data.data
    })
  },
  // 计算_子图管理-导入
  computeZT_import({commit, state}, params) {
    return kg.g_restore({data: params}).then((data) => {
      if (data.data.code < 200 || data.data.code >= 300) {
        notification.error({
          message: '错误',
          description: data.data.msg
        })
        return false
      }
      notification.success({
        message: '成功',
        description: '导入成功'
      })
      return true
    })
  },
  // 计算_子图管理-导出
  computeZT_export({commit, state}, params) {
    return kg.g_export({params: params}).then((data) => {
      if (data.data.code < 200 || data.data.code >= 300) {
        notification.error({
          message: '错误',
          description: data.data.msg
        })
        return false
      }
      return data.data
    })
  },
  // 计算_子图管理-历史备份
  computeZT_backup({commit, state}, params) {
    return kg.g_backup({data: params, type: 'form'}).then((data) => {
      // debugger
      // if (data.data.status < 200 || data.status >= 300) {
      //   notification.error({
      //     message: '错误',
      //     description: data.data.message
      //   })
      //   return false
      // }
      notification.success({
        message: '成功',
        description: data.data.message
      })
    }).catch((data) => {
      if (data.response && data.response.status === 500) {
        notification.error({
          message: '错误',
          description: data.response.data && data.response.data.message
        })
      }
    })
  },
  // 计算_子图管理-删除
  computeZT_delete({commit, state}, params) {
    return kg.g_graph_delete({data: params})
      .then((data) => {
        if (data.data.code < 200 || data.data.code >= 300) {
          notification.error({
            message: '错误',
            description: data.data.msg
          })
          return false
        }
        notification.success({
          message: '成功',
          description: '删除成功'
        })
        commit('DELETE_ZT', params.index)
      })
  },
  // 计算_历史管理-读取数据
  computeLS_read({commit, state}) {
    return kg.get_graph_ls_list().then((data) => {
      commit('GET_LS_LIST', data.data)
    })
  },
  // 计算_历史管理-删除
  computeLS_delete({commit, state}, params) {
    return kg.g_graph_delete_ls({data: params, type: 'form'})
      .then((data) => {
        // commit('DELETE_LS', params.index)
      })
  },
  // 计算_历史管理-恢复
  computeLS_restore({commit, state}, params) {
    return kg.g_ls_restore({data: params, type: 'form'}).then((data) => {
      if (data.data.code < 200 || data.data.code >= 300) {
        notification.error({
          message: '错误',
          description: data.data.msg
        })
        return false
      }
      notification.success({
        message: '成功',
        description: '恢复成功'
      })
    })
  },
  // 计算_历史管理-导出
  computeLS_export({commit, state}, params) {
    return kg.g_graph_export_ls({data: {hid: params}}).then((data) => {
      if (data.data.code < 200 || data.data.code >= 300) {
        notification.error({
          message: '错误',
          description: data.data.msg
        })
        return false
      }
      return data
    })
  },
  //获取所有的规则列表
  getAllRules({commit, state}, params) {
    console.log(params.type)
    return kg.get_rules_list({params: params, type: 'form'}).then((data) => {
      commit('GET_ALL_RULES_LIST', data.data)
    })
  },
  // 保存规则
  saveRules({commit, state}, params) {
    if (params.id) {
      return kg.save_rules({data: params}).then((data) => {
        if (data.data.code < 200 || data.data.code >= 300) {
          notification.error({
            message: '错误',
            description: data.data.data
          })
          return false
        }
        return kg.get_rules_list({params: {type: params.type}}).then((data) => {
          commit('GET_ALL_RULES_LIST', data.data)
        })
      })
    }
    return kg.save_rules({data: params}).then((data) => {
      if (data.data.code < 200 || data.data.code >= 300) {
        notification.error({
          message: '错误',
          description: data.data.data
        })
        return false
      }
      return kg.get_rules_list({params: {type: params.type}}).then((data) => {
        commit('GET_ALL_RULES_LIST', data.data)
      })
    })
  },
  // 删除一个规则
  delete_Rule({commit, state}, params) {
    return kg.delete_rules({data: params}).then((data) => {
      console.log('id======', params)
      if (data.data.code < 200 || data.data.code >= 300) {
        notification.error({
          message: '错误',
          description: data.data.data
        })
        return false
      } else {
        notification.success({
          message: '成功',
          description: data.data.data
        })
        return kg.get_rules_list({params: {type: '子图生成'}}).then((data) => {
          commit('GET_ALL_RULES_LIST', data.data)
        })
      }
    })
  },
  //通过ID获取修改记录
  getChangeHistoryById({commit, state}, params) {
    return kg.g_change_history({params: {itemId: params.id, gid: params.gid}})
      .then((data) => {
        commit('CHANGE_HISTORY', data)
      })
  },
  //新增历史记录
  postHistory({commit, state}, params) {
    return kg.g_post_history(
      {data: {itemId: params.id, info: params.info, gid: g_id}})
  },
  //创建节点前获取随机ID
  get_id({commit, state}) {
    return kg.g_id().then((data) => {
      return data.data
    })
  },
  // 应用规则
  use_rule({commit, state}, params) {
    return kg.useRule({data: params, type: 'form'}).then((data) => {
      console.log('关系====', data)
      if (data.data.code < 200 || data.data.code >= 300) {
        Modal.error({
          title: data.data.msg,
          content: data.data.data
        })
        return false
      }
      return data.data
    })
  },
  // 保存补全关系
  save_Relation({commit, state}, params) {
    let data = JSON.stringify(
      {relation: params.relation, rulesMs: params.rulesMs})
    if (params.id) {
      return kg.saveRelation({
        data: {
          id: params.id,
          name: params.name,
          regex: params.regex,
          data: data,
          type: params.type
        }
      }).then((data) => {
        if (data.data.code < 200 || data.data.code >= 300) {
          notification.error({
            message: '错误',
            description: data.data.data
          })
          return false
        }
        return kg.get_rules_list({params: {type: params.type}}).then((data) => {
          commit('GET_ALL_RULES_LIST', data.data)
        })
      })
    }
    return kg.saveRelation({
      data: {
        name: params.name,
        regex: params.regex,
        data: data,
        type: params.type
      }
    }).then((data) => {
      if (data.data.code < 200 || data.data.code >= 300) {
        notification.error({
          message: '错误',
          description: data.data.data
        })
        return false
      }
      return kg.get_rules_list({params: {type: params.type}}).then((data) => {
        commit('GET_ALL_RULES_LIST', data.data)
      })
    })
  },
  // 删除一个关系
  delete_Relation({commit, state}, params) {
    return kg.delete_rules({data: params}).then((data) => {
      console.log('id======', params)
      if (data.data.code < 200 || data.data.code >= 300) {
        notification.error({
          message: '错误',
          description: data.data.data
        })
        return false
      } else {
        notification.success({
          message: '成功',
          description: data.data.data
        })
        return kg.get_rules_list({params: {type: '关系补全'}}).then((data) => {
          commit('GET_ALL_RULES_LIST', data.data)
        })
      }
    })
  },
  // 导出规则json
  exportRule({commit, state}, params) {
    console.log('params====', params)
    return kg.export_rule({params: params})
  },
  schemaRemoveIndex({commit, state}, params) {
    return kg.schema_remove_index({data: params, type: 'form'}).then((data) => {

    })
    return kg.export_rule({data: params, type: 'form'}).then((data) => {
      if (data.data.code < 200 || data.data.code >= 300) {
        notification.error({
          message: '错误',
          description: data.data.data
        })
        return false
      }
      console.log(data)
      return true
    })
  },
  // 生成子图
  createZt({commit, state}, params) {
    console.log('zitu===', params)
    return kg.create_zitu({data: params, type: 'form'}).then((data) => {
      if (data.data.code < 200 || data.data.code >= 300) {
        notification.error({
          message: '错误',
          description: data.data.data
        })
        return false
      }
      return data.data
    })
  },
  // 搜索规则结果
  text_result({commit, state}, params) {
    console.log(params)
    return kg.g_board({
      data: {
        'id': 'card_1',
        'code': params
      }
    }).then((data) => {
      console.log(data.data)
      commit('TEXT_RESULT', data.data)
    })
  },
  // 子图生成导入
  zitu_import({commit, state}, params) {
    return kg.zituImport({data: params}).then((data) => {
      if (data.data.code < 200 || data.data.code >= 300) {
        notification.error({
          message: '错误',
          description: data.data.msg
        })
        return false
      }
      return data.data
    })
  },
  // 业务数据导入
  business_import({commit, state}, params) {
    return kg.zituImport({data: params}).then((data) => {
      if (data.data.code < 200 || data.data.code >= 300) {
        notification.error({
          message: '错误',
          description: data.data.msg
        })
        return false
      }
      return data.data
    })
  },
  // 补全关系导入
  relation_import({commit, state}, params) {
    return kg.zituImport({data: params}).then((data) => {
      if (data.data.code < 200 || data.data.code >= 300) {
        notification.error({
          message: '错误',
          description: data.data.msg
        })
        return false
      }
      return data.data
    })
  },
  // 保存数据生成
  save_Business({commit, state}, params) {
    if (params.id) {
      return kg.save_rules({data: params}).then((data) => {
        if (data.data.code < 200 || data.data.code >= 300) {
          notification.error({
            message: '错误',
            description: data.data.data
          })
          return false
        }
        return kg.get_rules_list({params: {type: params.type}}).then((data) => {
          commit('GET_ALL_RULES_LIST', data.data)
        })
      })
    }
    return kg.save_rules({data: params}).then((data) => {
      if (data.data.code < 200 || data.data.code >= 300) {
        notification.error({
          message: '错误',
          description: data.data.data
        })
        return false
      }
      return kg.get_rules_list({params: {type: params.type}}).then((data) => {
        commit('GET_ALL_RULES_LIST', data.data)
      })
    })
  },
  // 删除一个数据生成
  delete_Business({commit, state}, params) {
    return kg.delete_rules({data: params.id}).then((data) => {
      if (data.data.code < 200 || data.data.code >= 300) {
        notification.error({
          message: '错误',
          description: data.data.data
        })
        return false
      } else {
        notification.success({
          message: '成功',
          description: data.data.data
        })
        return kg.get_rules_list({params: {type: '数据生成'}}).then((data) => {
          commit('GET_ALL_RULES_LIST', data.data)
        })
      }
    })
  }
}
