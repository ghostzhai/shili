<template>
  <div class="component-container">
    <div id="chart" style="width: 100%;height: 100%"></div>

    <a-dropdown :visible="dropdown.show"
                :trigger="['click']"
                style="position: absolute;z-index: 1"
                :style="{'left': dropdown.x, 'top': dropdown.y}">
      <a class="ant-dropdown-link" href="#"/>
      <a-menu slot="overlay">
        <a-menu-item v-if="clickTarget.type === 'node'" key="2" @click="newLink">新建关联</a-menu-item>
        <a-menu-item v-if="clickTarget.type === 'node'" key="0" @click="editEntity">修改实体</a-menu-item>
        <a-menu-item v-if="clickTarget.type === 'link'" key="3" @click="editLink">修改关联</a-menu-item>
        <a-menu-item v-if="clickTarget.type === 'node'" key="1" @click="deleteEntity">删除实体</a-menu-item>
        <a-menu-item v-if="clickTarget.type === 'link'" key="4" @click="deleteLink">删除关联</a-menu-item>
      </a-menu>
    </a-dropdown>

    <!-- 左侧显示的节点或者关联的详情 -->
    <drawer :visible.sync="drawer.show" :config="drawer" @close="hidePopup()"></drawer>

    <!-- 编辑实体弹出框 -->
    <entity-edit-modal :visible.sync="Mentity" :config="entityConfig" @close="hidePopup()"></entity-edit-modal>

    <!-- 新建关联的弹出框 -->
    <link-modal :visible.sync="MnewLink" :config="newLinkConfig" @close="hidePopup()"></link-modal>

    <!-- 修改关联的弹出框 -->
    <link-edit-modal :visible.sync="MeditLink" :config="editLinkConfig" @close="hidePopup()"></link-edit-modal>
  </div>
</template>

