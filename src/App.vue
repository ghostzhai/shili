<template>
  <div id="app">
    <a-layout class="first-layout">
      <a-layout-header>
        <a class="home" href="/">
          <img :src="image"/>
        </a>
        <a-menu v-model="current" mode="horizontal">
          <a-sub-menu>
            <span slot="title" @click="handleClick"><a-icon type="search"/>查询</span>
            <a-menu-item v-for="item in menu.search" :key="item.key">
              <router-link :to="{ name: item.component ,params: {type: item.params}}">{{item.name}}</router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu>
            <span slot="title" @click="handleClick"><a-icon type="cluster"/>本体</span>
            <a-menu-item v-for="item in menu.owl" :key="item.key" :class="item.params">
              <router-link :to="{ name: item.component ,params: {type: item.params}}">{{item.name}}</router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu>
            <span slot="title" @click="handleClick"><a-icon type="deployment-unit"/>实体</span>
            <a-menu-item v-for="item in menu.entity" :key="item.key" :class="item.params">
              <router-link :to="{ name: item.component ,params: {type: item.params}}">{{item.name}}</router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu>
            <span slot="title" @click="handleClick"><a-icon type="calculator"/>计算</span>
            <a-menu-item v-for="item in menu.compute" :key="item.key">
              <router-link :to="{ name: item.component}">{{item.name}}</router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item key="example">
            <router-link :to="{ name: 'example'}">例子</router-link>
          </a-menu-item>
        </a-menu>
      </a-layout-header>
      <a-layout-content>
        <router-view/>
      </a-layout-content>
      <!--<a-layout-footer>-->
        <!--<div class="footer">-->
          <!--<div><p><a href="javascript:;">帮助</a><a href="javascript:;">隐私</a><a href="javascript:;">条款</a></p> <p>Copyright © 2017-2019大连理工大学机器智能研究中心</p> </div>-->
        <!--</div>-->
      <!--</a-layout-footer>-->
    </a-layout>
  </div>
</template>

<script>
  import image from '@/assets/image/logo.svg'
  import menu from '@/util/firstMenuConfig'
  export default {
    name: 'App',
    data() {
      return {
        image,
        menu,
        current: ['search_entity'],
        // isHome: false  首页隐藏导航
      }
    },
    watch: {
      '$route': function (value) {
        let current = value.name
        let routers = this.$router.options.routes
        routers.forEach((v) => {
          value.meta.title.indexOf(v.name) > -1 || value.path.indexOf(v.name) > -1 ? current = v.name : current
          if((value.meta.title === 'search') || value.meta.title === 'owl_manage' || value.meta.title === 'entity_manage') {
            current = value.params.type ? value.params.type : value.meta.title
          }
        })
        this.current = [current]
      }
    },
    mounted() {
      this.$store.dispatch('getAllNode')
      this.$store.dispatch('getAllLink')
      this.$store.dispatch('getAllProperties')
      this.$store.dispatch('getAllIndex')
    },
    methods: {
      handleClick(key) {
        console.log('arguments', arguments)
        console.log('handleClick', key)
      }
    }
  }
</script>

<style>
  .ant-menu-item :hover{
    text-decoration: unset;
  }
  .ant-menu-horizontal {
    border: 0;
    border-bottom: 0px;
    box-shadow: none;
    line-height: 46px;
    white-space: nowrap;
  }
  .ant-menu-horizontal .ant-menu-submenu{
    margin-top: -2px;
    top: initial;
  }
  .home > img{
    height: 40px;
    padding-left: 220px;
  }
  .ant-menu{
    color: #314659;
  }
  .first-layout.ant-layout > .ant-layout-header ul.ant-menu li.ant-menu-submenu{
    padding: 0px;
  }
</style>
