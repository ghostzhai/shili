<template>
  <div class="container">
    <!--生成子图-->
    <export-modal :visible.sync="showExportModal" @close="hideModal" :rulesMs="rulesMs"></export-modal>
    <!--导入模态窗-->
    <import-modal :visible.sync="showImportModal" @close="hideModal"></import-modal>
    <second-layout :title="title" :image="image" :breadcrumb="breadcrumb">
      <a-layout slot="tabs" class="ant-tabs   pd-t-20">
        <a-layout-header class="a-l">
          <a-row type="flex" justify="start" class="a-1-1"><b>
            <a-icon type="file-text"/>&nbsp;子图生成</b></a-row>
        </a-layout-header>
        <a-layout-content class="a-l a-1-01">
          <a-row class="pd-12-width">
            <a-col :span="8">
              <a-row type="flex" justify="space-between" class="mg-b-20">
                <a-col :span="6"><span style="line-height: 32px">规则列表</span></a-col>
                <a-col>
                  <a-button @click="clearAdd">新增</a-button>
                </a-col>
                <a-col>
                  <a-button @click="openExportModal">导出</a-button>
                </a-col>
                <a-col>
                  <a-button type="primary" @click="openImportModal">导入</a-button>
                </a-col>
              </a-row>
              <a-row class="table-box">
                <!--<compute-table :tableData="tableData" :count="count"></compute-table>-->

                <a-table class="table-box" bordered :dataSource="tableData" size="small" :columns="columns"
                         :pagination="false" :scroll="{ y: 240 }">
                  <template slot="name" slot-scope="text, record">

                  </template>
                  <template slot="operation" slot-scope="text, record">
                    <a-button type="dashed" size="small" @click="deleteRule(record)">删除</a-button>
                    <a-button type="dashed" size="small" @click="selectRule(record)">详情</a-button>
                  </template>
                </a-table>

              </a-row>
            </a-col>
            <a-col :span="12" class="zitu-zuo-box">
              <a-row class="zitu-you-box">
                <a-col><span>规则名称</span></a-col>
                <a-col>
                  <a-input placeholder="请输入规则名称" v-model="rulesMc"/>
                </a-col>
                <a-col :span="4"></a-col>
              </a-row>
              <a-row class="zitu-you-box">
                <a-col>
                  <a-button @click="testResult">测试</a-button>
                </a-col>
              </a-row>
              <relation-created :links="links" @clear="clearResult" @created="getResult"></relation-created>
              <a-row class="zitu-you-box">
                <a-col><span>规则模式</span></a-col>
                <a-col>
                  <a-textarea placeholder="请输入规则模式" :autosize="{ minRows: 2, maxRows: 6 }" v-model="rulesMs" disabled/>
                </a-col>
                <a-col :span="4"></a-col>
              </a-row>
              <a-row class="zitu-you-box">
                <a-col><span>测试结果</span></a-col>
                <a-col v-if="isShow">
                  <json-view :json="textResult"></json-view>
                </a-col>
              </a-row>
              <a-row class="zitu-you-box">
                <a-col>
                  <a-button type="primary" @click="handleTz">生成子图</a-button>
                </a-col>
                <a-button type="primary" class="mg-r-15" @click="handleAddSave">保存</a-button>
              </a-row>
            </a-col>
          </a-row>
        </a-layout-content>
      </a-layout>
    </second-layout>
  </div>
</template>

