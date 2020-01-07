<template>
  <div>
    <p v-if="properties" v-for="(item, $index) in properties" :key="$index" style="font-size: 16px">
      <label>
        <a-button size="small" @click="checkHis(item)" class="title-btn">{{item.name}}：</a-button>
        <span v-if="item.isMedia">
          <a-button size="small" @click="showMediaViewModal (item)">预览{{item.type}}</a-button>
          <a-button size="small" @click="downloadMedia (item)">下载</a-button>
        </span>
        <span v-else>{{item.value}}</span>
        <a-button v-if="!item.isRequired" @click.native="deletePro(item, $index)" type="dashed" size="small">
          <a-Icon type="delete"></a-Icon>
          <!--删除-->
        </a-button>
      </label>
    </p>
    <!--多媒体预览-->
    <media-view-modal :visible.sync="isShowMediaModal" :config="mediaConfig"
                      @close="isShowMediaModal = false"></media-view-modal>
    <!-- 属性历史查看 -->
    <property-history :visible.sync="showHistoryModal" @close="showHistoryModal = false"
                      :pro_key="pro_key"></property-history>
  </div>
</template>

<script>
  import mediaViewModal from '@/components/common/mediaViewModal'
  import propertyHistory from '@/components/common/propertyHistory'

  export default {
    components: {mediaViewModal, propertyHistory},
    props: ['properties', 'config'],
    data() {
      return {
        isShowMediaModal: false,
        showHistoryModal: false,
        mediaConfig: null,
        pro_key: null
      }
    },
    created() {
    },
    methods: {
      showMediaViewModal(item) {
        this.mediaConfig = item
        this.isShowMediaModal = true
      },
      downloadMedia(item) {
        let url = ''
        let properties = this.$store.getters.root ? this.$store.getters.root.properties : this.$store.getters.component_root.properties
        this.$store.dispatch('getNodeById', 'g.V("' + item.value + '")').then(() => {
          url = graph_api + '/util/download.do?id=' + item.value + '&name=' +
            properties['名称'] +
            '&gid=hugegraph'
          try {
            let elemIF = document.createElement('iframe')
            elemIF.src = url
            elemIF.style.display = 'none'
            document.body.appendChild(elemIF)
          } catch (e) {
          }
          // window.open(url)
        })
      },
      checkHis(item) {
        this.showHistoryModal = true
        this.pro_key = item.name
      },
      hidePopup() {
        this.isShowMediaModal = false
      },
      deletePro(item, index) {
        const vm = this
        let obj = {}
        obj[item.name] = item.value
        this.$confirm({
          title: '确定要删除吗？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            vm.$store.dispatch('deleteProperties',
              {id: vm.config.id, label: vm.config.label, property: obj, type: vm.config.type})
              .then(() => {
                vm.$message.success('删除成功！')
                vm.$emit('delete_prop', item.name)
              })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .title-btn {
    border: 0;
    background: transparent;
    box-shadow: none;
    padding: 0;
  }
</style>
