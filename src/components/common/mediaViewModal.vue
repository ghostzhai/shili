<template>
  <a-modal
    title="布局"
    :visible.sync="visible"
    :confirmLoading="confirmLoading"
    style="top: 20px;height: 100%"
    width="90%"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">关闭</a-button>
    </template>
    <div id="layDiv" class="mod-ht" v-if="url">
      <video id="myVideo" v-if="config && (config.type=='视频' || config.type=='音频')"
             class="video-js vjs-default-skin vjs-fluid" controls preload="none"
             data-setup='{ "html5" : { "nativeTextTracks" : false }}'>
        <source id="mySource" :src="url" type="video/mp4">
      </video>
      <!--http://192.168.1.55:8090/util/loadMedia.do?id=70cf011a617240db966b261f62d59d4d&name=discovery.txt&gid=hugegraph-->
      <!--http://192.168.1.55:8090/util/loadMedia.do?id=6dbd34a4c36d45158c292905e07bec5c&name=oceans.mp4&gid=hugegraph-->
      <iframe v-if="config && (config.type=='图像' || config.type=='文本')" :src="url"></iframe>
    </div>
  </a-modal>
</template>

<script>
  import {graph} from '@/util/index'
  import layoutGraph from '@/components/layoutGraph'

  export default {
    components: {layoutGraph},
    props: ['visible', 'config'],
    data() {
      return {
        confirmLoading: false,
        url: ''
      }
    },
    watch: {
      'config.value': function () {
        const vm = this
        let properties = vm.$store.getters.root ? vm.$store.getters.root : vm.$store.getters.component_root
        this.url = ''
        if (!properties) {
          this.$store.dispatch('getNodeById', 'g.V("' + this.config.value + '")').then(() => {
            vm.url = graph_api + '/util/loadMedia.do?id=' + vm.config.value + '&name=' + properties['名称'] + '&gid=hugegraph'
          })
        } else {
          vm.url = graph_api + '/util/loadMedia.do?id=' + vm.config.value + '&name=' + properties['名称'] + '&gid=hugegraph'
        }
      },
    },
    created() {
    },
    methods: {
      handleCancel() {
        if (this.config && (this.config.type === '视频') || (this.config.type === '音频')) {
          let video = document.getElementById('myVideo');
          video.pause()
        }
        this.$emit('close')
      }
    }
  }
</script>

<style></style>
