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
      <a-form-item label="关联标签"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-input disabled v-decorator="[
                'id',
                {rules: [{ required: true, message: '请输入标签'}],
                initialValue: label} ]"/>
      </a-form-item>
      <a-form-item v-for="(item, $index) in target"
                   :key="$index"
                   :label="item.name + '（' + item.data_type + '）'"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-input v-if="!item.isMedia && item.data_type === 'TEXT'" v-decorator="[
                `${item.name}`,
                {rules: [{ required: item.isRequired, message: '请输入' + item.name }],
                initialValue: item.value}
              ]"/>
        <a-input
          v-if="!item.isMedia && item.data_type === 'INT' || item.data_type === 'DOUBLE' || item.data_type === 'FLOAT'"
          type="number" v-decorator="[
                `${item.name}`,
                {rules: [{ required: item.isRequired, message: '请输入' + item.name }],
                initialValue: item.value}
              ]"/>

        <upload v-if="item.isMedia" :type="item.user_data" :index="$index" @uploaded="reloadMedia">
          <span slot="download">
            <a-button v-if="!item.isRequired" @click="downloadMedia(item)" type="dashed" size="small">下载</a-button>
          </span>
        </upload>
      </a-form-item>
    </a-form>
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
        labelCol: {span: 6},
        wrapperCol: {span: 12}
      }
      return {
        formItemLayout,
        confirmLoading: false,
        id: '',
        label: '',
        target: [],
        mediaList: []
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this)// 创建一个表单对象
    },
    watch: {
      'visible': function (value) {// 监听弹出框是否显示，然后根据传进来的config初始化弹出框需要的数据
        if (value) this.init()
      }
    },
    computed: {
      properties: function () {
        return this.$store.state.all_properties ? this.$store.state.all_properties.propertykeys : []
      },
      link: function () {
        return this.$store.state.all_link ? this.$store.state.all_link.edgelabels : []
      }
    },
    methods: {
      init() {
        this.target = []
        this.id = this.config.id ? this.config.id : null
        this.label = this.config.label ? this.config.label : null

        const vm = this
        let properties = []
        vm.link.forEach((v) => {
          v.name === vm.label ? properties = v.properties : null
        })

        properties.forEach((v) => {
          let data_type = graph.getTypeByPro(vm.properties, v)
          let isMedia = graph.isMedia(vm.properties, v)
          let isRequired = graph.isLinkRequired(vm.config.label, v)
          let user_data = graph.getUser_data(vm.properties, v)
          let name = v
          if (isMedia) {
            name += '（' + user_data.type + '）'
          } else {
            name += '（' + data_type + '）'
          }

          this.target.push({
            name: v,
            value: vm.config.properties[v],
            data_type: data_type,
            isMedia: isMedia,
            isRequired: isRequired,
            user_data: user_data ? user_data.type : null,
            mediaName: isMedia ? name : null,
            normalName: name
          })
        })
      },
      handleOk() {
        const vm = this
        this.form.validateFields((err, values) => {
          if (!err) {
            vm.confirmLoading = true
            values.label = this.config.label
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
            vm.$store.dispatch('updateLink', {id: vm.id, values}).then((data) => {
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
              vm.$store.dispatch('postHistory', {id: data.data.id, info: JSON.stringify(vm.config.properties)})

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
      downloadMedia(item) {
        this.$store.dispatch('getMediaById', item.value).then((data) => {
          let media = data.graph.vertices[0]
          let url = graph_api + '/util/download.do?id=' + media.id + '&name=' + media.properties[graph_key] + '&gid=' +
            g_id
          try {
            let elemIF = document.createElement('iframe')
            elemIF.src = url
            elemIF.style.display = 'none'
            document.body.appendChild(elemIF)
          } catch (e) {
          }
        })
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

<style></style>
