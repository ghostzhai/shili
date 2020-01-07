<template>
  <div class="container">
    <third-layout :title="rootProperties[graph_key]" :image="image">
      <div class="slot-content" slot="menus">
        <div class="slot-header">
          <a-menu v-model="current" mode="horizontal" @click="anchor">
            <a-menu-item key="graph">
              <a-icon type="mail"/>
              个图
            </a-menu-item>
            <a-menu-item key="properties">
              <a-icon type="appstore"/>
              属性
            </a-menu-item>
            <a-menu-item key="link">
              <a-icon type="appstore"/>
              关系
            </a-menu-item>
          </a-menu>
        </div>

        <a-row type="flex" justify="start" class="slot-container">
          <a-col :span="18">
            <a-row type="flex" style="flex-flow: column;">
              <a-col :span="12" style="width: 100%">
                <a-card id="graph" class="layout-panel">
              <span slot="title">
                <a-icon type="deployment-unit"/>
                图谱
              </span>
                  <a-button @click="deleteNode">删除</a-button>
                  <a-radio-group v-model="level" slot="extra" @change="onChange">
                    <a-radio-button value="-1">收缩</a-radio-button>
                    <a-radio-button value="0">0度</a-radio-button>
                    <a-radio-button value="1">1度</a-radio-button>
                    <a-radio-button value="2">2度</a-radio-button>
                    <a-radio-button value="3">3度</a-radio-button>
                    <a-radio-button value="4">4度</a-radio-button>
                    <a-radio-button value="+1">展开</a-radio-button>
                  </a-radio-group>

                  <chart></chart>
                </a-card>
              </a-col>
              <a-col :span="12" style="width: 100%">
                <a-card id="link" class="layout-panel">
              <span slot="title">
                <a-icon type="gateway"/>
                关系
              </span>
                  <a-button type="default" slot="extra" icon="plus-circle" @click="newLink"/>

                  <relation-card :linkNodes="linkNodes"></relation-card>
                </a-card>
              </a-col>
            </a-row>
            <a-card id="history" class="layout-panel">
              <span slot="title">
                <a-icon type="gateway"/>
                历史
              </span>
              <history-table :type="'node'"></history-table>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card id="properties" class="layout-panel panel-gray" style="height: 100%;">
          <span slot="title">
            <a-icon type="info-circle"/>
            属性
          </span>
              <a-button type="default" slot="extra" icon="edit" @click="editEntity"/>
              <div class="root-information">
                <property-list :properties="properties" :config="proConfig"
                               @delete_prop="reloadProperties"></property-list>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </third-layout>

    <!-- 新增关联 -->
    <link-modal :visible.sync="Mlink" :config="linkConfig" @close="hidePopup()"></link-modal>

    <!-- 编辑节点属性 -->
    <entity-edit-modal :visible.sync="Mentity" :config="entityConfig" @close="hidePopup()"></entity-edit-modal>
  </div>
</template>

<script>
  import historyTable from '@/components/common/historyTable'
  import chart from '@/components/common/chart'
  import relationCard from '@/components/relationCard'
  import linkModal from '@/components/chartComponents/linkModal'
  import entityEditModal from '@/components/chartComponents/entityEditModal'
  import thirdLayout from '@/components/common/thirdLayout'
  import propertyList from '@/components/common/propertyList'

  import {graph, cm} from '@/util/index'

  export default {
    components: {chart, relationCard, linkModal, entityEditModal, thirdLayout, historyTable, propertyList},
    data() {
      return {
        gurl: 'http://192.168.1.55:8090/util/loadMedia.do?id=6dbd34a4c36d45158c292905e07bec5c&name=oceans.mp4&gid=hugegraph',
        Mlink: false,
        Mentity: false,
        id: '',
        level: '1',
        levelIndex: '1',
        linkConfig: {},
        entityConfig: {},
        current: ['graph'],
        image: '',
        graph_key,
        properties: [],
        proConfig: {}
      }
    },
    beforeCreate() {
      this.$store.dispatch('clear', ['component_root', 'component_graph', 'component_chart'])
    },
    created() {
      this.id = this.$route.params.id
      this.onChange()
    },
    beforeDestroy() {
      this.$store.dispatch('clear', ['component_root', 'component_graph', 'component_chart'])
    },
    computed: {
      'links': function () {
        return graph.getLink(this.$store.getters.component_graph)
      },
      'linkNodes': function () {
        return cm.getLinkNodes(this.$store.getters.component_graph)
      },
      'rootProperties': function () {
        return this.$store.getters.component_root ? this.$store.getters.component_root.properties : {}
      }
    },
    methods: {
      hidePopup() {
        this.Mlink = false
        this.Mentity = false
        this.reloadProperties()
      },
      newLink() {
        this.Mlink = true
        this.linkConfig = {
          id: this.id,
          label: this.$store.getters.component_root.label
        }
      },
      editEntity() {
        this.Mentity = true
        this.entityConfig = {
          id: this.id,
          label: this.$store.getters.component_root.label,
          properties: this.$store.getters.component_root.properties
        }
      },
      onChange() {
        const vm = this
        let levelIndex = parseInt(vm.levelIndex)
        if (vm.level === '-1') {
          if (levelIndex > 0) {
            vm.levelIndex = levelIndex - 1
          }
          vm.level = vm.levelIndex.toString()
        } else if (vm.level === '+1') {
          if (levelIndex < 4) {
            vm.levelIndex = levelIndex + 1
          }
          vm.level = vm.levelIndex.toString()
        } else {
          vm.levelIndex = vm.level
        }

        this.$store.dispatch('getComponentChart', {id: this.id, level: this.levelIndex}).then(() => {
          vm.properties = getProperties(vm)
          vm.proConfig = {
            id: vm.id,
            label: vm.$store.getters.component_root.label,
            type: 'node'
          }
          setTimeout(function () {
            vm.$store.getters.component_chart.reloadData()
          }, 100)
        })
        this.$store.dispatch('getChangeHistoryById', {id: this.id, gid: g_id})
      },
      anchor(value) {
        this.$el.querySelector('#' + value.key).scrollIntoView()
      },
      deleteNode() {
        const vm = this
        this.$confirm({
          title: '确定要删除吗？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            vm.$store.dispatch('deleteNodeRF', vm.id).then((bool) => {
              if (bool) {
                vm.$message.success('删除成功！')
                vm.$router.push({name: 'entity_manage'})
              }
            })
          }
        })
      },
      reloadProperties() {
        const vm = this
        this.properties = getProperties(this)
        setTimeout(function () {
          vm.$store.state.component_chart.reloadData()
        }, 100)
      }
    }
  }

  function getProperties(that) {
    let root = that.$store.getters.component_root
    let properties = root ? root.properties : []
    let returnPro = []
    for (let p in properties) {
      let isMedia = graph.isMedia(that.$store.state.all_properties.propertykeys, p)
      let user_data = graph.getUser_data(that.$store.state.all_properties.propertykeys, p)
      let isRequired = graph.isRequired(root.label, p)
      returnPro.push({
        name: p,
        value: properties[p],
        isMedia: isMedia,
        type: user_data ? user_data.type : null,
        isRequired: isRequired
      })
    }
    return returnPro
  }
</script>

<style></style>
