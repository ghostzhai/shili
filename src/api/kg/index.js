import instance from './instance'
import {convertRESTAPI} from '../util'

/** 读取路径 */
function g_get_path(opts) {
  var data = opts.data
  var url = ''
  switch (data.condition) {
    case '1':
      //  全路径
      url = graph_studio + '/graphs/hugegraph/traversers/paths?'
      url += 'source' + '="' + data.source + '"&'
        + 'target' + '="' + data.target + '"&'
        + 'max_depth' + '=' + data.max_depth + '&'
        + 'direction' + '=' + data.direction
      if (data.side_type) {
        url += '&label=' + data.side_type
      }
      break
    case '2':
      // 最短路径
      url = graph_studio + '/graphs/hugegraph/traversers/shortestpath?'
      url += 'source' + '="' + data.source + '"&'
        + 'target' + '="' + data.target + '"&'
        + 'max_depth' + '=' + data.max_depth + '&'
        + 'direction' + '=' + data.direction
      if (data.side_type) {
        url += '&label=' + data.side_type
      }
      break
    default:
      break
  }
  return instance({
    method: 'get',
    // url: 'http://192.168.1.55:8080/graphs/hugegraph/traversers/shortestpath?source=%224a5d15d542a843c89e56663d8f547c01%22&target=%224a5d15d542a843c89e56663d8f547c06%22&max_depth=5&direction=OUT',
    // url: 'http://192.168.1.55:8080/graphs/hugegraph/traversers/paths?source=%224a5d15d542a843c89e56663d8f547c08%22&target=%224a5d15d542a843c89e56663d8f547c06%22&max_depth=5&direction=BOTH',
    url: url,
    opts: opts
  })
}

/** 探寻路径 */
function getExplorePath(opts) {
  var url = graph_api + '/graph/pathRank?vertices='
  var type = opts.data.type
  var data = opts.data.idList
  for (var i = 0; i < data.length; i++) {
    url += data[i] + ','
  }
  url = url.substr(0, url.length - 1);
  if (type === 1) {
    url += '&limit=1'
  }
  return instance({
    method: 'get',
    url: url,
    opts: opts
  })
}

/** 发送导入结构 */
function postImportData(opts) {
  return instance({
    method: 'post',
    url: graph_zjy + '/rdb/importRdb',
    opts: opts
  })
}

/** 清除全部 */
function clearAll(opts) {
  return instance({
    method: 'delete',
    url: graph_api + '/graphs/hugegraph/clear?confirm_message=I%27m+sure+to+delete+all+data',
    opts: opts
  })
}

/** 测试数据库链接 */
function test_database(opts) {
  return instance({
    method: 'post',
    url: graph_api + '/rdb/test',
    opts: opts
  })
}

/** 读取数据库表 */
function get_database(opts) {
  return instance({
    method: 'post',
    url: graph_api + '/rdb/getTableInfo',
    opts: opts
  })
}

/** 历史结果 */
function history_get(opts) {
  return instance({
    method: 'get',
    url: '/history',
    opts: opts
  })
}

/** 查看 */
function check_get(opts) {
  return instance({
    method: 'get',
    url: '/check',
    opts: opts
  })
}

/** 搜索 */
function search_get(opts) {
  return instance({
    method: 'get',
    url: '/search',
    opts: opts
  })
}

/** 搜索 **/
function g_board(opts) {
  return instance({
    method: 'post',
    url: graph_api + '/api/v1/board',
    opts: opts
  })
}

/** 搜索 **/
function text_board(opts) {
  return instance({
    method: 'post',
    url: graph_api + '/api/v1/board',
    opts: opts
  })
}

/** 新建节点 **/
function g_add(opts) {
  return instance({
    method: 'post',
    url: graph_api + '/graphs/hugegraph/graph/vertices',
    opts: opts
  })
}

