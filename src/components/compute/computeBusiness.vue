<template>
  <div class="container">
    <!--导出-->
    <export-modal :visible.sync="showExportModal" @close="hideModal"></export-modal>
    <!--导入-->
    <import-modal :visible.sync="showImportModal" @close="hideModal"></import-modal>
    <second-layout :title="title" :image="image" :breadcrumb="breadcrumb">
      <a-layout slot="tabs" class="ant-tabs   pd-t-20">
        <a-layout-header class="a-l">
          <a-row type="flex" justify="start" class="a-1-1"><b>
            <a-icon type="file-text"/>&nbsp;业务数据生成</b></a-row>
        </a-layout-header>
        <a-layout-content class="a-l a-1-01" style="height: 100%">
          <a-row class="pd-12-width" style="height: 100%">
            <a-col :span="8">
              <a-row type="flex" justify="space-between" class="mg-b-20">
                <a-col :span="6"><span style="line-height: 32px">规则列表</span></a-col>
                <a-col>
                  <a-button @click="clear_Add">新增</a-button>
                </a-col>
                <a-col>
                  <a-button @click="openExportModal">导出</a-button>
                </a-col>
                <a-col>
                  <a-button type="primary" @click="openImportModal">导入</a-button>
                </a-col>
              </a-row>
              <a-row class="table-box">
                <a-table class="table-box" bordered :dataSource="tableData" size="small" :columns="columns"
                         :pagination="false" :scroll="{ y: 240 }">
                  <template slot="name" slot-scope="text, record">

                  </template>
                  <template slot="operation" slot-scope="text, record">
                    <a-button type="dashed" size="small" @click="deleteBune(record)">删除</a-button>
                    <a-button type="dashed" size="small" @click="selectBune(record)">详情</a-button>
                  </template>
                </a-table>
              </a-row>
            </a-col>
            <a-col :span="12" class="zitu-zuo-box" style="height: 100%; overflow-y: auto">
              <a-row class="zitu-you-box">
                <a-col><span>规则名称</span></a-col>
                <a-col>
                  <a-input placeholder="请输入规则名称" v-model="rulesMc"/>
                </a-col>
                <a-col :span="4"></a-col>
              </a-row>
              <!--<a-row class="zitu-you-box"> <a-col><span>规则模式</span></a-col><a-col><a-textarea placeholder="请输入规则模式" :autosize="{ minRows: 2, maxRows: 6 }" v-model="rulesMs"/></a-col><a-col :span="4"></a-col></a-row>-->
              <a-row class="zitu-you-box">
                <a-row :style="{ paddingLeft: '5px',paddingBottom:'10px'}">起点</a-row>
                <a-select
                  :style="{ width: '100%',paddingBottom:'6px'}"
                  @change="handleSourceChange"
                  v-model="sourceName">
                  <a-select-option :value="item.name" v-for="(item,$index) in all_node.vertexlabels" :key="$index">
                    {{item.name}}
                  </a-select-option>
                </a-select>
                <a-row :style="{ paddingLeft: '5px',paddingBottom:'10px'}">关系</a-row>
                <a-select class=""
                          :style="{ width: '100%',paddingBottom:'6px'}"
                          placeholder="请完成 前两项~"
                          v-model="relationId" @change="handleRelationChange()">
                  <a-select-option :value="item.id" v-for="(item,$index) in relationList" :key="$index">{{item.name}}
                  </a-select-option>
                </a-select>
                <a-row :style="{ paddingLeft: '5px',paddingBottom:'10px'}">终点</a-row>
                <a-input class="" readOnly
                         :style="{ width: '100%',paddingBottom:'6px'}"
                         placeholder="请完成 前两项~" v-model="targetName"/>
                <a-form v-if="target" :form="targetForm" class="mg-t-20">
                  <a-form-item
                    v-for="(item, $index) in targetProp"
                    :key="$index"
                    :label="item.mediaName ? '' : item.normalName"
                    :label-col="{ span: 24 }"
                    :wrapper-col="{ span: 24 }">
                    <a-input v-if="!item.isMedia && item.data_type === 'TEXT'" v-decorator="[
                    `${item.name}`,
                    {rules: [{ required: item.isRequired, message: '请输入' + item.name }], initialValue: item.value} ]"/>
                    <a-input
                      v-if="!item.isMedia && item.data_type === 'INT' || item.data_type === 'DOUBLE' || item.data_type === 'FLOAT'"
                      v-decorator="[
                    `${item.name}`,
                    {rules: [{ required: item.isRequired, message: '请输入' + item.name }], initialValue: item.value} ]"/>
                    <!--<a-input v-if="!item.isMedia" v-model="item.value"/>-->
                    <!--<upload v-if="item.isMedia" :type="item.user_data" :index="$index" @uploaded="reloadMedia"></upload>-->
                  </a-form-item>
                </a-form>
              </a-row>
              <a-row class="zitu-you-box">
                <a-col>
                  <a-button type="primary" @click="saveBusiness">保存</a-button>
                  <a-button type="primary" v-if="!idAdd" @click="makeData">生成数据</a-button>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-layout-content>
      </a-layout>
    </second-layout>
  </div>
