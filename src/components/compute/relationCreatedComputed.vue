<template>
  <div>
    <a-row style="padding: 16px 20px;">
      <a-col><span>生成规则</span></a-col>
    </a-row>
    <a-row v-for="(item, $index) in list" :key="$index">
      <child-item :index="$index" :defaultRule="item" @created="appendItem" @clear="$emit('clear')"></child-item>
    </a-row>
    <a-row style="padding: 16px 20px;text-align: right;">
      <a-button @click="addRules">
        <a-icon type="plus-circle"/>
      </a-button>
      <a-button @click="createResult">生成</a-button>
    </a-row>
  </div>
</template>

<script>
  import childItem from '@/components/compute/childItem'

  export default {
    props: ['links'],
    components: {childItem},
    data() {
      return {
        list: [{
          source: null,
          link: null,
          target: null
        }],
        lastSource: null,
        result: []
      }
    },
    watch: {
      'links': function () {
        const vm = this
        if (vm.links) {
          vm.list = []
          vm.links.forEach((v) => {
            vm.all_link.forEach((lv) => {
              if (lv.name === v) {
                vm.list.push({
                  source: lv.source_label,
                  link: lv.id,
                  target: lv.target_label
                })
              }
            })
          })
        }
      }
    },
    computed: {
      'all_link': function () {
        return this.$store.getters.all_link
      }
    },
    methods: {
      addRules() {
        let source = ''
        if (this.lastSource) {
          source = this.lastSource
        }
        this.list.push({
          source: source,
          link: null,
          target: null
        })
      },
      createResult() {
        this.$emit('created', this.result)
      },
      appendItem(item) {
        if (item.target) {
          this.lastSource = item.target
        }
        this.result[item.index] = item.link
      }
    }
  }
</script>
