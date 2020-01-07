<template>
  <div class="component-child-container">
    <a-drawer
      :placement="'right'"
      :closable="false"
      @close="onClose"
      :visible.sync="visible">
      <a-card title="设定显示层数">
        <a-radio-group v-model="level" @change="autoLevel = ''">
          <a-radio :value="1">1</a-radio>
          <a-radio :value="2">2</a-radio>
          <a-radio :value="3">3</a-radio>
        </a-radio-group>
        <a-input v-model="autoLevel" type="number" placeholder="输入显示层级" @change="autoSetting" style="margin-top: 10px"/>
      </a-card>
      <a-card title="设定分析主体">
        <a-checkbox
          slot="extra"
          :indeterminate="indeterminateEntity"
          @change="onCheckAllEntity"
          :checked="checkAllEntity">
          全选
        </a-checkbox>

        <a-checkbox-group class="ch-box-shd" :options="entities" v-model="checkedEntities" @change="onEntity"/>
      </a-card>
      <a-card title="设定分析关系">
        <a-checkbox
          slot="extra"
          :indeterminate="indeterminateLink"
          @change="onCheckAllLink"
          :checked="checkAllLink">
          全选
        </a-checkbox>
        <a-checkbox-group :options="links" v-model="checkedLinks" @change="onLink"/>
      </a-card>
      <a-card title="请进入下一步">
        <a-button type="primary" @click="getGraph" class="absolute-r-l">分析</a-button>
      </a-card>
    </a-drawer>
  </div>
</template>

<script>
  import {graph} from '@/util/index'

  export default {
    props: ['visible', 'config'],
    components: {},
    data() {
      return {
        level: 1,
        autoLevel: '',
        checkedEntities: [],
        checkAllEntity: true,
        indeterminateEntity: true,
        checkedLinks: [],
        checkAllLink: true,
        indeterminateLink: true
      }
    },
    computed: {
      entities: function () {
        return this.checkedEntities = graph.getNodeTypes(this.$store.state.all_node)
      },
      links: function () {
        return this.checkedLinks = graph.getLinkTypes(this.$store.state.all_link)
      }
    },
    methods: {
      autoSetting(value, v) {
        this.level = null
      },
      onEntity(checkedList) {
        this.indeterminateEntity = !!checkedList.length && (checkedList.length < this.entities.length)
        this.checkAllEntity = checkedList.length === this.entities.length
      },
      onLink(checkedList) {
        this.indeterminateLink = !!checkedList.length && (checkedList.length < this.links.length)
        this.checkAllLink = checkedList.length === this.links.length
      },
      onCheckAllEntity(e) {
        Object.assign(this, {
          checkedEntities: e.target.checked ? this.entities : [],
          indeterminateEntity: false,
          checkAllEntity: e.target.checked
        })
      },
      onCheckAllLink(e) {
        Object.assign(this, {
          checkedLinks: e.target.checked ? this.links : [],
          indeterminateLink: false,
          checkAllLink: e.target.checked
        })
      },
      getGraph() {
        const vm = this
        this.$store.dispatch('set_state', vm.$data)
        let content = {
          checkedLinks: vm.checkAllLink ? [] : vm.checkedLinks,
          checkedEntities: vm.checkAllEntity ? [] : vm.checkedEntities,
          level: vm.level,
          autoLevel: vm.autoLevel
        }
        this.$store.dispatch('refreshGraph', content).then(() => {
          setTimeout(function () {
            vm.$store.state.chart.reloadData()
          }, 100)
        })
      },
      onClose() {
        this.$emit('close')
      }
    }
  }
</script>

<style>
  .ant-drawer-body {
    padding: 0;
  }

  .ant-drawer-body .ant-card-bordered {
    border: none;
  }

  .ant-card .ant-card-bordered {
    border-radius: 0;
  }

  .absolute-r-l {
    position: absolute;
  }

  /*右边栏样式*/
  .ant-card-head-title {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;
    border-bottom: 1px solid #e8e8e8;
  }

  .ant-card-head {
    border-bottom: none;
  }

  .ant-card-extra {
    border-bottom: 1px solid #e8e8e8;
    margin-top: -2px !important;
  }

  .ant-checkbox-group {
    max-width: 200px;
  }

  /*给设定 右边栏checkbox 样式*/
  .ch-box-shd label {
    display: flow-root !important;
  }
</style>
