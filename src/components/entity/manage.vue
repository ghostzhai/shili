<template>
  <div class="container">
    <second-layout :title="title" :image="image" :breadcrumb="breadcrumb" @switch="switchTab">
      <a-tabs :activeKey="activeKey" slot="tabs" @change="switchTab">
        <a-tab-pane key="entity">
          <span slot="tab">
            <a-icon type="eye"/>  实体浏览
          </span>
          <entity-list></entity-list>
        </a-tab-pane>
        <a-tab-pane key="link">
          <span slot="tab">
            <a-icon type="link"/>  关联列表
          </span>
          <link-list></link-list>
        </a-tab-pane>
      </a-tabs>
    </second-layout>
  </div>
</template>

<script>
  import entityList from '@/components/entity/entityList'
  import linkList from '@/components/entity/linkList'
  import image from '@/assets/image/peitu-03.svg'
  import secondLayout from '@/components/common/secondLayout'
  const menu = {
    entity: '实体列表',
    link: '关联列表'
  }

  export default {
    components: {secondLayout, entityList, linkList},
    data() {
      return {
        image,
        title: '实体浏览',
        activeKey: 'entity',
        breadcrumb: [
          {
            path: 'visualization',
            breadcrumbName: '实体',
            url: 'entity_visualization'
          }, {
            path: 'entity',
            breadcrumbName: '实体管理'
          }, {
            path: 'entity',
            breadcrumbName: '实体浏览'
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
          case 'xs_entity_entity_view':
            this.activeKey = 'entity'
            break
          case 'xs_entity_link_list':
            this.activeKey = 'link'
            break
          default:
            break
        }
      }
    }
  }
</script>

<style></style>
