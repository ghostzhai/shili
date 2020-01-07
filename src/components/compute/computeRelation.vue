<template>
  <div class="container">
    <!--导出-->
    <!--<export-modal :visible.sync="showExportModal" @close="hideModal"></export-modal>-->
    <!--导入-->
    <import-modal :visible.sync="showImportModal" @close="hideModal"></import-modal>
    <second-layout :title="title" :image="image" :breadcrumb="breadcrumb">
      <a-layout slot="tabs" class="ant-tabs   pd-t-20 h100">
        <a-layout-header class="a-l">
          <a-row type="flex" justify="start" class="a-1-1"><b>
            <a-icon type="file-text"/>&nbsp;关系补全</b></a-row>
        </a-layout-header>
        <a-layout-content class="a-l pd-20">
          <a-row class="pd-12-width">
            <a-col :span="8">

              <a-row type="flex" justify="space-between" class="mg-b-20">
                <a-col :span="6"><span style="line-height: 32px">规则列表</span></a-col>
                <a-col>
                  <a-button @click="handleAddTable">新增</a-button>
                </a-col>
                <a-col>
                  <a-button @click="openExportModal">导出</a-button>
                </a-col>
                <a-col>
                  <a-button type="primary" @click="openImportModal">导入</a-button>
                </a-col>
              </a-row>
              <a-row class="table-box">
                <!--<compute-table :tableData="tableData" ></compute-table>-->

                <a-table class="table-box" bordered :dataSource="relationTableData" size="small" :columns="columns"
                         :pagination="false" :scroll="{ y: 240 }">
                  <template slot="name" slot-scope="text, record">

                  </template>
                  <template slot="operation" slot-scope="text, record" style="text-align: center">
                    <a-button type="dashed" size="small" @click="delRule(record)">删除</a-button>
                    <a-button type="dashed" size="small" @click="selectRule(record)">详情</a-button>
                  </template>
                </a-table>
              </a-row>
            </a-col>
            <a-col :span="12" class="zitu-zuo-box">
              <a-row class="zitu-you-box">
                <a-col><span>规则名称</span></a-col>
                <a-col>
                  <a-input v-model="rulesMc" placeholder="请输入规则名称"/>
                </a-col>
                <a-col :span="4"></a-col>
              </a-row>
              <relation-computed :entity="editEntity"
                                 @cancel="clearResult"
                                 @created="getResult"></relation-computed>
              <a-row class="zitu-you-box">
                <a-col><span>规则模式</span></a-col>
                <a-col>
                  <a-textarea v-model="regex" placeholder="请输入规则模式" :autosize="{ minRows: 2, maxRows: 6 }" disabled/>
                </a-col>
                <a-col :span="4"></a-col>
              </a-row>
              <a-row class="zitu-you-box" type="flex" justify="space-around" align="middle">
                <a-col :span="5">
                  <span>source</span>
                  <a-input disabled v-model="sourceResult"></a-input>
                </a-col>
                <a-col :span="5">
                  <span>关系</span>
                  <a-select class="input-w" v-model="relationName">
                    <a-select-option v-for="item in links" :value="item.name" :key="item.name">{{item.name}}
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col :span="5">
                  <span>target</span>
                  <a-input disabled v-model="targetResult"></a-input>
                </a-col>
              </a-row>

              <a-row class="zitu-you-box">
                <a-col><span>说明</span></a-col>
                <a-col>
                  <a-textarea v-model="rulesMs" placeholder="请输入说明文字" :autosize="{ minRows: 2, maxRows: 6 }"/>
                </a-col>
                <a-col :span="4"></a-col>
              </a-row>
              <a-row class="zitu-you-box">
                <a-button type="primary" @click="saveRelation">保存</a-button>
                <a-button class="mg-r-15" @click="useRule">应用规则</a-button>
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
  import relationComputed from '@/components/compute/relationComputed'
  import image from '@/assets/image/peitu-04.svg'

  const dataSource = [{
    key: '0',
    Mc: 'Edward King 0',
    des: '32',
  }, {
    key: '1',
    Mc: 'Edward King 1',
    des: '32',
  }]
  export default {
    components: {secondLayout, computeTable, exportModal, importModal, relationComputed},
    name: "compute-relation",
    data() {
      return {
        idAdd: true, //  是否是新增
        selectID: '', // 选中表格的ID
        relationName: '', // 关系名字
        regex: '',// 规则模式
        rulesMc: '',
        rulesMs: '',
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
        title: '关系补全',
        image,
        links: [],
        sourceResult: '',
        targetResult: '',
        editEntity: null,
        activeKey: 'entity',
        breadcrumb: [
          {
            path: 'visualization',
            breadcrumbName: '计算',
            url: 'entity_visualization'
          }, {
            path: 'entity',
            breadcrumbName: '关系补全'
          }]
      }
    },
    computed: {
      'relationTableData': function () {
        return this.$store.state.all_rules_list ? this.$store.state.all_rules_list.data : []
      },
      'all_link': function () {
        return this.$store.getters.all_link
      }
    },
    created() {
      this.$store.dispatch('getAllRules', {type: '关系补全'})
    },
    methods: {
      selectRule(row) {
        const vm = this
        this.idAdd = false
        this.selectID = row.id
        this.rulesMc = row.name
        this.regex = row.regex
        let data = JSON.parse(row.data)
        this.relationName = data.relation
        this.rulesMs = data.rulesMs
        let reg = new RegExp("(?<=')[^(^)^,]*(?=')", 'g')
        let rules = row.regex.match(reg)

        vm.all_link.forEach((v) => {
          if (v.name === vm.relationName) {
            vm.sourceResult = v.source_label
            vm.targetResult = v.target_label
          }
        })
        this.editEntity = {
          sourceResult: vm.sourceResult,
          targetResult: vm.targetResult,
          source: rules[0],
          link1: rules[2],
          link2: rules[3]
        }
      },
      saveRelation() {
        const vm = this
        if (vm.rulesMc == '') {
          this.$message.warning('请输入规则名称');
          return
        }
        if (this.idAdd == true) {
          this.$store.dispatch('save_Relation', {
            name: vm.rulesMc,
            regex: vm.regex,
            relation: vm.relationName,
            rulesMs: vm.rulesMs,
            type: '关系补全'
          })
          notification.success({
            message: '成功',
            description: '保存成功'
          })
        }
        if (this.selectID) {
          this.$store.dispatch('save_Relation', {
            id: this.selectID,
            name: vm.rulesMc,
            regex: vm.regex,
            relation: vm.relationName,
            rulesMs: vm.rulesMs,
            type: '关系补全'
          })
          notification.success({
            message: '成功',
            description: '修改成功'
          })
        }
      },
      useRule() {
        const vm = this
        if (vm.relationName == '' || vm.regex == '') {
          this.$message.warning('请输入规则模式和关系');
          return
        }
        this.$store.dispatch('use_rule', {relation: vm.relationName, gremlin: vm.regex, graph: g_id}).then((data) => {
          const h = this.$createElement
          if (data.data && data) {
            this.$info({
              title: data.msg,
              content: h('div', {}, [
                h('p', '成功建立关系 ' + data.data.insertSuccess + ' 条'),
                h('p', '失败建立关系 ' + data.data.insertFailure + ' 条'),
              ]),
              onOk() {
              },
            });
          }
        })
      },
      delRule(record) {
        const vm = this
        vm.idAdd = false
        this.$confirm({
          title: '确定要删除吗？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            vm.$store.dispatch('delete_Relation', record.id)
            vm.rulesMc = ''
            vm.rulesMs = ''
            vm.relationName = ''
            vm.regex = ''
            vm.idAdd = true
            vm.selectID = ''
          }
        })
      },
      handleAddTable() {
        this.idAdd = true
        this.selectID = ''
        this.rulesMc = ''
        this.rulesMs = ''
        this.relationName = ''
        this.regex = ''
      },
      openExportModal() {
        let url = ''
        this.$store.dispatch('exportRule', {type: '关系补全'})
          .then(() => {
            url = graph_zjy + '/graphrule/exportRule?type=关系补全'
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
          this.$store.dispatch('relation_import', params)
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
      getResult(result) {// 生成规则模式与关系
        const vm = this
        let all_links = vm.all_link
        all_links.forEach((v) => {// 循环获得sourceCreated类型
          if (result.source === v.source_label && result.target === v.target_label) {
            vm.links.push(v)
          }
        })
        vm.sourceResult = result.source
        vm.targetResult = result.target
        vm.regex = "g.V().hasLabel('" + result.source + "').match(__.as('a').out('" + result.link1 + "').out('" + result.link2 + "').as('b')).select('a','b')"
        vm.relationName = vm.links[0].name
      },
      clearResult() {// 清空结果
        this.links = []
        this.regex = ''
      }
    },
    mounted() {
      this.tableData = dataSource
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

  .h100 {
    height: auto !important;
  }

</style>
