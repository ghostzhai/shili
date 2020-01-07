<template>
  <a-modal
    title="历史修改信息"
    :visible.sync="visible"
    style="top: 20px;height: 100%"
    width="90%"
    @cancel="$emit('close')">
    <template slot="footer">
      <a-button key="back" @click="$emit('close')">关闭</a-button>
    </template>
    <a-table bordered :dataSource="history" :columns="columns" :pagination="false">
      <span slot="Xx" slot-scope="text, record, index">{{index + 1}}</span>
    </a-table>
  </a-modal>
</template>

<script>
  const columns = [
    {
      title: '序号',
      dataIndex: 'Xx',
      scopedSlots: {customRender: 'Xx'}
    }, {
      title: '日期',
      dataIndex: 'date',
      scopedSlots: {customRender: 'date'}
    }, {
      title: '记录',
      dataIndex: 'info',
      scopedSlots: {customRender: 'info'}
    }]
  export default {
    props: ['visible', 'pro_key'],
    components: {},
    data() {
      return {
        columns
      }
    },
    computed: {
      'history': function () {
        const vm = this
        let his = []
        let history = this.$store.state.change_history ? this.$store.state.change_history : []
        history.forEach((v) => {
          let date = new Date(v.date)
          let info = JSON.parse(v.info)
          let date2 = date.getFullYear() + '年' + date.getMonth() + '月' + date.getDate() + '日' + date.getHours() + ':' +
            date.getMinutes()
          his.push({
            date: date2,
            info: info[vm.pro_key]
          })
        })
        return his
      }
    },
    methods: {}
  }
</script>

<style></style>
