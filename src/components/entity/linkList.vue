<template>
  <div class="container overf-hidden">
    <a-layout class="a-l">
      <a-layout-header class="a-l-header">
        <a-row type="flex" justify="start">
          <a-col :span="4"><b>关联列表</b></a-col>
          <!--<a-col :span="4" v-if="current_entity"><h2>{{current_entity.name}}</h2></a-col>-->
        </a-row>
      </a-layout-header>
      <a-layout>
        <a-layout-sider width="250" class="overf-hidden-lie"
                        breakpoint="lg"
                        collapsedWidth="0">
          <a-menu mode="inline" :style="{ height: '100%', borderRight: 0 }">
            <a-menu-item>
              <a-input-search
                key="search"
                placeholder="输入搜索文本"
                style="width: 200px"
                @search="onSearch"
                v-model="searchStr" />
            </a-menu-item>
            <a-menu-item :key="item.id" v-for="item in all_entity"
                         @click="searchTheCorrelation(item)">
              <a-badge status="success"/>
              {{item.name}}
            </a-menu-item>
          </a-menu>
        </a-layout-sider>
        <a-layout-content>
          <div class="pd-20">
            <a-row>
              <a-col :span="23">
                <!--<a-button type="dashed" class="w-100" icon="plus" @click="Mlink = true">添加</a-button>-->
              </a-col>
              <a-col :span="1">
                <a-button type="primary" icon="search" style="float: right"></a-button>
              </a-col>
            </a-row>
            <relation-card :linkNodes="linkNodes" class="pd-t-20"></relation-card>
            <!--<entity-card :nodes="nodes" class="pd-t-20"></entity-card>-->
          </div>
        </a-layout-content>
      </a-layout>
      <a-row style="border-top: 1px solid #ebedf0;height:30px;"><br></a-row>
    </a-layout>

    <link-modal :visible.sync="Mlink" @close="Mlink = false"></link-modal>
  </div>
</template>

<script>
  import {graph, cm} from '@/util/index' // graph数据处理工具类
  import relationCard from '@/components/relationCard'
  import linkModal from '@/components/chartComponents/linkModal'

  export default {
    components: {relationCard, linkModal},
    data() {
      return {
        current_correlation: null,
        searchStr: '',
        Mlink: false,
      }
    },
    computed: {
      links: function () {
        return graph.getLink(this.$store.state.all_graph)
      },
      linkNodes: function () {
        return cm.getLinkNodes(this.$store.state.all_graph)
      },
      all_entity: function () {
        if (this.$store.state.all_correlation && this.$store.state.all_correlation.data) {
          var correlationList = this.$store.state.all_correlation.data
          let searchInputValue = this.searchStr
          //如果存在，根据条件过滤
          if (searchInputValue) {
            return correlationList.filter(function (daily) {
              return String(daily.name).indexOf(searchInputValue) > -1
            })
          }
          // 如果不存在，整体返回
          return correlationList
        }
      }
    },
    created() {
      this.$store.dispatch('getAllCorrelation', '')
        .then(function () {
        })
    },
    methods: {
      searchTheCorrelation(correlation) {
        this.current_correlation = correlation
        const str = 'g.E().hasLabel("' + correlation.name + '")'
        this.$store.dispatch('getAllGraph', str)
          .then(function () {
          })
      },
      onSearch() {}
    }
  }
</script>

<style>
  .ant-card-hoverable:hover {
    border-color: #40a9ff;
  }

  .ant-card-meta-detail :hover {
    color: #1890FF;
  }

  .ant-layout.ant-layout-has-sider > .ant-layout, .ant-layout.ant-layout-has-sider > .ant-layout-content {
    background-color: rgba(249, 250, 251, 0.6);
  }

  .ant-layout-content {
  / / background-color: red;
  }

  .a-l-header {
    background: #fff;
    padding: 0 25px;
    border-bottom: 1px solid #ebedf0;
    line-height: 50px;
    height: 50px;
  }

  .a-l-header b {
    font-weight: 600;
    color: #666;
  }

  .a-l {
    background: #fff;
  }

  .overf-hidden-lie {
    background: #fff;
    overflow: auto;
    overflow-x: hidden;
  }

  .overf-hidden {
    overflow: hidden;
  }
</style>