</template>

<script>
  import {graph} from '@/util/index' // graph数据处理工具类
  import {mapActions, mapState} from 'vuex'
  import {notification} from 'ant-design-vue'
  import secondLayout from '@/components/common/secondLayout'
  import computeTable from '@/components/compute/computeTable'
  import exportModal from '@/components/compute/exportModal'
  import importModal from '@/components/compute/importModal'
  import image from '@/assets/image/peitu-04.svg'

  export default {
    components: {secondLayout, computeTable, exportModal, importModal},
    name: "compute-business",
    data() {
      return {
        idAdd: true, //  是否是新增
        selectID: '', // 选中表格的ID
        rulesMc: '',
        rulesMs: '',
        columns: [
          {
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
        title: '业务数据生成',
        image,
        activeKey: 'entity',
        breadcrumb: [
          {
            path: 'visualization',
            breadcrumbName: '计算',
            url: 'entity_visualization'
          }, {
            path: 'entity',
            breadcrumbName: '业务数据生成'
          }],
        sourceName: '',     //选中起点
        relationId: '',     //选中关系
        targetName: '',     // 选中的终点
        target: null,       // 终点的源数据
        targetProp: null,   //终点的属性
        relationList: [],   //关系下拉
      }
    },
    beforeCreate() {
      this.targetForm = this.$form.createForm(this)
    },
    computed: {
      'tableData': function () {
        return this.$store.state.all_rules_list ? this.$store.state.all_rules_list.data : []
      },
      all_node: function () {
        return this.$store.state.all_node
      },
      all_link: function () {
        return this.$store.state.all_link
      },
      properties: function () {
        return this.$store.state.all_properties ? this.$store.state.all_properties.propertykeys : []
      }
    },
    created() {
      this.$store.dispatch('getAllRules', {type: '数据生成'})
    },
    methods: {
      ...mapActions(['gremlin', 'get_id', 'addNode']),
      async makeData() {
        debugger
        // this.selectID
        // this.targetProp
        //  name: "weight"
        //  value: "g.V().hasLabel("软件").group().by().by(outE('supports').otherV().values("weight").sum())"
        // this.targetName
        // http://192.168.1.30:8090/util/generateUUID.do
        // vm.$store.dispatch('addNode', {label: '多媒体', id: v.id, values: content})
        var id = this.selectID;
        var name = this.rulesMc;
        let props
        const idMaps = {}
        let idIndex = 0
        //1. 执行语句获得数组
        for (var i = 0; i < this.targetProp.length; i++) {
          props = this.targetProp[i]
          const pName = props.name
          const pValue = props.value
          const data = await this.gremlin(pValue)
          const map = data && data.data[0]
          props.dataList = []
          for (var key in map) {
            if (typeof idMaps[key] === 'undefined') {
              idMaps[key] = idIndex
              idIndex++
            }
            props.dataList[idMaps[key]] = map[key]
          }
        }
        //2. 获得uuid
        var uuidList = []
        if (props && props.dataList)
          for (var key in props.dataList) {
            var uuid = await this.get_id()
            uuidList.push(uuid)
          }
        //3. 新建节点
        var gremlinList = []
        for (var i = 0; i < uuidList.length; i++) {
          var uuid = uuidList[i]
          var label = this.targetName
          var propMap = {}
          for (var key in this.targetProp) {
            const prop = this.targetProp[key]
            propMap[prop.name] = prop.dataList[i]
          }
          var list = [`graph.addVertex(T.label, "${label}", T.id, "${uuid}"`]
          for (var key in propMap) {
            let value = propMap[key]
            if (key === '名称') value += `:${name}`
            if (typeof value === "string") value = `"${value}"`
            list.push(`"${key}", ${value}`)
          }
          gremlinList.push(list.join(',') + `)`)
        }
        var gremlinStr = gremlinList.join(';')
        console.log(gremlinList.join(';\n'))
        var data = await this.gremlin(gremlinStr)
        if (data.code !== 500) {
          this.$message.success(`生成成功`);
        } else {
          this.$message.error(data.message);
        }
        debugger
      },
      clear_Add() {
        this.idAdd = true
        this.selectID = ''
        this.rulesMc = ''
        this.rulesMs = ''
        this.$store.state.text_res = []
      },
      selectBune(row) {
        this.rulesMc = row.name
        this.idAdd = false
        this.selectID = row.id
        // 还原保存数据
        var allData = JSON.parse(row.regex)
        console.log(allData)
        this.sourceName = allData.sourceName,     //选中起点
          this.relationId = allData.relationId,     //选中关系
          this.targetName = allData.targetName,     // 选中的终点
          this.target = allData.target,       // 终点的源数据
          this.targetProp = allData.targetProp,   //终点的属性
          this.relationList = allData.relationList   //关系下拉
      },
      deleteBune(record) {
        const vm = this
        vm.idAdd = false
        this.$confirm({
          title: '确定要删除吗？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            vm.$store.dispatch('delete_Business', record)
              .then(() => {
                vm.rulesMc = ''
                vm.rulesMs = ''
                vm.idAdd = true
                vm.selectID = ''
              })
          }
        })
      },
      saveBusiness() {
        const vm = this
        if (vm.rulesMc == '') {
          this.$message.warning('请输入规则名称');
          return
        }
        this.targetForm.validateFields((err, values) => {
          if (!err) {
            for (var i in values) {
              for (var j = 0; j < vm.targetProp.length; j++) {
                if (i === vm.targetProp[j].name) {
                  vm.targetProp[j].value = values[i]
                }
              }
            }
          }
        });
        var orgData = {
          sourceName: this.sourceName,     //选中起点
          relationId: this.relationId,     //选中关系
          targetName: this.targetName,     // 选中的终点
          target: this.target,       // 终点的源数据
          targetProp: this.targetProp,   //终点的属性
          relationList: this.relationList,   //关系下拉
        }
        if (this.idAdd == true) {
          this.$store.dispatch('save_Business', {name: vm.rulesMc, regex: JSON.stringify(orgData), type: '数据生成'})
          notification.success({
            message: '成功',
            description: '保存成功'
          })
        }
        if (this.selectID) {
          this.$store.dispatch('save_Business', {
            id: this.selectID,
            name: vm.rulesMc,
            regex: JSON.stringify(orgData),
            type: '数据生成'
          })
          notification.success({
            message: '成功',
            description: '修改成功'
          })
        }
      },
      openExportModal() {
        var url = ''
        // window.location.href = graph_zjy + '/graphrule/exportRule?type=%E5%AD%90%E5%9B%BE%E7%94%9F%E6%88%90';
        this.$store.dispatch('exportRule', {type: '数据生成'})
          .then(() => {
            url = graph_zjy + '/graphrule/exportRule?type=数据生成'
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
          this.$store.dispatch('business_import', params)
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
      handleSourceChange() {
        this.relationId = ''
        // this.relation = null
        this.relationList = []
        // this.target = null
        // this.targetName = ''
        // 获得此起点下可选关系
        let links = this.all_link.edgelabels
        for (let i = 0; i < links.length; i++) {
          if (links[i].source_label === this.sourceName) {
            this.relationList.push(links[i])
          }
        }
      },
      handleRelationChange(relation) {
        // 设置选中的关系名，目标实体类型
        let links = this.all_link.edgelabels
        for (let i = 0; i < links.length; i++) {
          if (this.relationId === links[i].id) {
            this.targetName = links[i].target_label
            // this.relation = links[i]
          }
        }
        this.target = getVertex(this.targetName, this.all_node.vertexlabels)
        const vm = this
        //  target
        let resultProperties = []
        this.target.properties.forEach((v, i) => {
          let data_type = graph.getTypeByPro(vm.properties, v)
          let isMedia = graph.isMedia(vm.properties, v)
          let isRequired = graph.isRequired(vm.sourceName, v)
          let user_data = graph.getUser_data(vm.properties, v)
          let name = v
          if (isMedia) {
            name += '（' + user_data.type + '）'
          } else {
            name += '（' + data_type + '）'
          }

          resultProperties.push({
            index: i,
            name: v,
            data_type: data_type,
            isMedia: isMedia,
            isRequired: isRequired,
            user_data: user_data ? user_data.type : null,
            mediaName: isMedia ? name : null,
            normalName: name,
            value: ''
          })
        })
        this.targetProp = resultProperties
      },
    }
  }

  // 根据名称获得实体类型详细数据
  function getVertex(name, vertexList) {
    for (let i = 0; i < vertexList.length; i++) {
      if (name === vertexList[i].name) {
        return vertexList[i]
      }
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

