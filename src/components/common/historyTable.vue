<template>
  <a-table bordered :dataSource="history" :columns="columns" :pagination="false">
    <span slot="Xx" slot-scope="text, record, index">{{index + 1}}</span>
    <span slot="info" slot-scope="text, record, index">
      <span v-if="index === 0">
        {{type === 'node' ? '新增节点' : '新增关联'}}
      </span>
      <span v-else>
        {{type === 'node' ? '编辑节点' : '编辑关联'}}
      </span>
      <i v-if="JSON.parse(text)" v-for="(value, key) in JSON.parse(text)">{{key}}：{{value}}；</i>
    </span>
  </a-table>
</template>

<script>
  const columns = [
    {
      title: '序号',
      dataIndex: 'Xx',
      scopedSlots: {customRender: 'Xx'}
    }, {
      title: '记录',
      dataIndex: 'info',
      scopedSlots: {customRender: 'info'}
    }]
  export default {
    props: ['type'],
    components: {},
    data() {
      return {
        columns
      }
    },
    computed: {
      'history': function () {
        return this.$store.state.change_history ? this.$store.state.change_history : []
      }
    },
    methods: {}
  }
</script>

<style></style>
