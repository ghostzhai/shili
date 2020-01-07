<template>
  <div class="container">
    <second-layout :title="'历史管理'" :image="image" :breadcrumb="breadcrumb">
      <a-layout slot="tabs" class="ant-tabs   pd-t-20">
        <a-layout-header class="a-l">
          <a-row type="flex" justify="start" class="a-1-1"><b>
            <a-icon type="file-text"/>&nbsp;历史管理</b></a-row>
        </a-layout-header>

        <a-layout-content class="a-l pd-20">
          <!--这里加个div 滚动条 要不手机端横向表都看不到了-->
          <div style="overflow: auto">
            <a-table bordered :dataSource="dataSource" :columns="columns" :pagination="false" size="small">
              <span slot="Xx" slot-scope="text, record, index">{{index + 1}}</span>
              <span slot="Date" slot-scope="text, record, index">{{record.backuptime | formatDate}}</span>
              <template slot="operation" slot-scope="text, record, index">
                <a-button type="primary" @click="decoverConfirm(record)" size="small">恢复</a-button>
                <a-button type="primary" @click="exportLS(record)" size="small">导出</a-button>
                <a-button type="primary" @click="deleteConfirm(record, index)" size="small">删除</a-button>
              </template>
            </a-table>
          </div>
        </a-layout-content>

      </a-layout>
    </second-layout>
  </div>
</template>

<script>
  import secondLayout from '@/components/common/secondLayout'
  import image from '@/assets/image/peitu-04.svg'
  import formatDate from '@/util/formatDate'

  const columns = [
    {
      title: '序号',
      dataIndex: 'Xx',
      width: 100,
      scopedSlots: {customRender: 'Xx'}
    }, {
      title: '名称',
      width: 250,
      dataIndex: 'comment'
    }, {
      title: '子图',
      width: 150,
      dataIndex: 'gid'
    }, {
      //   title: '类型',
      //   dataIndex: 'Lx'
      // }, {
      title: '备份时间',
      width: 100,
      dataIndex: 'backuptime',
      scopedSlots: {customRender: 'Date'}
    }, {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'}
    }]

  export default {
    components: {secondLayout},
    data() {
      return {
        columns,
        image,
        activeKey: 'entity',
        breadcrumb: [
          {
            path: 'compute_create',
            breadcrumbName: '计算',
            url: 'compute_create'
          }, {
            path: 'history',
            breadcrumbName: '历史管理'
          }]
      }
    },
    created() {
      this.$store.dispatch('computeLS_read')
    },
    computed: {
      'dataSource': function () {
        return this.$store.state.ls_list ? this.$store.state.ls_list.data : []
      }
    },
    filters: {
      formatDate(time) {
        var data = new Date(time);
        return formatDate(data, 'yyyy-MM-dd');
      }
    },
    methods: {
      exportLS(item) {
        window.open(`${graph_api}/graph/exportBackup?id=${item.id}`);
        // this.$store.dispatch('computeLS_export', item.id)
      },
      deleteConfirm(item, index) {
        const vm = this
        this.$confirm({
          title: '这将删除该历史所有数据',
          content: '你还要继续吗？',
          okText: '继续',
          cancelText: '取消',
          onOk() {
            vm.$store.dispatch('computeLS_delete', item).then(function () {
              vm.$store.dispatch('computeLS_read')
            })
          },
          onCancel() {
          }
        })
      },
      decoverConfirm(item) {
        const vm = this
        this.$confirm({
          title: '这将覆盖所有数据',
          content: '要继续吗？',
          okText: '继续',
          cancelText: '取消',
          onOk() {
            vm.$store.dispatch('computeLS_restore', item)
          },
          onCancel() {
          }
        })
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
