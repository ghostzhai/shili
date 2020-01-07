<template>
  <div class="container overf-hidden">
    <a-layout class="a-l">
      <a-layout-header class="a-l-header">
        <a-row type="flex" justify="start">
          <a-col :span="5"><b>本体列表</b></a-col>
          <a-col :span="15" v-if="current_entity"><b>{{current_entity.name}}</b></a-col>
        </a-row>
      </a-layout-header>
      <a-layout>
        <a-layout-sider width="250" class="overf-hidden-lie"
                        breakpoint="lg"
                        collapsedWidth="0">
          <a-menu v-model="current" mode="inline" :style="{ height: '100%', borderRight: 0}">
            <a-menu-item key="search">
              <a-input-search
                placeholder="输入搜索文本"
                style="width: 200px"
                v-model="searchStr"/>
            </a-menu-item>
            <a-menu-item v-for="(item, $index) in all_entity"
                         :key="$index.toString()"
                         @click="searchTheEntity(item, $index.toString())">
              <a-badge status="success"/>
              {{item.name}}
            </a-menu-item>
          </a-menu>
        </a-layout-sider>
        <a-layout-content>
          <div class="pd-20">
            <a-row>
              <a-col :span="23">
                <a-button type="dashed" class="w-100" icon="plus" @click="Mentity = true">添加</a-button>
              </a-col>
              <a-col :span="1">
                <a-button type="primary" icon="search" style="float: right"
                          @click="$router.push({name: 'search', params: {type: 'entity'}})"></a-button>
              </a-col>
            </a-row>
            <entity-card :nodes="nodes" class="pd-t-20"></entity-card>
          </div>
        </a-layout-content>
      </a-layout>
      <a-row style="border-top: 1px solid #ebedf0;height:30px;"><br></a-row>
    </a-layout>

    <entity-modal :visible.sync="Mentity" @close="reloadData"></entity-modal>
  </div>
</template>

<script>
  import {graph} from '@/util/index' // graph数据处理工具类
  import entityCard from '@/components/entityCard'
  import entityModal from '@/components/chartComponents/entityModal'

  export default {
    components: {entityCard, entityModal},
    data() {
      return {
        current: ['search'],
        current_entity: null,
        searchStr: '',
        searchEntity: '',
        Mentity: false,
        showAdd: true,
        nodes: []
      }
    },
    computed: {
      all_entity: function () {
        if (this.$store.state.all_node && this.$store.state.all_node.vertexlabels) {
          var entityList = this.$store.state.all_node.vertexlabels
          let searchInputValue = this.searchStr
          //如果存在，根据条件过滤
          if (searchInputValue) {
            return entityList.filter(function (daily) {
              return String(daily.name).indexOf(searchInputValue) > -1
            })
          }
          // 如果不存在，整体返回
          return entityList
        }
      }
    },
    methods: {
      searchTheEntity(entity, index) {
        const vm = this
        vm.current = [index]
        vm.current_entity = entity
        vm.$store.dispatch('getAllGraph', 'g.V().hasLabel("' + entity.name + '")').then(function () {
          vm.nodes = graph.getNode(vm.$store.state.all_graph)
        })
      },
      reloadData() {
        this.Mentity = false
        this.nodes = []
        this.current_entity = null
        this.current = ['search']
      }
    }
  }
</script>

<style>
  .ant-card-hoverable:hover {
    border-color: #40a9ff;
  }

  .ant-card-meta-detail :hover {
    color: #1890FF;
  }

  .a-l {
    background: #fff;
  }

  .ant-layout.ant-layout-has-sider > .ant-layout, .ant-layout.ant-layout-has-sider > .ant-layout-content {
    background-color: rgba(249, 250, 251, 0.6);
  }

  .ant-layout-content {
  / / background-color: red;
  }

  .a-l-header {
    background: #fff;
    padding: 0 25px;
    border-bottom: 1px solid #ebedf0;
    line-height: 50px;
    height: 50px;
  }

  .a-l-header b {
    font-weight: 600;
    color: #666;
  }

  .overf-hidden-lie {
    background: #fff;
    /*text-transform: capitalize;*/
    overflow: auto;
    overflow-x: hidden;
  }

  .overf-hidden {
    overflow: hidden;
  }
</style>
