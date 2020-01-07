<template>
  <div class="container">
    <a-layout style="overflow: hidden">
      <a-layout-header class="a-l-header">
        <a-row type="flex" justify="start">
          <a-col :span="5"><b>路径探索列表查询</b>
          </a-col>
          <a-col :span="15"><b>
            <template>{{""}}</template>
          </b></a-col>
        </a-row>
      </a-layout-header>
      <a-layout>
        <a-layout-sider width="250" breakpoint="lg" collapsedWidth="0"  style="overflow-y: auto;overflow-x: hidden">
          <a-menu mode="inline" :style="{ height: '100%', borderRight: 0}">
            <a-row :style="{padding:'20px'}">
              <a-select style="width: 100%"
                v-decorator="[
                `邻接点`,
                {
                rules: [{
                required: false,
                message: '请输入!',
                }],
                }
                ]"
                showSearch
                placeholder="请输入"
                :defaultActiveFirstOption="false"
                :showArrow="false"
                :filterOption="false"
                @search="handleSearch"
                @change="handleChange"
                :notFoundContent="fetching ? undefined : null">
                <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
                <a-select-option v-for="(d, $index) in searchResult" :key="d.id">{{d.name}}</a-select-option>
              </a-select>
            </a-row>
            <a-menu-item :key="item.id" v-for="(item,index) in selectList">
              <a-col :span="2"
                style="
                width: 170px;
                overflow:hidden;
               text-overflow:ellipsis;
               white-space:nowrap;">
                {{item.name}}
              </a-col>
              <a-col>
                <a-Icon @click="deleteChoose(item, index)" type="delete"></a-Icon>
              </a-col>
            </a-menu-item>
              <a-col :style="{padding:'20px'}">
                <a-button @click="explorePath()" type="primary" block>查询</a-button>
              </a-col>
              <a-col :style="{padding:'0px 20px'}">
                <a-radio-group v-model="exploreType">
                  <a-radio :value="1">最短路径</a-radio>
                  <a-radio :value="2">全路径</a-radio>
                </a-radio-group>
              </a-col>
          </a-menu>
        </a-layout-sider>
        <a-layout-content>
          <div class="pd-20">
            <a-table
              size="small"
              :columns="columns" :dataSource="explorePathList" :pagination="false"></a-table>
          </div>
        </a-layout-content>
      </a-layout>
      <a-row style="border-top: 1px solid #ebedf0;height:30px;background: white"><br></a-row>
    </a-layout>

  </div>
</template>

<script>
  import {graph, cm} from '@/util/index' // graph数据处理工具类
  import entityCard from '@/components/entityCard'
  import entityModal from '@/components/chartComponents/entityModal'

  let timeout
  const columns = [{
      title: '序号',
      dataIndex: 'num',
      scopedSlots: { customRender: 'num' },
    },{
    title: '路径',
    dataIndex: 'path',
    scopedSlots: { customRender: 'path' },
  }]
  export default {
    components: {entityCard, entityModal},
    data() {
      return {
        searchStr: '',
        fetching: false,
        selectList: [],
        columns,
        exploreType: 1   //最短路径1，全路径2
      }
    },
    computed: {
      searchResult: function () {
        return graph.getNode(this.$store.state.graph)
      },
      explorePathList: function () {
        return cm.getExplorePathTable(this.$store.state.explore_path)
      }
    },
    created() {
      this.$store.dispatch('getAllEntity')
    },
    methods: {
      handleSearch(value) {
        const vm = this
        vm.fetching = true
        if (timeout) {
          clearTimeout(timeout)
          timeout = null
        }

        function getResult() {
          vm.$store.dispatch('getGraph', value).then(function () {
            vm.fetching = false
          })
        }
        timeout = setTimeout(getResult, 300)// 延迟搜索
      },
      handleChange(value) {
        let tar
        this.searchResult.forEach((v, i) => {
          v.id === value ? tar = v : tar
        })
        this.selectList.push(tar)
        // this.form.value = tar.name
      },
      deleteChoose(item, index) {
        this.selectList.splice(index, 1)
      },
      explorePath() {
        var idList = []
        for(var i = 0; i < this.selectList.length; i++) {
          idList.push(this.selectList[i].id)
        }
        var params = {
          type: this.exploreType,
          idList: idList
        }
        this.$store.dispatch('getExplorePath', params)
      }
    }
  }
</script>

<style>
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
  .ant-layout.ant-layout-has-sider > .ant-layout, .ant-layout.ant-layout-has-sider > .ant-layout-content {
    /*background-color: rgba(249, 250, 251, 0.6);*/
    background: white;
  }
  .ant-table-small > .ant-table-content > .ant-table-body{
    margin: 0px;
  }
</style>