<script>
  import drawer from '@/components/chartComponents/drawer'
  import entityEditModal from '@/components/chartComponents/entityEditModal'
  import linkModal from '@/components/chartComponents/linkModal'
  import linkEditModal from '@/components/chartComponents/linkEditModal'
  import {graph, zoom} from '@/util/index' // zoomchart 配置项
  const NetChart = window.NetChart

  let chart // 定义全局的zoomChart对象
  let _vm // 定义全局vue对象

  export default {
    components: {drawer, entityEditModal, linkModal, linkEditModal},
    data() {
      return {
        Mentity: false,
        MnewLink: false,
        MeditLink: false,
        drawer: {show: false},
        dropdown: {// 下拉菜单的样式配置
          show: false,
          x: null,
          y: null
        },
        entityConfig: {},
        newLinkConfig: {},
        editLinkConfig: {},
        clickTarget: {}// 当前点击的是节点还是线
      }
    },
    beforeDestroy() {
      this.$store.dispatch('clear', ['root', 'refresh_graph', 'chart'])
    },
    watch: {
      'Croot.id': {
        handler(nv, ov) {
          _vm = this
          const vm = this
          if (this.$store.state.chart) {
            setTimeout(function () {
              vm.$store.state.chart.reloadData()
            }, 100)
          } else {
            this.init()
          }
        },
        deep: true
      }
    },
    computed: {
      Croot: function () {
        return this.$store.getters.root
      },
      Cgraph: function () {
        return this.$store.getters.refresh_graph
      },
      Cclasses: function () {
        let types = graph.getNodeTypes(this.$store.state.all_node)
        let nodes = graph.getNode(this.$store.getters.refresh_graph)
        let classes = []
        let hasTypes = []
        nodes.forEach((v, i) => {
          hasTypes.indexOf(v.label) === -1 ? hasTypes.push(v.label) : v
        })
        types.forEach((v, i) => {
          if (hasTypes.indexOf(v) > -1)
            classes.push({
              className: v,
              style: {radius: 20, fillColor: 'white', lineColor: this.$store.state.node_colors[v]}
            })
        })
        return classes
      }
    },
    methods: {
      hidePopup() {
        hidePopup()
      },
      editEntity() {
        let target = this.clickTarget.data.data ? this.clickTarget.data.data : this.clickTarget.data
        this.dropdown.show = false
        this.Mentity = true
        this.entityConfig = {
          id: this.clickTarget.data.id,
          label: target.label,
          properties: target.properties
        }
      },
      deleteEntity() {
        const vm = this
        this.dropdown.show = false
        this.$confirm({
          title: '确定要删除吗？',
          content: '删除节点，将删除相应的关联',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            vm.$store.dispatch('deleteNode', vm.clickTarget.data.id).then((data) => {
              vm.$store.dispatch('refreshGraph', vm.$store.state.graph_state).then(() => {
                setTimeout(function () {
                  vm.$store.state.chart.reloadData()
                }, 100)
              })
            })
          }
        })
      },
      newLink() {
        let target = this.clickTarget.data.data ? this.clickTarget.data.data : this.clickTarget.data
        this.dropdown.show = false
        this.MnewLink = true
        this.newLinkConfig = {
          id: this.clickTarget.data.id,
          label: target.label
        }
      },
      editLink() {
        let target = this.clickTarget.data.data ? this.clickTarget.data.data : this.clickTarget.data
        this.dropdown.show = false
        this.MeditLink = true
        this.editLinkConfig = {
          id: this.clickTarget.data.id,
          label: this.clickTarget.data.label,
          properties: target.properties
        }
      },
      deleteLink() {
        const vm = this
        this.dropdown.show = false
        this.$confirm({
          title: '确定要删除吗？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            vm.$store.dispatch('deleteLink', vm.clickTarget.data.id).then(() => {
              vm.$store.dispatch('refreshGraph', vm.$store.state.graph_state).then(() => {
                setTimeout(function () {
                  vm.$store.state.chart.reloadData()
                }, 100)
              })
            })
          }
        })
      },
      init() {
        const vm = this
        // nodeClasses: vm.Cclasses,
        vm.$store.state.chart = new NetChart({
          container: document.getElementById('chart'),
          area: {},
          legend: {
            enabled: true,
            margin: 20
          },
          style: {
            nodeLabel: zoom.Zstyle.nodeLabel,// 节点label的显示样式,
            linkLabel: zoom.Zstyle.linkLabel,// 线的label显示样式
            // linkLengthAutoScaling: zoom.Zstyle.linkLengthAutoScaling,
            // linkLengthExtent: zoom.Zstyle.linkLengthExtent,
            nodeStyleFunction: nodeStyle,// 节点样式与配置的回调
            linkStyleFunction: linkStyle// 关系样式与配置的回调
          },
          info: {
            enabled: true,
            nodeContentsFunction: function (data, item) {
              let show = data.data ? data.data : data
              let html = '<div class="chart_tooltip"><h3>名称：' + show.name + '</h3>'
              html += '<p>类型：' + show.label + '</p>'
              for (let p in show.properties) {
                let p_value = show.properties[p]
                let isMedia = graph.isMedia(vm.$store.state.all_properties.propertykeys, p)
                let user_data = graph.getUser_data(vm.$store.state.all_properties.propertykeys, p)
                isMedia ? p_value = '{多媒体-' + user_data.type + '}' : p_value
                html += '<p>' + p + '：' + p_value + '</p>'
              }
              html += '</div>'
              return html
            },
            linkContentsFunction: function (data, item) {
              let html = '<div class="chart_tooltip"><h3>label：' + data.label + '</h3>'
              for (let p in data.properties) {
                let p_value = data.properties[p]
                let isMedia = graph.isMedia(vm.$store.state.all_properties.propertykeys, p)
                let user_data = graph.getUser_data(vm.$store.state.all_properties.propertykeys, p)
                isMedia ? p_value = '{多媒体-' + user_data.type + '}' : p_value
                html += '<p>' + p + '：' + p_value + '</p>'
              }
              html += '</div>'
              return html
            }
          },
          events: {
            onClick: function (event) {
              if (event.clickNode) {
                vm.drawer.show = true
                vm.drawer.type = 'node'
                vm.drawer.data = event.clickNode.data
              } else if (event.clickLink) {
                vm.drawer.show = true
                vm.drawer.type = 'link'
                vm.drawer.data = event.clickLink.data
              } else {
                hidePopup()
              }
              event.preventDefault()
            },
            onRightClick: function (event, args) {// 右键事件
              vm.dropdown.show = true
              vm.dropdown.x = event.pageX + 'px'
              vm.dropdown.y = event.pageY + 'px'
              if (args.clickNode) {
                vm.clickTarget.type = 'node'
                vm.clickTarget.data = args.clickNode.data
              } else if (args.clickLink) {
                vm.clickTarget.type = 'link'
                vm.clickTarget.data = args.clickLink.data
              } else {
                hidePopup()
              }
              event.preventDefault()
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
              success({'nodes': nodes, 'links': links})
            }
          }
        })
        document.oncontextmenu = function () {
          return false
        }
      }
    }
  }

  function hidePopup() {
    _vm.dropdown.show = false // 关闭右键菜单
    _vm.drawer.show = false // 关闭节点或关联的详情
    _vm.MnewLink = false // 关闭关联模态框
    _vm.Mentity = false // 关闭实体模态框
    _vm.MeditLink = false // 关闭编辑关联模态框
  }

  function linkStyle(link) {
    link.label = link.data.label
    link.toDecoration = 'arrow'
  }

  function nodeStyle(node) {
    if (!_vm.$store.getters.root) return false
    let data = node.data.data ? node.data.data : node.data
    node.label = data.name
    if (data.id === _vm.$store.getters.root.id) {
      node.fillColor = 'orange'
    } else {
      node.fillColor = 'white'
      node.lineColor = _vm.$store.state.node_colors[node.data.label]
    }
  }
</script>

<style>
</style>
