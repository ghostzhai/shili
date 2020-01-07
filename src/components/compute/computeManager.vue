<template>
  <div class="container">
    <!--导入-->
    <import-modal :visible.sync="showImportModal" @close="hideModal"></import-modal>
    <second-layout :title="'子图管理'" :image="image" :breadcrumb="breadcrumb">
      <a-layout slot="tabs" class="ant-tabs pd-t-20">
        <a-layout-header class="a-l">

          <a-row type="flex" justify="start" class="a-1-1">
            <a-col :span="22"><b>
              <a-icon type="file-text"/>&nbsp;子图管理</b></a-col>
            <a-col :span="2">
              <a-button @click="showImportModal = true">导入</a-button>
            </a-col>
          </a-row>
        </a-layout-header>
        <a-layout-content class="a-l pd-20">
          <!--这里加个div 滚动条 要不手机端横向表都看不到了-->
          <div style="overflow: auto">
            <!--{{dataSource&&dataSource[0]}}-->
            <a-table bordered :dataSource="dataSource" :columns="columns" :pagination="false" size="small"
                     :scroll="{ y: 240 }">
              <span slot="Xx" slot-scope="text, record, index">{{index + 1}}</span>
              <span slot="graphName" slot-scope="text, record, index">

                <a-tooltip placement="bottom">
                  <template slot="title">
                      <span>{{record.query}}</span>
                  </template>
                  <a @click="openSubGraph(record)">{{record.graphName}}</a>
                </a-tooltip>
              </span>
              <span slot="Date" slot-scope="text, record, index">{{text | formatDate}}</span>
              <template slot="operation" slot-scope="text, record, index">
                <a-button type="primary" @click="exportZT(record, index)" size="small">导出</a-button>
                <a-button type="primary" @click="gotoCheck(record)" size="small">查询</a-button>
                <a-button type="primary" @click="TzHistory(record, index)" size="small">历史备份</a-button>
                <a-button type="primary" @click="deleteZT(record, index)" size="small">删除</a-button>
              </template>
            </a-table>
          </div>
        </a-layout-content>

      </a-layout>
    </second-layout>
    <a-modal
      title="备份子图"
      :visible="TzHistoryVisible"
      @ok="TzHistoryOK"
      @cancel="TzHistoryVisible = false"
    >
      <p>
        名称:
        <a-input v-model="TzHistoryComment" placeholder=""/>
      </p>
    </a-modal>
  </div>
</template>

<script>
  import secondLayout from '@/components/common/secondLayout'
  import importModal from '@/components/compute/importModal'
  import image from '@/assets/image/peitu-04.svg'
  import formatDate from '@/util/formatDate'

  const columns = [
    {
      title: '序号',
      dataIndex: 'Xx',
      width: 50,
      scopedSlots: {customRender: 'Xx'}
    }, {
      title: '名称',
      dataIndex: 'graphName',
      width: 100,
      scopedSlots: {customRender: 'graphName'}
    }, {
      title: '主图',
      width: 100,
      dataIndex: 'pGraph'
    }, {
      //   title: '语句',
      //   dataIndex: 'query',
      //   width:'200'
      // }, {
      title: '创建时间',
      width: 100,
      dataIndex: 'createTime',
      scopedSlots: {customRender: 'Date'}
    }, {
      title: '操作',
      width: 150,
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'}
    }]
  export default {
    components: {secondLayout, importModal},
    data() {
      return {
        columns,
        showExportModal: false,
        showImportModal: false,
        image,
        TzHistoryComment: '',
        TzHistoryTemp: null,
        TzHistoryVisible: false,
        breadcrumb: [
          {
            path: 'compute_create',
            breadcrumbName: '计算',
            url: 'compute_create'
          }, {
            path: 'manage',
            breadcrumbName: '子图管理'
          }]
      }
    },
    created() {
      this.$store.dispatch('computeZT_read')
    },
    filters:{
      formatDate(time){
        var data = new Date(time);
        return formatDate(data,'yyyy-MM-dd');
      }
    },
    computed: {
      'dataSource': function () {
        return this.$store.state.zt_list ? this.$store.state.zt_list.data : []
      }
    },
    methods: {
      openSubGraph(record){
        window.open(`/#/compute/subgraph/${record.id}`)
      },
      hideModal(params) {
        if (params) {
          this.$store.dispatch('computeZT_import', params)
        }
        this.showImportModal = false
      },
      exportZT(item) {
        window.open(`${graph_api}/graph/exportGraph?id=${item.id}&isSubg=${item.isSubg}`);
      },
      TzHistory(item) {
        this.TzHistoryTemp = {
          gid: item.graphId,
          isSubg: item.isSubg,
          type: 'form',
          // comment: 'aaa'
        }
        this.TzHistoryComment = ''
        this.TzHistoryVisible = true
      },
      TzHistoryOK() {
        if (this.TzHistoryComment) {
          this.TzHistoryTemp.comment = this.TzHistoryComment;
          this.$store.dispatch('computeZT_backup', this.TzHistoryTemp).then((data) => {
            this.TzHistoryVisible = false
          })
        }
      },
      deleteZT(item, index) {
        const vm = this
        this.$confirm({
          title: '确认删除',
          content: '您确定要删除吗？',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            vm.$store.dispatch('computeZT_delete', {gid: item.graphId}).then((data) => {
              vm.$store.dispatch('computeZT_read')
            })
          },
          onCancel() {
          }
        })

      },
      gotoCheck(item) {
        computed_str = item.query
        computed_name = item.graphName
        this.$router.push({path: '/search/entity'})
      }
    }
  }
</script>

<style scoped>
  .a-l {
    background: #fff;
  }

  .ant-layout-header {
    padding: 0;
  }

  .a-1-1 {
    line-height: 50px;
    padding: 0 26px;
    border-bottom: 1px solid #ebedf0;
  }
</style>
