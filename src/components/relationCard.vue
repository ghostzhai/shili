<template>
  <div class="box">
    <div class="card flex-card" v-for="item in linkNodes.edges" >
      <a-popover placement="right">
        <template slot="content" v-if="item">
          <p v-for="(value, key) in item.properties">{{key}}: {{value}}</p>
        </template>
        <span slot="title">属性</span>
        <a-card
          hoverable
          style="width: 100%"
          @click="$router.push({name: 'entity_manage_link_detail', params:{id: item.id}})"
        >
          <div class="flex1" v-if="(linkNodes.vertex[item.outV])"><a-avatar slot="avatar" src="static/tu001.png"/>
            {{linkNodes.vertex[item.outV].properties['名称']}}
          </div>
          <div class="flex3 ant-card-meta pd-t-24 ant-card-meta-detail pd-l-5">
            <div class="ant-card-meta-title"><b>{{item.label}}</b></div>
            <!--<div class="ant-card-meta-description">description: {{item.label}}</div>-->
          </div>
          <div class="flex1" v-if="(item.inV&&linkNodes.vertex[item.inV]&&linkNodes.vertex[item.inV].properties)"><a-avatar slot="avatar" src="static/tu001.png" />
            {{linkNodes.vertex[item.inV].properties['名称']}}
          </div>
        </a-card>
      </a-popover>
    </div>
  </div>
</template>

<script>
  export default {
    props: [ 'linkNodes' ],
    data() {
      return {
      }
    },
    created() {
    },
    methods: {
    }
  }
</script>

<style scoped>
  .ant-card-meta-title{
    /*text-transform:capitalize;*/
    text-align: center;
  }
  .box-padding {
    padding: 20px;
  }
</style>
