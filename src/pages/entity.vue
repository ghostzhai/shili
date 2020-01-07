<template>
  <div class="container">
    <div class="shititupu">
    <a-select
      showSearch
      :value="value"
      placeholder="请输入关键词"
      style="width: 200px"
      :defaultActiveFirstOption="false"
      :showArrow="false"
      :filterOption="false"
      @search="handleSearch"
      @change="handleChange"
      :notFoundContent="fetching ? undefined : null">
      <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
      <a-select-option v-for="(d, $index) in searchResult" :value="d.id" :key="$index">{{d.name}}</a-select-option>
    </a-select>

    <a-button type="default" @click="Mentity.show = true">新增节点</a-button>
    <a-button type="default" @click="rightMenu.show = true">
      <a-icon type="bars"/>
    </a-button>
    </div>
    <!-- 图谱的组件 -->
    <div class="chart-box" style="height: calc(100% - 90px);">
      <chart></chart>
    </div>


    <!-- 新建节点弹出框 -->
    <entity-modal :visible.sync="Mentity.show" :config="Mentity" @close="hidePopup()"></entity-modal>

    <!-- 右侧菜单弹出框 -->
    <right-menu :visible.sync="rightMenu.show" :config="rightMenu" @close="hidePopup()"></right-menu>
  </div>
</template>

<script>
  import chart from '@/components/chart'
  import entityModal from '@/components/chartComponents/entityModal'
  import rightMenu from '@/components/rightMenu'

  import {graph} from '@/util/index' // graph数据处理工具类
  let timeout

  export default {
    components: {chart, entityModal, rightMenu},
    data() {
      return {
        Mentity: {show: false},
        rightMenu: {show: false},
        value: null,
        fetching: false
      }
    },
    created() {
      const vm = this
      if (this.$route.params.id) {
        this.$store.dispatch('getNodeById', 'g.V("' + this.$route.params.id + '")').then(() => {
          if (vm.$store.state.chart) {
            setTimeout(function () {
              vm.$store.state.chart.reloadData()
            }, 100)
          }
        })
      } else {
        this.$store.dispatch('getALimitEntity').then((data) => {
          this.$store.dispatch('setRoot', graph.getNode(data)[0])
        })
      }
    },
    computed: {
      searchResult: function () {
        return graph.getNode(this.$store.state.graph)
      }
    },
    methods: {
      hidePopup() {
        this.Mentity.show = false
        this.rightMenu.show = false
      },
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
        this.value = value
        this.$store.dispatch('setRoot', tar)
      }
    }
  }
</script>

<style>
  .shititupu{
    max-width: 1140px;
    padding: 16px;
    margin:16px auto 0px;
    background-color: #fff;
    border-radius: 2px;
  }
  .shititupu button{
    border:1px solid transparent;
    box-shadow: #e8e8e8 2px 2px 6px 0.3px ;
  }
  #chart{
    max-width: 1140px;
    text-align: center;
    margin: auto;
    background-color: white;
    border-radius:4px;
  }
</style>
