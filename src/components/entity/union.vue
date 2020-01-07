<template>
  <div class="container">
    <second-layout :title="'联合添加'" :image="image" :breadcrumb="breadcrumb">
      <a-layout slot="tabs" class="ant-tabs pd-t-20">
        <a-row :style="{background:'#fff',overflow:'auto'}">
          <!--source本体类型-->
          <a-col :span="6" :style="{padding:'35px'}" v-if="all_node">
            <a-row :style="{ paddingLeft: '5px',paddingBottom:'10px'}">起点</a-row>
            <a-select
              :style="{ width: '100%'}" style="margin-bottom: 20px"
              @change="handleSourceChange" v-model="sourceName">
              <a-select-option :value="item.name" v-for="item in all_node.vertexlabels" :key="item.name">{{item.name}}
              </a-select-option>
            </a-select>
            <a-form v-if="source" :form="sourceForm" @submit="handleSubmit">
              <a-form-item
                v-for="(item, $index) in sourceProp"
                :key="$index"
                :label="item.mediaName ? item.mediaName : item.normalName"
                :label-col="{ span: 24 }"
                :wrapper-col="{ span: 24 }">
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
          <!--关系类型-->
          <a-col :span="6" :style="{padding:'35px'}">
            <a-row :style="{ paddingLeft: '5px',paddingBottom:'10px'}">关系</a-row>
            <a-select
              :style="{ width: '100%'}" style="margin-bottom: 20px"
              v-model="relationId" @change="handleRelationChange()">
              <a-select-option :value="item.id" v-for="item in relationList" :key="item.id">{{item.name}}
              </a-select-option>
            </a-select>
            <a-form v-if="relation" :form="relationForm" @submit="handleSubmit">
              <a-form-item
                v-for="(item, $index) in relationProp"
                :key="$index"
                :label="item.mediaName ? item.mediaName : item.normalName"
                :label-col="{ span: 24 }"
                :wrapper-col="{ span: 24 }">
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
          <!--target本体类型-->
          <a-col :span="6" :style="{padding:'35px'}">
            <a-row :style="{ paddingLeft: '5px',paddingBottom:'10px'}">终点</a-row>
            <a-input
              :style="{ width: '100%'}"
              style="margin-bottom: 20px"
              placeholder="请输入"
              v-model="targetName" readOnly/>
            <a-form v-if="target" :form="targetForm" @submit="handleSubmit">
              <a-form-item
                v-for="(item, $index) in targetProp"
                :key="$index"
                :label="item.mediaName ? item.mediaName : item.normalName"
                :label-col="{ span: 24 }"
                :wrapper-col="{ span: 24 }">
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
          <a-col :span="5" :style="{padding:'35px'}">
            <a-row :style="{ paddingLeft: '5px',paddingBottom:'10px'}">&nbsp;</a-row>
            <a-button @click="handleSubmit">新建</a-button>
          </a-col>
        </a-row>
      </a-layout>
    </second-layout>
  </div>
</template>

