<template>
  <div>
    <a-row style="padding: 16px 20px;">
      <a-col><span>生成规则</span></a-col>
    </a-row>
    <a-row type="flex" justify="space-around" align="middle" style="margin-bottom: 20px">
      <a-col :span="5">
        <a-select :style="{ width: '100%'}" @change="sourceTypeChange" v-model="sourceType">
          <a-select-option :value="item.name" v-for="item in all_node" :key="item.name">{{item.name}}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="5">
        <a-select :style="{ width: '100%'}" @change="linkChange" v-model="link">
          <a-select-option :value="item.id" v-for="item in linkList" :key="item.id">{{item.name}}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="5">
        <a-input v-model="targetType" disabled/>
      </a-col>
    </a-row>
    <a-row type="flex" justify="space-around" align="middle" style="margin-bottom: 20px">
      <a-col :span="5">
        <a-input v-model="sourceTypeCreated" disabled/>
      </a-col>
      <a-col :span="5">
        <a-select :style="{ width: '100%'}" @change="link2Change" v-model="link2">
          <a-select-option :value="item.id" v-for="item in link2List" :key="item.id">{{item.name}}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="5">
        <a-input v-model="targetTypeCreated" disabled/>
      </a-col>
    </a-row>
    <a-row style="padding: 16px 20px;text-align: right;">
      <a-button @click="createResult">生成</a-button>
    </a-row>
  </div>
</template>

<script>
  export default {
    props: ['entity'],
    data() {
      return {
        sourceType: '',
        targetType: '',
        link: '',
        relation: null,
        linkList: [],
        sourceTypeCreated: '',
        targetTypeCreated: '',
        link2: '',
        relation2: null,
        link2List: []
      }
    },
    watch: {
      'entity': function () {
        const vm = this
        vm.sourceType =  '',
        vm.targetType = ''
        vm.link = ''
        vm.linkList = []
        vm.sourceTypeCreated = ''
        vm.targetTypeCreated = ''
        vm.link2 = ''
        vm.link2List = []
        if (vm.entity) {
          vm.sourceType = vm.entity.sourceResult
          vm.targetTypeCreated = vm.entity.targetResult

          vm.all_link.forEach((v) => {
            if (v.source_label === vm.sourceType && v.name === vm.entity.link1) {
              vm.targetType = v.target_label
              vm.sourceTypeCreated = v.target_label
            }
            if (v.source_label === vm.sourceType) {
              vm.linkList.push(v)
            }
            if (v.source_label === vm.sourceTypeCreated) {
              vm.link2List.push(v)
            }
            if (v.name === vm.entity.link1) {
              vm.link = v.id
            }
            if (v.name === vm.entity.link2) {
              vm.link2 = v.id
            }
          })
        }
      }
    },
    computed: {
      'all_node': function () {
        return this.$store.getters.all_node
      },
      'all_link': function () {
        return this.$store.getters.all_link
      }
    },
    methods: {
      sourceTypeChange() {
        const vm = this
        vm.targetType = ''
        vm.link = ''
        vm.linkList = []
        vm.sourceTypeCreated = ''
        vm.targetTypeCreated = ''
        vm.link2 = ''
        vm.link2List = []
        /* 以上为清空操作 */

        let links = this.all_link
        links.forEach((v) => {
          if (v.source_label === vm.sourceType) {
            vm.linkList.push(v)
          }
        })
        vm.$emit('cancel')
      },
      linkChange() {
        const vm = this
        vm.targetType = ''
        vm.sourceTypeCreated = ''
        vm.targetTypeCreated = ''
        vm.link2 = ''
        vm.link2List = []
        /* 以上为清空操作 */

        let links = vm.all_link
        links.forEach((v) => {// 第一次循环获得target类型
          if (vm.link === v.id) {
            vm.targetType = v.target_label
            vm.sourceTypeCreated = v.target_label
            vm.relation = v
          }
        })

        links.forEach((v) => {// 第二次循环获得关系2的列表
          if (v.source_label === vm.sourceTypeCreated) {
            vm.link2List.push(v)
          }
        })
        vm.$emit('cancel')
      },
      link2Change() {
        const vm = this
        vm.targetTypeCreated = ''
        /* 以上为清空操作 */
        let links = vm.all_link
        links.forEach((v) => {// 循环获得sourceCreated类型
          if (vm.link2 === v.id) {
            vm.targetTypeCreated = v.target_label
            vm.relation2 = v
          }
        })
        vm.$emit('cancel')
      },
      createResult() {
        this.$emit('created', {
          source: this.sourceType,
          target: this.targetTypeCreated,
          link1: this.relation.name,
          link2: this.relation2.name
        })
      }
    }
  }
</script>
