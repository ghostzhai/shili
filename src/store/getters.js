export default {
  root:(state, getters) => {
    return state.root
  },
  refresh_graph: (state, getters) => {
    return state.refresh_graph
  },
  component_chart: (state, getters) => {
    return state.component_chart
  },
  component_graph: (state, getters) => {
    return state.component_graph
  },
  component_root: (state, getters) => {
    return state.component_root
  },
  all_node: (state, getters) => {
    return state.all_node ? state.all_node.vertexlabels : []
  },
  all_link: (state, getters) => {
    return state.all_link ? state.all_link.edgelabels : []
  },
}
