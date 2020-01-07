<template>
  <div class="container">
    <a-layout>
      <a-layout>
        <a-layout-content>
          <div>
            <a-card v-for="(item,index) in projects" :key="index"
                    :bordered="false"
                    class="mg-b-header">
              <a-row type="flex" justify="space-between" class="a-row-card-body">
                <a-col :span="6" class="cen-text">
                  <img :src="image" alt="" style="height:80px;">
                  <div><b>待定...</b></div>
                </a-col>
                <a-col :span="12" class="cen-text">
                  <div class="text-buttom">
                    <a-icon type="link" theme="outlined"/>&nbsp;
                    <b>关系</b>
                  </div>
                </a-col>
                <a-col :span="6" class="cen-text">
                  <img :src="image" alt="" style="height:80px;">
                  <div><b>待定...</b></div>
                </a-col>
              </a-row>
              <a-row type="flex" justify="space-between" class="w-row-card-body">
                <a-col :span="7" ><div class="pd-l-f-10">选择表</div>
                  <a-cascader :options="sourceOption" v-model="item.source.select" @change="onChangeSource(item)" placeholder="请选择" style="width:100%;"/></a-col>
                <a-col :span="7" ><div class="pd-l-f-10">关系类型</div>
                  <a-select style="width: 100%" v-model="item.edge.select" @change="onChangeEdge(item)">
                    <a-select-option :key="link.id" :value="link.id" v-for="link in item.edge.list">{{link.name}}</a-select-option>
                  </a-select>
                </a-col>
                <a-col :span="7" ><div class="pd-l-f-10">选择表</div>
                  <a-cascader :options="item.target.option" v-model="item.target.select" @change="onChangeTarget(item)" placeholder="请选择" style="width:100%;"/></a-col>
              </a-row>
              <div class="pd-20">
                NAME:<a-tree-select
                style="width: 100%"
                treeCheckable
                v-model="item.InfoName"
                treeNodeLabelProp="value"
                searchPlaceholder='Please select'
              >
                <a-tree-select-node :value='table.value' :title='table.label' :key='table.value' v-for="table in item.tables">
                  <a-tree-select-node :value='table.value+"."+col.value' :title='col.label' :key='table.value+"."+col.value' v-for="col in table.children"></a-tree-select-node>
                </a-tree-select-node>
              </a-tree-select>
                CODE:<a-tree-select
                style="width: 100%"
                treeCheckable
                v-model="item.codeName"
                treeNodeLabelProp="value"
                searchPlaceholder='Please select'
              >
                <a-tree-select-node :value='table.value' :title='table.label' :key='table.value' v-for="table in item.tables">
                  <a-tree-select-node :value='table.value+"."+col.value' :title='col.label' :key='table.value+"."+col.value' v-for="col in table.children"></a-tree-select-node>
                </a-tree-select-node>
              </a-tree-select>
                <a-table bordered :dataSource="item.edge.match" :pagination="false">
                  <a-table-column
                    title="对应到本体"
                    dataIndex="graphCol">
                    <span slot="title" style="color: #1890ff">字段</span>
                  </a-table-column>
                  <a-table-column
                    title="字段"
                    dataIndex="rdbCol"
                  >
                    <template slot-scope="text, record, index">
                      <a-cascader :options="item.tables" v-model="record.value" @change="onChangeSource(item)" placeholder="Please select" />
                    </template>
                  </a-table-column>
                </a-table>
              </div>
            </a-card>
            <a-row>
              <a-col :span="24"><a-button type="dashed" class="w-100" icon="plus" @click="addProject">添加</a-button></a-col>
            </a-row>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
  import {kg} from '../../api/index'
  import comImage from '@/assets/image/computed-table.svg'
  import {graph} from '@/util/index' // graph数据处理工具类

  export default {
    components: {  },
    data() {
      return {
        sourceOption: [],  // 级联下拉的数据
        image: comImage
      }
    },
    computed: {
      projects: function() {
        return this.$store.state.import_database.relation_page.data
      },
      tablesStore: function () {
        return this.$store.state.import_database.table_page
      },
      all_link: function () {
        return this.$store.state.all_link
      }
    },
    created() {
      // 处理source的级联选择
      this.sourceOption = getSourceOption(this.$store.state.import_database.table_page.data)
    },
    methods: {
      addProject() {
        var pj = {
          source: {
            tableName: '',
            colName: '',
            vertexName: '',
            vertexId: ''
          },
          target: {
            option: []
          },
          InfoName: '',
          codeName: '',
          edge: {
            list: [],    // 下拉列表
            select: null,
            match: [],
          },
          tables: null
        }
        this.projects.push(pj)
      },
      // 选中边类型
      onChangeEdge(project, g) {
        // 得到当前的关系的target的名字
        var targetVertex = getAbleTargetVertex(project.edge.select, this.all_link.edgelabels)
        project.target.option = getTargetOption(targetVertex, this.tablesStore.data)
        // 得到边的属性
        var edgeProperties = getEdgeProperty(project.edge.select, project.edge.list)
        project.edge.match = getEdgeMatch(edgeProperties)
        // source 和 target 的集合
      },
      // 选中目标表,拼接source和target的表集合
      onChangeTarget(project) {
        var option = project.target.select
        if(option.length === 2) {
          project.target.tableName = option[0]
          project.target.colName = option[1]
          var table1 = project.source.tableName
          var table2 = project.target.tableName
          var tableArr = []
          if(table1 !== table2) {
            tableArr = [table1, table2]
          } else {
            tableArr = [table1]
          }
          debugger
          var tables = getTables(tableArr, this.tablesStore.data)
          project.tables = getSourceOption(tables)
          var vertex = getVertex(project.target.tableName, this.tablesStore.data)
          project.target.vertexName = vertex.vertexName
          project.target.vertexId = vertex.vertexId
        }
      },
      // 选中源表
      onChangeSource(project) {
        var option = project.source.select
        if(option.length === 2) {
          project.source.tableName = option[0]
          project.source.colName = option[1]
          var vertex = getVertex(project.source.tableName, this.tablesStore.data)
          project.source.vertexName = vertex.vertexName
          project.source.vertexId = vertex.vertexId
          project.edge.list = getSourceAbleEdges(project.source.vertexName, this.all_link.edgelabels)
          console.log('edge:', project.edge.list)
        }
      },
    }
  }
  function getTables(tableNames, tables) {
    var tableList = []
    for(var i = 0; i < tableNames.length; i++) {
      for(var j = 0; j < tables.length; j++) {
        if(tableNames[i] === tables[j].tableName) {
          tableList.push(tables[j])
        }
      }
    }
    return tableList
  }
  // 边的数组转为对象
  function getEdgeMatch(propArr) {
    var edgeMatch = []
    for (var i = 0; i < propArr.length; i++) {
      var obj = {
        rdbCol: '',
        graphCol: propArr[i],
        tbl: '',
        value: null
      }
      edgeMatch.push(obj)
    }
    return edgeMatch
  }
  // 取得边的属性数组
  function getEdgeProperty(edgeId, edgeList) {
    var edgePropArr = null
    for (var i = 0; i < edgeList.length; i++) {
      if(edgeId === edgeList[i].id) {
        edgePropArr = edgeList[i].properties
      }
    }
    return edgePropArr
  }
  // 取边类型target的实体类型
  function getAbleTargetVertex(edgeId, edges) {
    var targetVertex = ''
    for(var i = 0; i < edges.length; i++) {
      if(edgeId === edges[i].id) {
        targetVertex = edges[i].target_label
      }
    }
    return targetVertex
  }
  function getTargetOption(targetVertex, tablePageData) {
    var option = []
    var table_page_data = tablePageData
    for(var i = 0; i < table_page_data.length; i++) {
      if(targetVertex === table_page_data[i].vertexName) {
        var item = {
          value: table_page_data[i].tableName,
          label: table_page_data[i].tableName,
          children: [],
        }
        for(var j = 0; j < table_page_data[i].cols.length; j++) {
          var chid = {
            value: table_page_data[i].cols[j].colName,
            label: table_page_data[i].cols[j].colName,
          }
          item.children.push(chid)
        }
        option.push(item)
      }
    }
    return option
  }
  // 获取源对应的实体类型
  function getSourceAbleEdges(vertexName, edges) {
    var sourceEdges = []
    for(var i = 0; i < edges.length; i++) {
      if(vertexName === edges[i].source_label) {
        sourceEdges.push(edges[i])
      }
    }
    return sourceEdges
  }
  // 根据选中表名，获取上一步对应的实体类型
  function getVertex(tableName, tablesData) {
    var vertex = {
      vertexName: '',
      vertexId: ''
    }
    for(var i = 0; i < tablesData.length; i++) {
      if(tableName === tablesData[i].tableName) {
        vertex.vertexName = tablesData[i].vertexName
        vertex.vertexId = tablesData[i].vertexId
      }
    }
    return vertex
  }
  // 组装级联选择的数据结构
  function getSourceOption(tablePageData) {
    var option = []
    var table_page_data = tablePageData
    for(var i = 0; i < table_page_data.length; i++) {
      var item = {
        value: table_page_data[i].tableName,
        label: table_page_data[i].tableName,
        children: [],
      }
      for(var j = 0; j < table_page_data[i].cols.length; j++) {
        var chid = {
          value: table_page_data[i].cols[j].colName,
          label: table_page_data[i].cols[j].colName,
        }
        item.children.push(chid)
      }
      option.push(item)
    }
    return option
  }
</script>

<style>
  .a-content{
    background: gainsboro;
  }
  .cen-text{
    line-height: 50px;
    text-align: center
  }
  .text-buttom{
    border-bottom: 1px dashed #1890FF;
  }
  .mg-b-header {
    background: #fff;
    border: 1px solid #E9E9E9;
    margin-bottom: 16px;
  }
  .mg :hover{
    border: 1px solid red;
  }
  .mg-b-header .ant-card-body{
    padding: 0px;
  }
  .mg-b-header .a-row-card-body {
    background: #F7F9FA;
    border-bottom: 1px solid #ebedf0;
    padding: 20px 10px 0px;
  }
  .w-row-card-body{
    padding: 16px 30px;
  }
  .a-content{
    background: #F7F9FA;
  }
</style>