<script>
  import {graph} from '@/util/index' // graph数据处理工具类
  import secondLayout from '@/components/common/secondLayout'
  import image from '@/assets/image/peitu-03.svg'
  import upload from '@/components/common/upload'

  export default {
    components: {secondLayout, upload},
    data() {
      return {
        image,
        sourceName: '',
        sourceProp: null,
        source: null,  // 选中的起点的完整实体类型
        relationId: '',
        relationProp: null,
        relation: null, // 选中的完整关系类型
        targetName: '',
        targetProp: null,
        target: null,  // 选中的终点的完整实体类型
        relationList: [],
        breadcrumb: [
          {
            path: 'visualization',
            breadcrumbName: '实体',
            url: 'entity_visualization'
          }, {
            path: 'entity',
            breadcrumbName: '联合添加'
          }],
        mediaList: [],
        sourceForm: this.$form.createForm(this),
        relationForm: this.$form.createForm(this),
        targetForm: this.$form.createForm(this)
      }
    },
    beforeCreate() {
//      this.sourceForm = this.$form.createForm(this)
//      this.relationForm = this.$form.createForm(this)
//      this.targetForm = this.$form.createForm(this)
    },
    computed: {
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
    methods: {
      handleSourceChange() {
        this.relationId = ''
        this.relation = null
        this.relationList = []
        this.target = null
        this.targetName = ''
        // 获得此起点下可选关系
        let links = this.all_link.edgelabels
        for (let i = 0; i < links.length; i++) {
          if (links[i].source_label === this.sourceName) {
            this.relationList.push(links[i])
          }
        }
        this.source = getVertex(this.sourceName, this.all_node.vertexlabels)
        let resultProperties = []
        const vm = this
        this.source.properties.forEach((v, i) => {
          let data_type = graph.getTypeByPro(vm.properties, v)
          let isMedia = graph.isMedia(vm.properties, v)
          let isRequired = graph.isRequired(vm.source.name, v)
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
        this.sourceProp = resultProperties
      },
      handleRelationChange(relation) {
        // 设置选中的关系名，目标实体类型
        let links = this.all_link.edgelabels
        for (let i = 0; i < links.length; i++) {
          if (this.relationId === links[i].id) {
            this.targetName = links[i].target_label
            this.relation = links[i]
          }
        }
        // relation
        let resultProperties_1 = []
        const vm = this
        this.relation.properties.forEach((v, i) => {
          let data_type = graph.getTypeByPro(vm.properties, v)
          let isMedia = graph.isMedia(vm.properties, v)
          let isRequired = graph.isRequired(vm.source.name, v)
          let user_data = graph.getUser_data(vm.properties, v)
          let name = v
          if (isMedia) {
            name += '（' + user_data.type + '）'
          } else {
            name += '（' + data_type + '）'
          }

          resultProperties_1.push({
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
        this.relationProp = resultProperties_1

        //  target
        this.target = getVertex(this.targetName, this.all_node.vertexlabels)
        let resultProperties = []
        this.target.properties.forEach((v, i) => {
          let data_type = graph.getTypeByPro(vm.properties, v)
          let isMedia = graph.isMedia(vm.properties, v)
          let isRequired = graph.isRequired(vm.source.name, v)
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
        this.targetProp = resultProperties
      },
      handleSubmit() {
        const vm = this
        let source, target
        this.sourceForm.validateFields((err, values) => {
          if (!err) {
            source = values
          }
        })
        this.targetForm.validateFields((err, values) => {
          if (!err) {
            target = values
          }
        })
        if (source && target) {
          this.relationForm.validateFields((err, values) => {
            if (!err) {
              Promise.all([vm.$store.dispatch('get_id'), vm.$store.dispatch('get_id')]).then((ids) => {
                // 定义一个需要上传的多媒体节点的promise
                let mediaNodes = [], history_record = [], linkMedias = []
                if (vm.mediaList && vm.mediaList.length) {
                  let target_names = []
                  let relation_names = []
                  let source_names = []
                  vm.mediaList.forEach((mv, mi) => {// 循环上传好的文件列表
                    vm.targetProp.forEach((v, i) => {// 再循环选中的本体的属性
                      if (v.isMedia) {// 如果是多媒体
                        if (mv.type === v.user_data) {// 如果多媒体类型和上传后的文件类型相同
                          target_names.push({//组装一个属性名称对应文件ID的list
                            name: v.name,
                            id: mv.id,
                            filename: mv.filename,
                            type: mv.type
                          })
                        }
                      }
                    })
                    vm.relationProp.forEach((v, i) => {// 再循环选中的本体的属性
                      if (v.isMedia) {// 如果是多媒体
                        if (mv.type === v.user_data) {// 如果多媒体类型和上传后的文件类型相同
                          relation_names.push({//组装一个属性名称对应文件ID的list
                            name: v.name,
                            id: mv.id,
                            filename: mv.filename,
                            type: mv.type
                          })
                        }
                      }
                    })
                    vm.sourceProp.forEach((v, i) => {// 再循环选中的本体的属性
                      if (v.isMedia) {// 如果是多媒体
                        if (mv.type === v.user_data) {// 如果多媒体类型和上传后的文件类型相同
                          source_names.push({//组装一个属性名称对应文件ID的list
                            name: v.name,
                            id: mv.id,
                            filename: mv.filename,
                            type: mv.type
                          })
                        }
                      }
                    })
                  })

                  source_names.forEach((v) => {// 给新建的实体增加对应的多媒体的ID
                    source[v.name] = v.id
                    let content = {
                      pid: ids[0],
                      ptype: 'vertex',
                      '名称': v.filename,
                      '类型': v.type
                    }
                    mediaNodes.push(vm.$store.dispatch('addNode', {id: v.id, label: '多媒体', values: content}))
                    history_record.push(vm.$store.dispatch('postHistory', {id: v.id, info: JSON.stringify(content)}))
                  })
                  relation_names.forEach((v) => {// 给新建的实体增加对应的多媒体的ID
                    values[v.name] = v.id
                    let content = {
                      ptype: 'edge',
                      '名称': v.filename,
                      '类型': v.type
                    }
                    linkMedias.push({id: v.id, content})// 组装一个新建完关联的新建多媒体节点需要的数据
                  })
                  target_names.forEach((v) => {// 给新建的实体增加对应的多媒体的ID
                    target[v.name] = v.id
                    let content = {
                      pid: ids[1],
                      ptype: 'vertex',
                      '名称': v.filename,
                      '类型': v.type
                    }
                    mediaNodes.push(vm.$store.dispatch('addNode', {id: v.id, label: '多媒体', values: content}))
                    history_record.push(vm.$store.dispatch('postHistory', {id: v.id, info: JSON.stringify(content)}))
                  })
                }

                history_record.push(vm.$store.dispatch('postHistory', {id: ids[0], info: JSON.stringify(source)}))
                history_record.push(vm.$store.dispatch('postHistory', {id: ids[1], info: JSON.stringify(target)}))

                Promise.all(mediaNodes)//  这里新建多媒体的节点
                Promise.all(history_record)// 这里发送新增节点的历史记录的的请求
                Promise.all([
                  vm.$store.dispatch('addNode', {id: ids[0], label: vm.sourceName, values: source}),
                  vm.$store.dispatch('addNode', {id: ids[1], label: vm.targetName, values: target})]).then((data) => {
                  vm.$store.dispatch('addLink',
                    {
                      source: {id: ids[0], label: vm.sourceName},
                      target: {id: ids[1], label: vm.targetName},
                      link: vm.relation,
                      values
                    }).then((data) => {
                    let linkMediaPromise = [], his = []
                    linkMedias.forEach((v) => {
                      v.content.pid = data.data.id
                      linkMediaPromise.push(vm.$store.dispatch('addNode', {id: v.id, label: '多媒体', values: v.content}))
                      his.push(vm.$store.dispatch('postHistory', {id: v.id, info: JSON.stringify(v.content)}))
                    })

                    Promise.all(linkMediaPromise)//这里发送新增关联多媒体节点的请求
                    Promise.all(his)// 这里发送新增的多媒体节点的历史记录
                    vm.$store.dispatch('postHistory', {id: data.data.id, info: JSON.stringify(values)})
                  })
                })
              })
            }
          })
        }
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

  // 根据名称获得实体类型详细数据
  function getVertex(name, vertexList) {
    for (let i = 0; i < vertexList.length; i++) {
      if (name === vertexList[i].name) {
        return vertexList[i]
      }
    }
  }
</script>

<style></style>
