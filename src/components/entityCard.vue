<template>
  <div class="box">
    <div class="card" v-for="(item,index) in nodes" :key="index">
      <a-popover placement="right">
        <template slot="content">
          <p v-for="(value, key) in item.properties">{{key}}: {{value}}</p>
        </template>
        <span slot="title">属性</span>
        <a-card
          hoverable
          style="width: 100%"
          @click.self="$router.push({name: 'entity_manage_entity_detail', params:{id: item.id}})"
        >
          <template class="ant-card-actions" slot="actions">
            <router-link :to="{name: 'entity_manage_entity_detail', params: {id: item.id}}">详情</router-link>
            <router-link :to="{name: 'entity_visualization_id', params: {id: item.id}}">可视化</router-link>
          </template>
          <a-card-meta
            :title="item.name"
            :description="item.label">
            <a-avatar slot="avatar" src="static/tu001.png"/>
          </a-card-meta>
        </a-card>
      </a-popover>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['nodes'],
    data() {
      return {}
    },
    created() {
    },
    methods: {
      getInformation(item) {
        this.$router.push({})
      },
      gotoView(item) {
        this.$router.push({})
      }
    }
  }
</script>

<style>
  .ant-card-actions li {
    margin: 9px 0;
  }

  .pd-t-20 .card {
    margin-bottom: 16px;
  }
</style>
