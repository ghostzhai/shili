<template>
  <a-modal
    title="新建关联"
    :visible.sync="visible"
    :confirmLoading="confirmLoading"
    width="40%"
    okText="确认"
    cancelText="取消"
    @ok="handleOk"
    @cancel="handleCancel">
    <a-form :form="form">
      <a-form-item
        label="关联类型"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol">
        <a-select
          showSearch
          v-decorator="[
          'link',
          {rules: [{ required: true, message: '请选择关联类型' }]}
        ]"
          optionFilterProp="children"
          placeholder="选择一个关联类型"
          @change="handleChange"
          :filterOption="filterOption">
          <a-select-option v-for="(d, $index) in linkTypes" :value="$index" :key="$index">{{d.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-if="target.length"
                   v-for="(item, $index) in target"
                   :key="$index"
                   :label="item.name + '（' + item.data_type + '）'"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol"
      >
        <a-input v-if="!item.isMedia && item.data_type === 'TEXT'" v-decorator="[
                `${item.name}`,
                {rules: [{ required: item.isRequired, message: '请输入' + item.name }]} ]"/>
        <a-input
          v-if="!item.isMedia && item.data_type === 'INT' || item.data_type === 'DOUBLE' || item.data_type === 'FLOAT'"
          type="number" v-decorator="[
                `${item.name}`,
                {rules: [{ required: item.isRequired, message: '请输入' + item.name }]} ]"/>

        <upload v-if="item.isMedia" :type="item.user_data" :index="$index" @uploaded="reloadMedia"></upload>
      </a-form-item>
    </a-form>

    <a-list
      size="small"
      bordered
      :dataSource="AFlist">
      <a-list-item slot="renderItem"
                   slot-scope="item, index"
                   :class="{'active': active && item.id === active.id}"
                   @click="active = item">{{item.properties[graph_key]}}
      </a-list-item>
      <div slot="header">
        <a-input-search placeholder="输入关键词过滤" v-model="searchStr"/>
      </div>
    </a-list>
  </a-modal>
</template>

<script>
  import {graph} from '@/util/index'
  import upload from '@/components/common/upload'

  export default {
    props: ['visible', 'config'],
    components: {upload},
    data() {
      const formItemLayout = {
        labelCol: {span: 5},
        wrapperCol: {span: 12}
      }
      return {
        formItemLayout,
        active: null,
        linkTypes: [],
        target: [],
        confirmLoading: false,
        searchStr: '',
        graph_key: graph_key,

        fileList: [],
        uploading: false,
        media: null,
        filename: null
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this)// 创建一个表单对象
    },
    watch: {
      'visible': function (value) {
        if (value) this.init()
      }
    },
    computed: {
      nodeList: function () {
        return this.$store.state.link_node ? this.$store.state.link_node.graph.vertices : []
      },
      AFlist: function () {
        let searchInputValue = this.searchStr
        //如果存在，根据条件过滤
        if (searchInputValue) {
          return this.nodeList.filter(function (daily) {
            return String(daily.properties[graph_key]).indexOf(searchInputValue) > -1
          })
        }
        //如果不存在，整体返回
        return this.nodeList
      },
      properties: function () {
        return this.$store.state.all_properties ? this.$store.state.all_properties.propertykeys : []
      }
    },
    methods: {
      init() {
        const vm = this
        vm.linkTypes = []
        let types = this.$store.state.all_link ? this.$store.state.all_link.edgelabels : []
        types.forEach((v, i) => {
          v.source_label === vm.config.label ? vm.linkTypes.push(v) : vm.linkTypes
        })
      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      handleChange(value) {
        const vm = this
        vm.target = []
        this.linkTypes[value].properties.forEach((v, i) => {
          let data_type = graph.getTypeByPro(vm.properties, v)
          let isMedia = graph.isMedia(vm.properties, v)
          let isRequired = graph.isLinkRequired(vm.linkTypes[value].label, v)
          let user_data = graph.getUser_data(vm.properties, v)
          let name = v
          if (isMedia) {
            name += '（' + user_data.type + '）'
          } else {
            name += '（' + data_type + '）'
          }

          this.target.push({
            name: v,
            data_type: data_type,
            isMedia: isMedia,
            isRequired: isRequired,
            user_data: user_data ? user_data.type : null,
            mediaName: isMedia ? name : null,
            normalName: name
          })
        })
        this.$store.dispatch('getLinkNode', this.linkTypes[value].target_label)
      },
      handleOk() {
        const vm = this
        if (!this.active) {
          this.$message.error('请选择一个关联节点！')
          return false
        }
        this.form.validateFields((err, values) => {
          if (!err) {
            vm.confirmLoading = true
            if (vm.mediaList&&vm.mediaList.length) {
              let names = []
              vm.mediaList.forEach((mv, mi) => {// 循环上传好的文件列表
                vm.target.forEach((v, i) => {// 再循环选中的本体的属性
                  if (v.isMedia) {// 如果是多媒体
                    if (mv.type === v.user_data) {// 如果多媒体类型和上传后的文件类型相同
                      names.push({//组装一个属性名称对应文件ID的list
                        name: v.name,
                        id: mv.id
                      })
                    }
                  }
                })
              })

              names.forEach((v) => {// 给新建的实体增加对应的多媒体的ID
                values[v.name] = v.id
              })
            }

            // 讲表单参数发给action，让action处理，让组件里面逻辑清晰一点
            vm.$store.dispatch('addLink',
              {source: vm.config, target: this.active, link: vm.linkTypes[values.link], values}).then((data) => {
              vm.confirmLoading = false
              vm.handleCancel()
              if (vm.$store.state.chart) {
                setTimeout(function () {
                  vm.$store.state.chart.reloadData()
                }, 100)
              }
              if (vm.$store.state.component_chart) {
                setTimeout(function () {
                  vm.$store.state.component_chart.reloadData()
                }, 100)
              }

              vm.$store.dispatch('postHistory', {id: data.data.id, info: JSON.stringify(values)})
              // 多媒体节点创建
              if (vm.mediaList&&vm.mediaList.length) {
                let mediaPromise = [], histPromise = []
                vm.mediaList.forEach((v) => {
                  let content = {
                    pid: data.data.id,
                    ptype: 'edge',
                    '名称': v.filename,
                    '类型': v.type
                  }
                  mediaPromise.push(vm.$store.dispatch('addNode', {label: '多媒体', id: v.id, values: content}))
                  histPromise.push(vm.$store.dispatch('postHistory', {id: v.id, info: JSON.stringify(content)}))
                })

                Promise.all(mediaPromise).then(() => {
                  setTimeout(function () {
                    vm.$store.state.chart.reloadData()
                  }, 100)
                })
              }
            })
          }
        })
      },
      handleCancel() {
        this.$emit('close')
        this.target = []
        this.fileList = []
        this.filename = null
        this.form.resetFields()
      },
      reloadMedia(media, index) {
        const vm = this
        if (vm.mediaList[index]) {
          vm.mediaList.splice(index, 1, media)
        } else {
          vm.mediaList.push(media)
        }
      }
    }
  }
</script>

<style>
  .ant-list-item.active {
    background-color: rgba(24, 144, 255, 0.7);
    color: #fff;
  }
</style>
