<template>
  <div class="container">
    <modal-default :visible="defaultVisible" @close="hideModals"></modal-default>
    <modal-init :visible="initVisible" @close="hideModals"></modal-init>

    <tree-default></tree-default>

    <a-button @click="defaultVisible = true">简单模态框</a-button>
    <a-button @click="initVisible = true">带初始值模态框</a-button>
  </div>
</template>

<script>
  import modalDefault from '@/components/example/ant-modal/modal-default'
  import modalInit from '@/components/example/ant-modal/modal-init'

  import treeDefault from '@/components/example/ant-tree/tree-default'

  export default {
    components: {modalDefault,modalInit,treeDefault},
    data() {
      return {
        initVisible: false,
        defaultVisible: false
      }
    },
    methods: {
      hideModals: function () {
        this.initVisible = false
        this.defaultVisible = false
      }
    }
  }
</script>

<style></style>
