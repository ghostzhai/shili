<template>
  <a-layout class="second-layout">
    <a-layout-header>
      <a-row type="flex" justify="start">
        <a-col :span="24">
          <a-breadcrumb :routes="breadcrumb">
            <template slot="itemRender" slot-scope="{route, params, routes, paths}">
              <span v-if="breadcrumb.indexOf(route) === breadcrumb.length - 1">
                {{route.breadcrumbName}}
              </span>
              <span class="second-breadcrumb" v-else @click="checkTab(route)">
                {{route.breadcrumbName}}
              </span>
            </template>
          </a-breadcrumb>
          <h2>
            <a-tooltip placement="bottomLeft" >
              <template slot='title'>
                {{title}}
              </template>
              {{title}}
            </a-tooltip>
            <img style="height:60px;float: right;vertical-align: middle" :src="image"/>
          </h2>
        </a-col>
        <!--<a-col :span="6" style="imgtest">-->
      </a-row>
    </a-layout-header>
    <a-layout-content>
      <slot name="tabs"></slot>
    </a-layout-content>
  </a-layout>
</template>

<script>

  export default {
    props: ['title', 'image', 'breadcrumb'],
    components: {},
    data() {
      return {}
      return {}
    },
    methods: {
      checkTab(route) {
        if (route.url) {
          this.$router.push({name: route.url})
        }
        this.$emit('switch', route.path)
      }
    }
  }
</script>

<style scoped>
  h2 {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
