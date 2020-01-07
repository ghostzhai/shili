<template>
  <div class="component-child-container">
    <a-drawer
      :title="config.type==='node' ? '节点详情' : '关联详情'"
      :placement="'left'"
      :closable="false"
      @close="$emit('close')"
      :visible.sync="visible">
      <div class="root-information" style="padding: 10px;font-size: 16px" v-if="config.data">
        <p>
          <label>label：<span>{{config.data.label}}</span></label>
        </p>
        <p>
          <label>type：<span>{{config.data.type}}</span></label>
        </p>
        <property-list :properties="properties" :config="proConfig" @delete_prop="reloadProperties"></property-list>
      </div>
    </a-drawer>
  </div>
</template>

<script>
  import propertyList from '@/components/common/propertyList'

  import {graph, cm} from '@/util/index'

  export default {
    components: {propertyList},
    props: {
      'visible': {
        type: Boolean,
        default: false
      },
      'config': {
        type: Object,
        default: () => {return {}}
      }
    },
    data() {
      return {
        properties: []
      }
    },
    watch: {
      'visible': function (value) {
        if (value) this.properties = getProperties(this)
      }
    },
    computed: {
      proConfig() {
        return {
          id: this.config.data.id,
          label: this.config.data.label,
          type: this.config.type
        }
      }
    },
    methods: {
      reloadProperties() {
        const vm = this
        this.properties = getProperties(this)
        setTimeout(function () {
          vm.$store.state.chart.reloadData()
        }, 100)
      }
    }
  }

  function getProperties(that) {
    let properties = (that.config && that.config.data) ? that.config.data.properties : {}
    let returnPro = []
    for (let p in properties) {
      let isMedia = graph.isMedia(that.$store.state.all_properties.propertykeys, p)
      let user_data = graph.getUser_data(that.$store.state.all_properties.propertykeys, p)
      let isRequired = graph.isRequired(that.config.data.label, p)
      returnPro.push({
        name: p,
        value: properties[p],
        isMedia: isMedia,
        type: user_data ? user_data.type : null,
        isRequired: isRequired
      })
    }
    return returnPro
  }
</script>

<style></style>
