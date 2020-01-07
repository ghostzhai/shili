<template>
  <a-row type="flex"
         justify="space-around"
         align="middle"
         style="margin-bottom: 20px">
    <a-col :span="5">
      <a-select :style="{ width: '100%'}"
                :disabled="!!defaultRule.source && !defaultRule.link"
                @change="sourceTypeChange"
                v-model="source">
        <a-select-option :value="item.name" v-for="item in all_node" :key="item.name">{{item.name}}</a-select-option>
      </a-select>
    </a-col>
    <a-col :span="5">
      <a-select :style="{ width: '100%'}" @change="linkChange" v-model="link">
        <a-select-option :value="item.id" v-for="item in linkList" :key="item.id">{{item.name}}</a-select-option>
      </a-select>
    </a-col>
    <a-col :span="5">
      <a-select :style="{ width: '100%'}" @change="targetTypeChange" v-model="target">
        <a-select-option :value="item.name" v-for="item in all_node" :key="item.name">{{item.name}}</a-select-option>
      </a-select>
    </a-col>
  </a-row>
</template>

<script>
  export default {
    props: ['defaultRule', 'index'],
    data() {
      return {
        source: '',
        link: '',
        target: '',
        linkList: [],
        targetList: []
      }
    },
    created() {
      const vm = this
      if (vm.defaultRule.source) {
        vm.source = vm.defaultRule.source
        let links = vm.all_link
        links.forEach((v) => {
          if (v.source_label === vm.source) {
            vm.linkList.push(v)
          }
        })
      }
      if (this.defaultRule.source && this.defaultRule.link && this.defaultRule.target) {
        this.source = this.defaultRule.source
        this.link = this.defaultRule.link
        this.target = this.defaultRule.target
        let links = this.all_link
        links.forEach((v) => {
          if (v.source_label === vm.source) {
            vm.linkList.push(v)
          }
        })
      }
    },
    watch: {
      'defaultRule': function () {
        const vm = this
        this.source = ''
        this.link = ''
        this.target = ''
        if (this.defaultRule.source && this.defaultRule.link && this.defaultRule.target) {
          this.source = this.defaultRule.source
          this.link = this.defaultRule.link
          this.target = this.defaultRule.target
          let links = this.all_link
          links.forEach((v) => {
            if (v.source_label === vm.source) {
              vm.linkList.push(v)
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
        vm.link = ''
        vm.target = ''

        let links = this.all_link
        links.forEach((v) => {
          if (v.source_label === vm.source) {
            vm.linkList.push(v)
          }
        })
        this.$emit('clear')
      },
      linkChange() {
        const vm = this
        vm.target = ''

        let links = vm.all_link
        links.forEach((v) => {// 第一次循环获得target类型
          if (vm.link === v.id) {
            vm.target = v.target_label
            vm.relation = v
          }
        })
        this.$emit('clear')
        this.$emit('created', {index: this.index, link: this.relation.name, target: this.target})
      },
      targetTypeChange() {
        this.$emit('created', {index: this.index, link: this.relation.name, target: this.target})
      }
    }
  }
</script>
