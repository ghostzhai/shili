<template>
  <a-modal
    title="属性列表"
    :visible.sync="visible"
    width="60%"
    okText="确认"
    cancelText="取消"
    @ok="handleOk"
    @cancel="$emit('close')">
    <a-list
      size="small"
      bordered
      :dataSource="properties">
      <a-list-item :class="{'active': item.id === selected.id}" slot="renderItem" slot-scope="item, index"
                   @click="selected = item">{{item.name}}
      </a-list-item>
      <div slot="header">
        <a-input-search placeholder="输入关键词过滤" v-model="searchStr"/>
      </div>
    </a-list>
  </a-modal>
</template>

<script>
  export default {
    props: ['visible'],
    components: {},
    data() {
      return {
        searchStr: '',
        selected: {}
      }
    },
    computed: {
      'properties': function () {
        let properties = this.$store.state.all_properties ? this.$store.state.all_properties.propertykeys : []
        let searchInputValue = this.searchStr
        //如果存在，根据条件过滤
        if (searchInputValue) {
          return properties.filter(function (daily) {
            return String(daily.name).indexOf(searchInputValue) > -1
          })
        }
        // 如果不存在，整体返回
        return properties
      }
    },
    methods: {
      handleOk() {
        this.$emit('ok', this.selected)
        this.$emit('close')
      }
    }
  }
</script>

<style>
  .active {
    background-color: #1890ff;
    color: #fff;
  }
</style>
