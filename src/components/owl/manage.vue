<template>
  <div class="container">
    <div class="container">
      <second-layout :title="title" :image="image" :breadcrumb="breadcrumb" @switch="switchTab">
        <a-tabs :activeKey="activeKey" slot="tabs" @change="switchTab">
          <a-tab-pane key="property">
          <span slot="tab">
            <a-icon type="profile"/>  属性管理
          </span>
            <property-manage></property-manage>
          </a-tab-pane>
          <a-tab-pane key="owl">
          <span slot="tab">
            <a-icon type="deployment-unit"/>  实体类型管理
          </span>
            <owl-manage></owl-manage>
          </a-tab-pane>
          <a-tab-pane key="link">
          <span slot="tab">
            <a-icon type="block"/>  关系类型管理
          </span>
            <link-manage></link-manage>
          </a-tab-pane>
        </a-tabs>
      </second-layout>
    </div>
  </div>
</template>

<script>
  import secondLayout from '@/components/common/secondLayout'

  import owlManage from '@/components/owl/owlManage'
  import linkManage from '@/components/owl/linkManage'
  import propertyManage from '@/components/owl/propertyManage'
  import image from '@/assets/image/peitu-02.svg'
  const menu = {
    owl: '实体类型管理',
    link: '关系类型管理',
    property: '属性管理'
  }
  export default {
    components: {secondLayout, owlManage, linkManage, propertyManage},
    data() {
      return {
        image,
        activeKey: 'property',
        title: '属性管理',
        breadcrumb: [
          {
            path: 'owl',
            breadcrumbName: '本体',
            url: 'owl'
          }, {
            path: 'link',
            breadcrumbName: '本体管理'
          }, {
            path: 'owl',
            breadcrumbName: '属性管理 '
          }]
      }
    },
    watch: {
      '$route.params.type': function () {
        this.initTabActive()
      }
    },
    methods: {
      switchTab(key) {
        this.activeKey = key
        this.title = menu[key]
        this.breadcrumb.splice(2, 1, {path: key, breadcrumbName: menu[key]})
      },
      initTabActive() {
        var type = this.$route.params.type
        switch (type) {
          case 'xs_owl_link':
            this.switchTab('link')
            break
          case 'xs_owl_property':
            this.switchTab('property')
            break
          case 'owl':
            this.switchTab('owl')
            break
          default:
            break
        }
      }
    }
  }
</script>

<style></style>