/** 更新节点 **/
function g_update(opts) {
  return instance({
    method: 'put',
    url: convertRESTAPI(graph_api +
      '/graphs/hugegraph/graph/vertices/:id?action=append', opts),
    opts: opts
  })
}

/** 删除节点 **/
function g_delete(opts) {
  return instance({
    method: 'delete',
    url: convertRESTAPI(graph_auto + '/graphs/hugegraph/graph/vertices/:id',
      opts),
    opts: opts
  })
}

/** 删除节点属性 **/
function g_delete_property(opts) {
  return instance({
    method: 'put',
    url: convertRESTAPI(graph_auto + '/graphs/hugegraph/graph/vertices/:id?action=eliminate',
      opts),
    opts: opts
  })
}

/** 删除关联属性 **/
function g_delete_link_property(opts) {
  return instance({
    method: 'put',
    url: convertRESTAPI(graph_auto + '/graphs/hugegraph/graph/edges/:id?action=eliminate',
      opts),
    opts: opts
  })
}

/** 获得所有节点类型 **/
function g_all_nodes(opts) {
  return instance({
    method: 'get',
    url: graph_api + '/graphs/hugegraph/schema/vertexlabels',
    opts: opts
  })
}

/** 获得所有关联类型 **/
function g_all_links(opts) {
  return instance({
    method: 'get',
    url: graph_api + '/graphs/hugegraph/schema/edgelabels',
    opts: opts
  })
}

/** 获得所有属性类型 **/
function g_all_properties(opts) {
  return instance({
    method: 'get',
    url: graph_api + '/graphs/hugegraph/schema/propertykeys',
    opts: opts
  })
}

/** 新建关联 **/
function g_add_link(opts) {
  return instance({
    method: 'post',
    url: graph_api + '/graphs/hugegraph/graph/edges',
    opts: opts
  })
}

/** 更新关联 **/
function g_update_link(opts) {
  return instance({
    method: 'put',
    url: convertRESTAPI(graph_api +
      '/graphs/hugegraph/graph/edges/:id?action=append', opts),
    opts: opts
  })
}

/** 删除关联 **/
function g_delete_link(opts) {
  return instance({
    method: 'delete',
    url: convertRESTAPI(graph_api + '/graphs/hugegraph/graph/edges/:id', opts),
    opts: opts
  })
}

/** 获取一个随机ID **/
function g_id(opts) {
  return instance({
    method: 'get',
    url: graph_api + '/util/generateUUID.do',
    opts: opts
  })
}

/** 上传文件 **/
function g_upload(opts) {
  return instance({
    method: 'post',
    url: graph_api + '/util/upload.do',
    opts: opts
  })
}

/** 导入OWL **/
function import_owl(opts) {
  return instance({
    method: 'post',
    url: graph_api + '/ontology/importOwl',
    opts: opts
  })
}

/** 导出OWL **/
function export_owl(opts) {
  return instance({
    method: 'get',
    url: graph_zjy + '/ontology/exportOwl',
    opts: opts
  })
}

/** 子图导入 **/
function g_restore(opts) {
  return instance({
    method: 'post',
    url: graph_api + '/graph/importGraph',
    opts: opts
  })
}

/** 子图生成导入 json导入规则**/
function zituImport(opts) {
  return instance({
    method: 'post',
    url: graph_zjy + '/graphrule/importRule',
    opts: opts
  })
}

/** ，历史恢复int-id **/
function g_ls_restore(opts) {
  return instance({
    method: 'post',
    url: graph_api + '/graph/restoreGraph',
    opts: opts
  })
}

/** 子图导出isSubg:true,id-int **/
function g_export(opts) {
  return instance({
    method: 'get',
    url: graph_api + '/graph/exportGraph',
    opts: opts
  })
}

/** 子图历史备份String gid, String comment, boolean isSubg **/
function g_backup(opts) {
  return instance({
    method: 'post',
    url: graph_api + '/graph/backupGraph',
    opts: opts
  })
}

