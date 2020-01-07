<template>
  <div class="container">
      <second-layout :title="'清除数据'" :image="image" :breadcrumb="breadcrumb">
        <a-layout slot="tabs" class="ant-tabs pd-t-20">
          <a-row :style="{background:'#fff',overflow:'auto'}" class="pd-ben-box">
            <a-col :xs="{ span: 24, offset: 1 }" :lg="{ span: 6 }" class="xs-pd-b-10">
              <a-button type="primary" class="w-100" @click="clearAll">清除全部</a-button>
            </a-col>
            <a-col :xs="{ span: 24, offset: 1 }" :lg="{ span: 6, offset: 2 }" class="xs-pd-b-10">
              <a-button type="primary" class="w-100" @click="clearData">清除数据</a-button>
            </a-col>
            <a-col :xs="{ span: 24, offset: 1 }" :lg="{ span: 6, offset: 2 }" class="xs-pd-b-10">
              <a-button type="primary" class="w-100" @click="reBuild">重建</a-button>
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
  export default {
    components: {secondLayout},
    data() {
      return {
        image,
        breadcrumb: [
          {
            path: 'visualization',
            breadcrumbName: '实体',
            url: 'entity_visualization'
          }, {
            path: 'entity',
            breadcrumbName: '清除数据'
          }]
      }
    },
    beforeCreate() {
    },
    computed: {
    },
    methods: {
      clearAll() {
        this.$store.dispatch('clearAll')
      },
      clearData() {
        var str = 'g.E().drop()\n' +
          'g.V().drop()\n'
        this.$store.dispatch('setGraph', str)
      },
      reBuild() {
        var str = 'graph.schema().propertyKey("名称").asText().userdata("showname","名称").ifNotExist().create() \n' +
          'graph.schema().propertyKey("类型").asText().userdata("showname","多媒体类型").ifNotExist().create() \n' +
          'graph.schema().propertyKey("pid").asText().userdata("showname","父类id").ifNotExist().create() \n' +
          'graph.schema().propertyKey("ptype").asText().userdata("showname","父类类型").ifNotExist().create() \n' +
          'graph.schema().propertyKey("描述").asText().userdata("showname","描述").ifNotExist().create() \n' +
          '\n' +
          'graph.schema().vertexLabel("多媒体").properties("名称", "类型", "pid","ptype","描述").useCustomizeStringId().nullableKeys("描述").ifNotExist().create() \n' +
          '\n' +
          'graph.schema().indexLabel("mediaByName").onV("多媒体").by("名称").search().ifNotExist().create()\n' +
          'graph.schema().indexLabel("mediaByName1").onV("多媒体").by("名称").secondary().ifNotExist().create()\n' +
          'graph.schema().indexLabel("mediaByType").onV("多媒体").by("类型").secondary().ifNotExist().create()\n' +
          'graph.schema().indexLabel("mediaByDescription").onV("多媒体").by("描述").search().ifNotExist().create()'
        this.$store.dispatch('setGraph', str)
      }
    }
  }
</script>

<style>
  .pd-ben-box{
    background: #ffff;
    padding: 60px 60px;
  }
</style>
