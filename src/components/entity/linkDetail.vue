<template>
  <div class="container">
    <third-layout :title="link.properties ? link.properties.name ? link.properties.name : link.label : ''" :image="image">
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
                  <a-button @click="deleteLink">删除</a-button>
                  <chart :noRoot="true"></chart>
                </a-card>
              </a-col>
              <a-col :span="12" style="width: 100%">
                <a-row >
                  <a-card id="link" class="layout-panel">
                      <span slot="title">
                        <a-icon type="gateway"/>
                        source
                      </span>
                    <entity-card :nodes="[node.source]"></entity-card>
                  </a-card>
                </a-row>
                <a-row>
                  <a-card id="link" class="layout-panel">
                      <span slot="title">
                        <a-icon type="gateway"/>
                        target
                      </span>
                    <entity-card :nodes="[node.target]"></entity-card>
                  </a-card>
                </a-row>
              </a-col>
            </a-row>
            <a-card id="history" class="layout-panel">
              <span slot="title">
                <a-icon type="gateway"/>
                历史
              </span>
              <history-table :type="'link'"></history-table>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card id="properties" class="layout-panel panel-gray" style="height: 100%;">
          <span slot="title">
            <a-icon type="info-circle"/>
            属性
          </span>
              <a-button type="default" slot="extra" icon="edit" @click="editProperties"/>


              <div class="root-information">
                <property-list :properties="properties" :config="proConfig" @delete_prop="reloadProperties"></property-list>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </third-layout>

    <!-- 修改关联的属性 -->
    <link-edit-modal :visible.sync="MeditLink" :config="linkConfig" @close="hidePopup()"></link-edit-modal>
  </div>
</template>

<script>
  import historyTable from '@/components/common/historyTable'
  import chart from '@/components/common/chart'
  import thirdLayout from '@/components/common/thirdLayout'
  import linkEditModal from '@/components/chartComponents/linkEditModal'
  import entityCard from '@/components/entityCard'
  import propertyList from '@/components/common/propertyList'

  import {graph} from '@/util/index'

  export default {
    components: {chart, thirdLayout, linkEditModal, entityCard, historyTable, propertyList},
    data() {
      return {
        id: '',
        image: '',
        current: ['graph'],
        linkConfig: {},
        MeditLink: false,
        source: [],
        target: [],
        graph: null,
        link: {},
        properties: [],
        proConfig: null
      }
    },
    created() {
      this.id = this.$route.params.id
      this.init()
    },
    beforeDestroy() {
      this.$store.dispatch('clear', ['component_root', 'component_graph', 'component_chart'])
    },
    computed: {
      //      'graph': function () {
      //        return this.$store.state.component_graph ? this.$store.state.component_graph.graph : {}
      //      },
      //      'link': function () {
      //        console.log('this.graph', this.graph)
      //        if (!this.graph) return {}
      //        return this.graph ? this.graph.edges[0] : {}
      //      },
      'node': function () {
        let source = {}, target = {}
        let fromId = this.link.outV
        let toId = this.link.inV
        let nodes = this.graph ? this.graph.vertices : []
        nodes.forEach((v) => {
          v.id === fromId ? source = v : target = v
        })

        return {
          source: source,
          target: target
        }
      }
    },
    methods: {
      init() {
        const vm = this

        this.$store.dispatch('getComponentLink', this.id).then(() => {
          vm.graph = vm.$store.getters.component_graph ? vm.$store.getters.component_graph.graph : {}
          vm.link = vm.graph ? vm.graph.edges[0] : {}
          setTimeout(function () {
            vm.$store.state.component_chart.reloadData()
          }, 100)
          vm.properties = getProperties(vm)
          vm.proConfig = {
            id: vm.id,
            label: vm.link.label,
            type: 'link'
          }
        })
        this.$store.dispatch('getChangeHistoryById', {id: this.id, gid: g_id})
      },
      editProperties() {
        this.MeditLink = true
        this.linkConfig = {
          id: this.id,
          label: this.link.label,
          properties: this.link.properties
        }
      },
      deleteLink() {
        const vm = this
        this.$confirm({
          title: '确定要删除吗？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            vm.$store.dispatch('deleteLink', vm.id).then((bool) => {
              if (bool) {
                vm.$router.push({name: 'entity_manage'})
              }
            })
          }
        })
      },
      anchor(value) {
        this.$el.querySelector('#' + value.key).scrollIntoView()
      },
      reloadProperties() {
        const vm = this
        this.properties = getProperties(this)
        setTimeout(function () {
          vm.$store.state.component_chart.reloadData()
        }, 100)
      },
      hidePopup() {
        this.reloadProperties()
        this.MeditLink = false
      }
    }
  }

  function getProperties(that) {
    let root = that.link
    let properties = root ? root.properties : {}
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
