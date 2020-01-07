<template>
  <!-- 参数说明:defaultExpandAll:展开全部、showIcon：文字前的图标，文件夹和文件时可能有用 -->
  <a-tree
    :treeData="treeData"
    showIcon
    defaultExpandAll
    :defaultSelectedKeys="['0-0-0']">
    <a-icon slot="smile" type="smile-o"/>
    <a-icon slot="meh" type="smile-o"/>
  </a-tree>
</template>

<script>
  export default {
    components: {},
    data() {
      return {
        treeData: []
      }
    },
    methods: {}
  }
</script>

<style></style>
