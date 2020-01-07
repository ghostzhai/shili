import store from '../store'

const getNode = function (graph) {
  if (!graph) return []
  let Agraph = graph.graph ? graph.graph.vertices : []

  let nodes = []
  Agraph.forEach((v, i) => {
    v.className = v.label
    v.name = v.properties[graph_key] ? v.properties[graph_key] : v.id
    v.loaded = true

    if (v.label || v.user_data) nodes.push(v)
  })
  return nodes
}

const getNodeTypes = function (nodes) {
  if (!nodes) return []
  let Anodes = nodes.vertexlabels
  let nodesArr = []
  Anodes.forEach((v, i) => {
    nodesArr.push(v.name)
  })

  return nodesArr
}

const getLink = function (graph) {
  if (!graph) return []
  let Agraph = graph.graph ? graph.graph.edges : []
  !Agraph ? Agraph = [] : Agraph
  Agraph.forEach((v, i) => {
    if (!v.from) {v.from = v.outV}
    if (!v.to) {v.to = v.inV}
  })
  return Agraph
}

const getGraph = function (graph) {
  if (!graph) return []
  let Agraph = graph
  return Agraph ? Agraph : {}
}

const getLinkTypes = function (links) {
  if (!links) return []
  let Alinks = links.edgelabels
  let linksArr = []
  Alinks.forEach((v, i) => {
    linksArr.push(v.name)
  })
  return linksArr
}

const getTypeByPro = function (pros, pro_name) {
  let data_type = 'TEXT'
  pros.forEach((pv, pi) => {
    pv.name === pro_name ? data_type = pv.data_type : data_type
  })
  return data_type
}

const isMedia = function (pros, pro_name) {
  let bool = true
  pros.forEach((pv, pi) => {
    pv.name === pro_name ? bool = !!pv.user_data.type : bool
  })
  return bool
}

const getUser_data = function (pros, pro_name) {
  let user_data
  pros.forEach((pv) => {
    pv.name === pro_name ? user_data = pv.user_data : user_data
  })
  return user_data
}

const isRequired = function (label, pro_name) {
  let bool = false
  store.state.all_node.vertexlabels.forEach((v) => {
    v.name === label ? bool = v.nullable_keys.indexOf(pro_name) === -1 : v
  })
  return bool
}

const isLinkRequired = function (label, pro_name) {
  let bool = false
  store.state.all_link.edgelabels.forEach((v) => {
    v.name === label ? bool = v.nullable_keys.indexOf(pro_name) === -1 : v
  })
  return bool
}

const arrayToString = function (arr) {
  let str = ''
  arr.forEach((v, i) => {
    str += '"' + v + '"'
    if (i < arr.length - 1) {
      str += ','
    }
  })
  return str
}

export {
  getNode,
  getLink,
  getGraph,
  getNodeTypes,
  getLinkTypes,
  arrayToString,
  getTypeByPro,
  isMedia,
  getUser_data,
  isRequired,
  isLinkRequired
}
