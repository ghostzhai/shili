<template>
  <a-modal
    title="新建实体"
    :visible.sync="visible"
    :confirmLoading="confirmLoading"
    width="60%"
    okText="确认"
    cancelText="取消"
    @ok="handleOk"
    @cancel="handleCancel">
    <a-row :gutter="16">
      <a-col :span="8">
        <a-list class="xin-jian-active"
                size="small"
                bordered
                :dataSource="AFlist">
          <a-list-item
            class="active-box"
            :class="{'active': active && item.id === active.id}"
            slot="renderItem" slot-scope="item, index" @click="checkOne(item)">{{item.name}}
          </a-list-item>
          <div slot="header">
            <a-input-search placeholder="输入关键词过滤" v-model="searchStr"/>
          </div>
        </a-list>
      </a-col>
      <a-col :span="16">
        <a-form :form="form">
          <a-form-item v-for="(item, $index) in target"
                       :key="$index"
                       :label="item.mediaName ? item.mediaName : item.normalName"
                       :label-col="formItemLayout.labelCol"
                       :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-if="!item.isMedia && item.data_type === 'TEXT'" v-decorator="[
                `${item.name}`,
                {rules: [{ required: item.isRequired, message: '请输入' + item.name }]} ]"/>
            <a-input
              v-if="!item.isMedia && item.data_type === 'INT' || item.data_type === 'DOUBLE' || item.data_type === 'FLOAT'"
              type="number"
              v-decorator="[
                `${item.name}`,
                {rules: [{ required: item.isRequired, message: '请输入' + item.name }]} ]"/>

            <upload v-if="item.isMedia" :type="item.user_data" :index="$index" @uploaded="reloadMedia"></upload>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
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
        labelCol: {span: 24},
        wrapperCol: {span: 24}
      }
      return {
        formItemLayout,
        active: null,
        confirmLoading: false,
        searchStr: null,
        target: null,
        entityName: null,
        entityType: null,
        mediaList: []
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this)// 创建一个表单对象
    },
    computed: {
      Alist: function () {
        return this.$store.state.all_node ? this.$store.state.all_node.vertexlabels : []
      },
      AFlist: function () {
        let searchInputValue = this.searchStr
        //如果存在，根据条件过滤
        if (searchInputValue) {
          return this.Alist.filter(function (daily) {
            return Object.keys(daily).some(function (key) {
              return String(daily[key]).indexOf(searchInputValue) > -1
            })
          })
        }
        //如果不存在，整体返回
        return this.Alist
      },
      properties: function () {
        return this.$store.state.all_properties ? this.$store.state.all_properties.propertykeys : []
      }
    },
    methods: {
      checkOne(item) {
        const vm = this
        let resultProperties = []
        this.entityType = item.name
        this.active = item
        item.properties.forEach((v, i) => {
          let data_type = graph.getTypeByPro(vm.properties, v)
          let isMedia = graph.isMedia(vm.properties, v)
          let isRequired = graph.isRequired(item.name, v)
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
            normalName: name
          })
        })
        this.target = resultProperties
      },
      handleOk() {
        const vm = this
        if (!vm.active) {
          vm.$message.error('请选择一个实体！')
          return false
        }
        this.form.validateFields((err, values) => {
          if (!err) {
            vm.confirmLoading = true
            vm.$store.dispatch('get_id').then((data) => {
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
              vm.$store.dispatch('addNode', {id: data, label: vm.entityType, values}).then(() => {
                vm.confirmLoading = false
                if (vm.$store.state.chart) {
                  setTimeout(function () {
                    vm.$store.state.chart.reloadData()
                  }, 100)
                }
                vm.handleCancel()

                // 新增一条节点的历史记录
                vm.$store.dispatch('postHistory', {id: data, info: JSON.stringify(values)})
              })
              // 多媒体节点创建
              if (vm.mediaList&&vm.mediaList.length) {
                let mediaPromise = [], histPromise = []
                vm.mediaList.forEach((v) => {
                  let content = {
                    pid: data,
                    ptype: 'vertex',
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
        this.target = null
        this.fileList = []
        this.filename = null
        this.active = null
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

<style scoped>
  .xin-jian-active .active-box :hover {
    color: #1890ff;
    cursor: pointer;
  }

  .ant-list-item.active {
    background-color: rgba(24, 144, 255, 0.7);
    color: #fff;
  }

  .ant-spin-container {
    height: 200px;
    overflow: auto;
  }
</style>
