<template>
  <a-modal
    title="布局"
    :visible.sync="visible"
    :confirmLoading="confirmLoading"
    style="top: 20px;height: 100%"
    width="90%"
    cancelText="关闭"
    @cancel="handleCancel">
    <div id="layDiv" class="mod-ht"><layout-graph></layout-graph></div>
  </a-modal>
</template>

<script>
  import {graph} from '@/util/index'
  import layoutGraph from '@/components/layoutGraph'

  export default {
    components: { layoutGraph },
    props: ['visible', 'type'],
    data() {
      return {
        confirmLoading: false,
      }
    },
    methods: {
      handleCancel() {
        this.$emit('close')
      }
    }
  }
</script>

<style></style>
