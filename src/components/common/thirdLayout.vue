<template>
  <a-layout class="third-layout">
    <a-layout-header>
      <a-row type="flex" justify="start">
        <a-col :span="18">
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
          <h2>{{title}}</h2>
        </a-col>
        <a-col :span="6">
          <img :src="image"/>
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content>
      <slot name="menus"></slot>
    </a-layout-content>
  </a-layout>
</template>

<script>
  export default {
    props: ['title', 'image', 'breadcrumb'],
    components: {},
    data() {
      const {lang} = this.$route.params
      return {
        current: ['search']
      }
    },
    created() {
    },
    methods: {}
  }
</script>

<style></style>
