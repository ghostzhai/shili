<template>
  <div class="container">
    <second-layout :title="computed_str?'子图查询:\n'+computed_str:title" :image="image" :breadcrumb="breadcrumb" @switch="tabClick">
      <a-tabs slot='tabs' :activeKey="activeKey"  @change="tabClick">
        <a-tab-pane key="entity">
          <span slot="tab">
            <a-icon type="deployment-unit"/>  实体查询
          </span>
          <entity-search></entity-search>
        </a-tab-pane>
        <a-tab-pane  key="relation">
           <span slot="tab">
            <a-icon type="block"/>  关系查询
          </span>
          <relation-search></relation-search>
        </a-tab-pane>
        <a-tab-pane  key="correlation">
          <span slot="tab">
           <a-icon type="link"/>  关联查询
          </span>
          <correlation-search></correlation-search>
        </a-tab-pane>
        <a-tab-pane  key="path">
          <span slot="tab">
            <a-icon type="branches"/>  路径查询
          </span>
          <path-search></path-search>
        </a-tab-pane>
        <a-tab-pane  key="union">
          <span slot="tab">
            <a-icon type="security-scan"/>  联合查询
          </span>
          <union-search></union-search>
        </a-tab-pane>
        <a-tab-pane  key="media">
          <span slot="tab">
            <a-icon type="desktop"/>  多媒体查询
          </span>
          <media-search></media-search>
        </a-tab-pane>
        <a-tab-pane  key="explore">
          <span slot="tab">
            <a-icon type="desktop"/>  路径探寻
          </span>
          <explore-search></explore-search>
        </a-tab-pane>
      </a-tabs>
    </second-layout>
  </div>
</template>

<script>
  import image from '@/assets/image/peitu-01.svg'
  import {graph} from '@/util/index' // graph数据处理工具类
  import entitySearch from '@/components/search/entitySearch'
  import relationSearch from '@/components/search/relationSearch'
  import correlationSearch from '@/components/search/correlationSearch'
  import pathSearch from '@/components/search/pathSearch'
  import unionSearch from '@/components/search/unionSearch'
  import mediaSearch from '@/components/search/mediaSearch'
  import exploreSearch from '@/components/search/exploreSearch'

  import secondLayout from '@/components/common/secondLayout'

  import { store } from 'vuex'
  const menu = {
    entity: '实体查询',
    relation: '关系查询',
    correlation: '关联查询',
    path: '路径查询',
    union: '联合查询',
    media: '多媒体查询',
    explore: '路径探寻'
  }
  export default {
    components: { entitySearch, relationSearch, correlationSearch, pathSearch, unionSearch, mediaSearch, exploreSearch, secondLayout},
    data() {
      return {
        computed_str:computed_str,
        image,
        searchType: 'entity',
        title: '实体查询',
        activeKey: 'entity',
        breadcrumb: [
          {
            path: 'visualization',
            breadcrumbName: '查询',
            url: 'entity_visualization'
          }, {
            path: 'entity',
            breadcrumbName: '实体查询'
          }]
      }
    },
    watch: {
      '$route.params.type': function () {
        this.initTabActive()
      }
    },
    created() {
      this.initTabActive()
    },
    beforeDestroy(){
      computed_str=''
    },
    mounted() {
        // 无用的插件，暂时保留,可查看高级搜索的数据格式
        var textarea = {
          view:"textarea",
          id: "textarea", attributes:{ readonly:true },
          css: "webix_textarea",
          height: "100px",
          labelAlign:"right"
        };

        // 高级搜索的配置项
        var qb = {
          view: "querybuilder",
          id: "querybuilder",
          width: 635,
          fields: [
            { id:"fname", value:"First Name", type:"string" },
            { id:"lname", value:"Last Name",  type:"string" },
            { id:"age",  value:"Age", type:"number" },
            { id:"bdate",  value:"Birth Date", type:"date" }
          ],
          maxLevel: 3
        };
        // 创建高级搜索插件
        // webix.ui({rows: [ qb]}, 'querybuilder');
    },
    methods: {
      handleSearchTypeChange (e) {
        this.searchType = e.target.value
      },
      /**
       * 切换查询方式
       * */
      tabClick(key) {
        this.activeKey = key
        this.title = menu[key]
        this.breadcrumb.splice(1, 1, {path: key, breadcrumbName: menu[key]})
        this.$store.dispatch('setSearchFlag', false)
        this.$store.dispatch('clear', ['component_root', 'component_graph', 'component_chart'])
      },
      /**
       * 路由跳转过来后，选中默认的查询方式
       * */
      initTabActive() {
        var type = this.$route.params.type
        console.log('type:', type)
        switch (type) {
          case 'entity':
            this.activeKey = 'entity'
            break
          case 'path':
            this.activeKey = 'path'
            break
          case 'relation':
            this.activeKey = 'relation'
            break
          case 'correlation':
            this.activeKey = 'correlation'
            break
          case 'media':
            this.activeKey = 'media'
            break
          case 'union':
            this.activeKey = 'union'
            break
          case 'explore':
            this.activeKey = 'explore'
            break
          default:
            break
        }
      }
    }
  }
</script>
