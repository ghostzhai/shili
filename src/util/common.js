import {graph} from '@/util/index' // graph数据处理工具类

// 获得link的两侧node
const getLinkNodes = function (graph) {
  if (!graph) return []
  let edges = graph.graph ? graph.graph.edges : []
  let tpVertex = graph.graph ? graph.graph.vertices : []
  let vertex = {}
  for(var i = 0; i < tpVertex.length; i++) {
    vertex[tpVertex[i].id] = tpVertex[i]
  }
  var Agraph = {
    edges: edges,
    vertex: vertex
  }
  return Agraph
}

// 属性转为数组
const getPropertityArr = function (graph, propertykeys) {
  var rData = []
  var  data = graph ? graph.data: []
  for(var i = 0; i < data.length; i++) {
    var properties = data[i].properties
    var obj = {}
    for(var j in properties) {
      obj[j] = properties[j].length > 0 ? properties[j][0].value: ''
    }
    obj['id'] = data[i].id
    rData.push(obj)
  }
  return rData
}


// 路径探寻数据转换{ 序号，路径}
const getExplorePathTable = function (data) {
  var tableData = []
  for(var i in data) {
    var itemData = {
      num: i,
      path: ''
    }
    var pathData = data[i]
    for(var j = 0; j < pathData.length; j++) {
      if(j === pathData.length - 1) {
        itemData.path += pathData[j].properties['名称']
      } else {
        itemData.path += pathData[j].properties['名称'] + ' --> '
      }
    }
    tableData.push(itemData)
  }
  return tableData
}

export {
  getLinkNodes,
  getPropertityArr,
  getExplorePathTable
}
