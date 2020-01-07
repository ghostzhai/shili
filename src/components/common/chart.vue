<template>
  <div id="component_chart" style="width: 100%;height: 100%"></div>
</template>

<script>
  const NetChart = window.NetChart

  import {graph, zoom} from '@/util/index' // zoomchart 配置项

  let _vm

  export default {
    props: ['noRoot'],
    components: {},
    data() {
      return {}
    },
    watch: {
    },
    computed: {
      Cgraph: function () {
        return this.$store.getters.component_graph
      }
    },
    mounted() {
      _vm = this
      this.init()
    },
    methods: {
      init() {
        const vm = this
        vm.$store.state.component_chart = new NetChart({
          container: document.getElementById('component_chart'),
          area: {},
          style: {
            nodeLabel: zoom.Zstyle.nodeLabel,// 节点label的显示样式,
            linkLabel: zoom.Zstyle.linkLabel,// 线的label显示样式
            // linkLengthAutoScaling: zoom.Zstyle.linkLengthAutoScaling,
            // linkLengthExtent: zoom.Zstyle.linkLengthExtent,
            nodeStyleFunction: nodeStyle,// 节点样式与配置的回调
            linkStyleFunction: linkStyle// 关系样式与配置的回调
          },
          events: {
            onDoubleClick: function (data) {
              vm.$store.dispatch('clear', ['component_root', 'component_graph', 'component_chart'])
              if (data.clickNode) {
                vm.$router.push({name: 'entity_manage_entity_detail', params: {id: data.clickNode.data.id}})
              } else if (data.clickLink) {
                vm.$router.push({name: 'entity_manage_link_detail', params: {id: data.clickLink.data.id}})
              }
            }
          },
          info: {
            enabled: true,
            nodeContentsFunction: function (data, item) {
              let show = data.data ? data.data : data
              let html = '<div class="chart_tooltip"><h3>名称：' + show.name + '</h3>'
              if (show.label) html += '<p>类型：' + show.label + '</p>'
              for (let p in show.properties) {
                html += '<p>' + p + '：' + show.properties[p] + '</p>'
              }
              html += '</div>'
              return html
            },
            linkContentsFunction: function (data, item) {
              let label = data.label ? data.label : data.name
              let html = '<div class="chart_tooltip"><h3>label：' + label + '</h3>'
              for (let p in data.properties) {
                html += '<p>' + p + '：' + data.properties[p] + '</p>'
              }
              html += '</div>'
              return html
            }
          },
          data: {
            dataFunction: function (nodeList, success, error) {
              let nodes = []
              let links = []

              if (vm.Cgraph) {
                nodes = graph.getNode(vm.Cgraph)
                links = graph.getLink(vm.Cgraph)
              }
              console.log('nodes', nodes)
              success({'nodes': nodes, 'links': links})
            }
          }
        })
      }
    }
  }

  function linkStyle(link) {
    let label = link.data.label ? link.data.label : link.data.name
    link.label = label
    link.toDecoration = 'arrow'
  }

  function nodeStyle(node) {
//    if (!_vm.$store.state.component_root && !_vm.noRoot) return false

    let data = node.data.data ? node.data.data : node.data
    node.label = data.name

    if (!_vm.noRoot && data.id === _vm.$store.getters.component_root.id) {
      node.fillColor = 'orange'
    } else {
      node.fillColor = 'white'
      node.lineColor = _vm.$store.state.node_colors[node.data.label ? node.data.label : node.data.name]
    }
  }
</script>

<style></style>
