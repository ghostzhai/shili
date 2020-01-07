<template>
  <div class="container">
    <layout-modal :visible.sync="showLayoutModal" @close="hideLayout"></layout-modal>
    <a-Divider>向下 滑动 </a-Divider>
    <div style="background: rgba(249, 250, 251, 0.6);padding: 20px 40px;text-align: center">
      <a-alert v-if="resultNum" :message="'查询结果共 ' + resultNum + ' 条'" type="info"/>
    </div>
    <div style="background: rgba(249, 250, 251, 0.6);padding: 20px 40px;text-align: center">
      <a-radio-group v-model="type" buttonStyle="solid" type="card">
        <a-radio-button value="a"><i class="fa fa-table" aria-hidden="true"></i></a-radio-button>
        <a-radio-button value="b"><i class="fa fa-joomla" aria-hidden="true"></i></a-radio-button>
        <a-radio-button value="c"><i class="fa fa-code" aria-hidden="true"></i></a-radio-button>
      </a-radio-group>
    </div>
    <!--方块显示-->
    <entity-card style="background-color: rgba(249, 250, 251, 0.6);padding:20px 40px" v-if="(searchType=='entity' || searchType=='correlation' || searchType=='media') && type == 'a'" :nodes="nodes"></entity-card>
    <div v-if="type == 'a'">
      <search-table v-if="searchType=='path'" :tableData="searchPath"></search-table>
    </div>
    <relation-card class="box-padding" v-if="(searchType=='relation' || searchType=='union')&& type == 'a'" :linkNodes="linkNodes"></relation-card>
    <!--布局显示-->
    <div v-if="type == 'b'" class="pd-t-10 result-card" style="height: 550px">
      <a-button type="dashed" size="small" @click="showLayout">布局</a-button>
      <zoom-chart :noRoot="true"></zoom-chart>
      <!--<layout-graph></layout-graph>-->
    </div>
    <!--数据显示-->
    <div v-if="type == 'c'" class="pd-t-10 box result-card">
      <json-view :json="graphData"></json-view>
    </div>
  </div>
</template>

<script>
  import {graph, cm} from '@/util/index' // graph数据处理工具类
  import layoutModal from '@/components/common/layoutModal'
  import layoutGraph from '@/components/layoutGraph'
  import searchTable from '@/components/table'
  import relationCard from '@/components/relationCard'
  import entityCard from '@/components/entityCard'
  import zoomChart from '@/components/common/chart'
  import { jsonView } from 'jsonview-vue';

  export default {
    name: 'searchResult',
    components: { layoutGraph, jsonView, searchTable, relationCard, entityCard, zoomChart, layoutModal },
    props: {
      'searchType': String,
      'resultNum': Number
    },
    data() {
      return {
        type: 'a',
        showLayoutModal: false  //布局的模态框
      }
    },
    created() {
    },
    computed: {
      nodes: function () {
        return graph.getNode(this.$store.state.all_graph)
      },
      linkNodes: function() {
        return cm.getLinkNodes(this.$store.state.all_graph)
      },
      links: function () {
        return graph.getLink(this.$store.state.all_graph)
      },
      graphData: function () {
        return graph.getGraph(this.$store.state.all_graph)
      },
      searchPath: function () {
        return this.$store.state.search_path
      },
    },
    mounted() {
    },
    methods: {
      showLayout() {
        this.showLayoutModal = true
      },
      hideLayout() {
        this.showLayoutModal = false
      }
    }
  }
</script>
<style>
  .ant-card-hoverable:hover {
    border-color: #40a9ff;
  }
  .card {
    margin-bottom: 16px;
  }
</style>