<script>
  import {notification} from 'ant-design-vue'
  import secondLayout from '@/components/common/secondLayout'
  import computeTable from '@/components/compute/computeTable'
  import exportModal from '@/components/compute/exportModal'
  import importModal from '@/components/compute/importModal'
  import relationCreated from '@/components/compute/relationCreatedComputed';
  import ExportModal from "./exportModal";
  import image from '@/assets/image/peitu-04.svg'
  import {jsonView} from 'jsonview-vue';

  const dataSource = [{
    id: '11111',
    key: '0',
    type: '子图生成',
    name: 'Edward King 0',
    relation: '32',
    regex: '',
    gremlin: '',
  }]
  export default {
    components: {ExportModal, secondLayout, computeTable, importModal, exportModal, jsonView, relationCreated},
    data() {
      return {
        idAdd: true, //  是否是新增
        selectID: '', // 选中表格的ID
        image,
        columns: [{
          title: '名称',
          width: 100,
          dataIndex: 'name',
          key: 'name'
        }, {
          title: '操作',
          width: 100,
          dataIndex: 'operation',
          key: 'operation',
          scopedSlots: {customRender: 'operation'},
        }],
        showExportModal: false,
        showImportModal: false,
        count: 0,
        title: '子图生成',
        activeKey: 'entity',
        breadcrumb: [
          {
            path: 'visualization',
            breadcrumbName: '计算',
            url: 'entity_visualization'
          }, {
            path: 'entity',
            breadcrumbName: '子图生成'
          }],
        rulesMc: '',
        rulesMs: '',
        graphName: '',
        links: [],
        ceResult: '', // 测试结果
        graphData: {},
        isShow: false
      }
    },
    computed: {
      'tableData': function () {
        return this.$store.state.all_rules_list ? this.$store.state.all_rules_list.data : []
      },
      'textResult': function () {
        return this.$store.state.text_res ? this.$store.state.text_res : []
      }
    },
    created() {
      this.$store.dispatch('getAllRules', {type: '子图生成'})
    },
    methods: {
      selectRule(row) {
        this.rulesMc = row.name
        this.rulesMs = row.regex
        this.idAdd = false
        this.selectID = row.id
        this.$store.state.text_res = []

        let reg = new RegExp("(?<=')[^(^)^,]*(?=')", 'g')
        this.links = row.regex.match(reg)
      },
      testResult() {
        const vm = this
        if (vm.rulesMs == '') {
          this.$message.warning('请输入规则模式');
          this.$store.state.text_res = []
          vm.isShow = false
        }
        if (vm.rulesMs) {
          this.$store.dispatch('text_result', vm.rulesMs)
          vm.isShow = true
        }
      },
      handleTz() {
        const vm = this
        vm.showExportModal = true
      },
      deleteRule(record) {
        const vm = this
        vm.idAdd = false
        this.$confirm({
          title: '确定要删除吗？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            vm.$store.dispatch('delete_Rule', record.id)
              .then(() => {
                vm.rulesMc = ''
                vm.rulesMs = ''
                vm.idAdd = true
                vm.selectID = ''
              })
          }
        })
        console.log(record)
      },
      handleAddSave() {
        const vm = this
        if (vm.rulesMc == '') {
          this.$message.warning('请输入规则名称');
          return
        }
        if (this.idAdd == true) {
          this.$store.dispatch('saveRules', {name: vm.rulesMc, regex: vm.rulesMs, type: '子图生成'})
          notification.success({
            message: '成功',
            description: '保存成功'
          })
        }
        if (this.selectID) {
          this.$store.dispatch('saveRules', {id: this.selectID, name: vm.rulesMc, regex: vm.rulesMs, type: '子图生成'})
          notification.success({
            message: '成功',
            description: '修改成功'
          })
        }

      },
      openExportModal() {
        // this.showExportModal = true
        var url = ''
        // window.location.href = graph_zjy + '/graphrule/exportRule?type=%E5%AD%90%E5%9B%BE%E7%94%9F%E6%88%90';
        this.$store.dispatch('exportRule', {type: '子图生成'})
          .then(() => {
            url = graph_zjy + '/graphrule/exportRule?type=子图生成'
            try {
              let elemIF = document.createElement('iframe')
              elemIF.src = url
              elemIF.style.display = 'none'
              document.body.appendChild(elemIF)
            } catch (e) {
            }
          })
      },
      openImportModal() {
        this.showImportModal = true
      },
      hideModal(params) {
        if (params) {
          this.$store.dispatch('zitu_import', params)
            .then((data) => {
              this.$confirm({
                title: '导入成功',
                content: JSON.stringify(data),
                async onOk() {
                  window.location.reload()
                }
              });
            })
        }
        this.showExportModal = false
        this.showImportModal = false
      },
      clearAdd() {
        this.idAdd = true
        this.selectID = ''
        this.rulesMc = ''
        this.rulesMs = ''
        this.$store.state.text_res = []
      },
      /* 以下为上传的代码 */
      handleRemove(file) {
        const index = this.fileList.indexOf(file)
        const newFileList = this.fileList.slice()
        newFileList.splice(index, 1)
        this.fileList = newFileList
      },
      beforeUpload(file) {
        //        this.fileList = [...this.fileList, file]
        this.fileList = [file]
        return false
      },
      getResult(result) {
        let links = ""
        result.forEach((v, i) => {
          links += "'" + v + "'"
          if (i < result.length - 1) {
            links += ','
          }
        })
        this.rulesMs = "sub = g.E().hasLabel(" + links + ").subgraph('sub').cap('sub').next()"
      },
      clearResult() {
        this.rulesMs = ''
      }
    },
    mounted() {

    }
  }
</script>

<style scoped>
  .a-1-01 {
    padding: 20px 0 0 20px;
  }

  .pd-12-width .ant-col-12 {
    width: 64%;
  }

  .zitu-you-box {
    padding: 16px 20px;
  }

  .zitu-you-box span {
    line-height: 32px;
  }

  .zitu-you-box button {
    float: right;
  }

  .zitu-zuo-box {
    border-left: 1px solid #ebedf0;
    margin-left: 20px;
  }

  .a-l {
    background: #fff;
  }

  .a-1-1 {
    line-height: 50px;
    padding: 0 26px;
    border-bottom: 1px solid #ebedf0;
  }

  .ant-layout-header {
    padding: 0;
  }
</style>