/** 获取子图数据 **/
function get_graph_list(opts) {
  return instance({
    method: 'get',
    url: graph_api + '/graphinfo/subGraphList',
    opts: opts
  })
}

/** 子图删除gid **/
function g_graph_delete(opts) {
  opts.type = 'form'
  return instance({
    method: 'post',
    url: graph_api + '/graphinfo/deleteSubGraph',
    opts: opts
  })
}

/** 获取历史数据 **/
function get_graph_ls_list(opts) {
  return instance({
    method: 'get',
    url: graph_api + '/graph/getHistoryList',
    opts: opts
  })
}

/** 历史导出int-id **/
function g_graph_export_ls(opts) {
  return instance({
    method: 'get',
    url: graph_api + '/graph/exportBackup',
    opts: opts
  })
}

/** 历史删除id-int型 **/
function g_graph_delete_ls(opts) {
  return instance({
    method: 'post',
    url: graph_api + '/graphinfo/deleteSubGraphHistory',
    opts: opts
  })
}

/** 获取所有的规则列表 **/
function get_rules_list(opts) {
  return instance({
    method: 'get',
    url: graph_api + '/graphrule/getRulesList',
    opts: opts
  })
}

/** 保存一个规则 **/
function save_rules(opts) {
  return instance({
    method: 'post',
    url: graph_zjy + '/graphrule/saveRule',
    opts: opts
  })
}

/** 删除一个规则 **/
function delete_rules(opts) {
  return instance({
    method: 'delete',
    url: graph_zjy + '/graphrule/deleteRule',
    opts: opts
  })
}

/** 根据实体或关联ID获取改动历史 **/
function g_change_history(opts) {
  return instance({
    method: 'get',
    url: graph_api + '/vehistory/history',
    opts: opts
  })
}

/** 新增历史记录 **/
function g_post_history(opts) {
  return instance({
    method: 'post',
    url: graph_api + '/vehistory/history',
    opts: opts
  })
}

/** 应用规则**/
function useRule(opts) {
  return instance({
    method: 'post',
    url: graph_zjy + '/graphrule/completeRel ',
    opts: opts
  })
}

/** 保存一个补全关系 **/
function saveRelation(opts) {
  return instance({
    method: 'post',
    url: graph_zjy + '/graphrule/saveRule',
    opts: opts
  })
}

/** 导出规则json **/
function export_rule(opts) {
  return instance({
    method: 'get',
    url: graph_zjy + '/graphrule/exportRule',
    opts: opts
  })
}

/** 生成子图**/
function create_zitu(opts) {
  return instance({
    method: 'post',
    url: graph_zjy + '/graphinfo/createSubGraph',
    opts: opts
  })
}

/** 删除index **/
function schema_remove_index(opts) {
  return instance({
    method: 'delete',
    url: convertRESTAPI(graph_api + '/graphs/hugegraph/schema/propertykeys/:name', opts),
    opts: opts
  })
}

export {
  zituImport,
  text_board,
  create_zitu,
  export_rule,
  saveRelation,
  useRule,
  delete_rules,
  save_rules,
  get_rules_list,
  export_owl,
  import_owl,
  postImportData,
  get_database,
  test_database,
  g_get_path,
  history_get,
  check_get,
  search_get,
  g_board,
  g_add,
  g_update,
  g_delete,
  g_all_nodes,
  g_all_links,
  g_all_properties,
  g_add_link,
  g_update_link,
  g_delete_link,
  g_id,
  g_upload,
  g_restore,
  g_export,
  g_backup,
  get_graph_list,
  g_graph_delete,
  g_graph_export_ls,
  g_graph_delete_ls,
  get_graph_ls_list,
  g_change_history,
  g_post_history,
  g_delete_property,
  g_delete_link_property,
  g_ls_restore,
  schema_remove_index,
  getExplorePath,
  clearAll
}
