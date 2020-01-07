<template>
    <div class="container">
      <second-layout :title="title" :image="image" :breadcrumb="breadcrumb" @switch="switchTab">
        <a-tabs :activeKey="activeKey" slot="tabs" @change="switchTab">
          <a-tab-pane key="owl">
          <span slot="tab">
            <a-icon type="upload"/>OWL导入
          </span>
            <owl-import></owl-import>
          </a-tab-pane>
          <a-tab-pane key="link">
          <span slot="tab">
            <a-icon type="download"/>  OWL导出
          </span>
            <owl-export></owl-export>
          </a-tab-pane>
        </a-tabs>
      </second-layout>
    </div>
</template>

<script>
  import secondLayout from '@/components/common/secondLayout'
  import owlImport from '@/components/owl/owlImport'
  import owlExport from '@/components/owl/owlExport'
  import image from '@/assets/image/peitu-02.svg'
  const menu = {
    owl: 'OWL导入',
    link: 'OWL导出',
  }
  export default {
    components: {secondLayout,owlImport,owlExport},
    data() {
      return {
        image,
        activeKey: 'owl',
        title: 'OWL导入',
        breadcrumb: [
          {
            path: 'owl',
            breadcrumbName: '本体',
            url: 'owl'
          }, {
            path: 'owl',
            breadcrumbName: 'OWL导入'
          }]
      }
    },
    methods: {
      switchTab(key) {
        this.activeKey = key
        this.title = menu[key]
        this.breadcrumb.splice(1, 1, {path: key, breadcrumbName: menu[key]})
      }
    }
  }
</script>


<style scoped>

</style>
