<template>
  <div class="container">
    <a-layout>
      <a-layout-header style="background: #fff;border-bottom: 1px solid #ebedf0;">
        <a-row type="flex" justify="start">
          <b>实体导入策略</b>
        </a-row>
      </a-layout-header>
      <a-layout>
        <a-layout-sider width="250" style="background: #fff"
                        breakpoint="lg"
                        collapsedWidth="0">
          <a-menu
            mode="inline"
            style="height: 100%"
          >
            <a-sub-menu :key="index1" v-for="(item,index1) in dataTable">
              <span slot="title"><a-checkbox @change="selectTable(item, $event)">{{item.tableName}}</a-checkbox></span>
              <a-menu-item :key="index2" v-for="(col,index2) in item.cols">{{col.colName}}</a-menu-item>
            </a-sub-menu>
          </a-menu>
        </a-layout-sider>
        <a-layout-content>
          <div class="pd-20">
            <!--item 每个card，既选中的数据库表-->
            <a-card :title="item.tableName"  v-for="(item,index) in selectedTables.data" :key="index"
                    :bordered="false"
                    class="mg-b-20">
              <a-form-item
                label="对应本体"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-select style="width: 100%" v-model="item.vertexId" @change="selectVertex(item)">
                  <a-select-option v-for="vertex in vertexlabels" :value="vertex.id" :key="vertex.id">{{vertex.name}}</a-select-option>
                </a-select>
                <!--<a-input placeholder="Basic usage"/>-->
              </a-form-item>
              <a-form-item
                label="Name"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-tree-select
                  style="width: 100%"
                  treeCheckable
                  v-model="item.InfoName"
                  treeNodeLabelProp="colName"
                  searchPlaceholder='Please select'
                >
                  <a-tree-select-node :value='col.colName' :title='col.colName' :key='col.colName' v-for="col in item.cols">
                  </a-tree-select-node>
                </a-tree-select>
              </a-form-item>
              <a-form-item
                label="Code"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-tree-select
                  style="width: 100%"
                  treeCheckable
                  v-model="item.InfoCode"
                  treeNodeLabelProp="colName"
                  searchPlaceholder='Please select'
                >
                  <a-tree-select-node :value='col.colName' :title='col.colName' :key='col.colName' v-for="col in item.cols">
                  </a-tree-select-node>
                </a-tree-select>
              </a-form-item>
              <a-table v-if="item.vertex" bordered :dataSource="item.vertex" :pagination="false">
                  <a-table-column
                    title="对应到本体"
                    dataIndex="name">
                    <span slot="title" style="color: #1890ff">字段</span>
                  </a-table-column>
                  <a-table-column
                    title="字段"
                    dataIndex="forEntity"
                  >
                    <template slot-scope="text, record, index" v-if="record.name !== '名称'">
                      <a-select style="width: 100%" v-model="record.col" @change="e => handleChange(e, record, selectedTables.data)" :value="record.col">
                        <a-select-option v-for="col in item.cols" :value="col.colName" :key="col.colName">{{col.colName}}</a-select-option>
                      </a-select>
                    </template>
                  </a-table-column>
              </a-table>
            </a-card>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
  import {kg} from '../../api/index'
  import {graph} from '@/util/index' // graph数据处理工具类
  const treeData = [{
    title: 'Node1',
    value: '0-0',
    key: '0-0',
  }, {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
  }]
  export default {
    components: {  },
    data() {
      return {
        dataTable: null,
        // treeData,
        columns: [{
          title: '字段',
          dataIndex: 'colName',
          width: '30%',
          scopedSlots: { customRender: 'colName' },
        }, {
          title: '类型',
          dataIndex: 'colType',
        }, {
          title: '对应到本体',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
        }]
      }
    },
    computed: {
      selectedTables: function () {
        return this.$store.state.import_database.table_page
      },
      vertexlabels: function () {
        return this.$store.state.all_node.vertexlabels
      }
    },
    created() {
      const vm = this
      var databaseInfo = this.$store.state.import_database.database_page   // 第一步连接数据库状态
      if (databaseInfo.status) {
        // 读取数据库表
        kg.get_database({data: databaseInfo.data, type: 'form'}).then((result) => {
          if(result.data.code === 200) {
            vm.dataTable = result.data.data
            const params = {
              status: true,
              clear: false,
              data: {}
            }
            this.$store.dispatch('setImportTable', params)
          }
        })
      }
    },
    methods: {
      selectTable(table, e) {
        const params = {
          status: true,
          clear: false,
          data: table
        }
        this.$store.dispatch('setImportTable', params)
      },
      /**
       * 选中本体
       * @param table
       */
      selectVertex(table) {
        for(var i = 0; i < this.vertexlabels.length; i++) {
          if (table.vertexId === this.vertexlabels[i].id) {
            table.vertexName = this.vertexlabels[i].name
            table.vertex = []
            // 属性
            for(var j = 0; j < this.vertexlabels[i].properties.length; j++) {
              table.vertex.push({
                name: this.vertexlabels[i].properties[j],
                col: '',
              })
            }
          }
        }
      },
      handleChange(value, record, card) {
        // 只为触发刷新
        var tmp = card[0]
        this.$set(card,0,tmp)
      }
    }
  }
</script>

<style scoped>
</style>
