<template>
  <div class="upload-panel">
    <slot name="download"></slot>
    <a-upload style="display: inline-block"
              :accept="accept"
              :fileList="fileList"
              :remove="handleRemove"
              :beforeUpload="beforeUpload">
      <a-button>选择文件</a-button>
    </a-upload>

    <a-button
      @click="handleUpload"
      :disabled="fileList.length === 0"
      :loading="uploading">
      {{uploading ? '上传中...' : state }}
    </a-button>
    <a-input v-model="filename" placeholder="输入多媒体名称" @change="handleChange"/>
  </div>
</template>

<script>
  let timeout
  export default {
    props: ['type', 'index'],
    components: {},
    data() {
      return {
        state: '上传',
        uploading: false,
        fileList: [],
        filename: null,
        media: {}
      }
    },
    computed: {
      'accept': function () {
        // 视频 mp4，webm，ogv
        switch (this.type) {
          case '文本':
            return '*'
          case '图像':
            return 'image/*'
          case '音频':
            return 'audio/*'
          case '视频':
            return 'video/*'
          default:
            return '*'
        }
      }
    },
    methods: {
      handleChange(value) {
        const vm = this
        if (timeout) {
          clearTimeout(timeout)
          timeout = null
        }
        function getResult() {
          vm.media.filename = value
          vm.media.type = vm.type
          vm.$emit('uploaded', vm.media, vm.index)
        }
        timeout = setTimeout(getResult, 300)// 延迟搜索
      },
      handleRemove(file) {
        const index = this.fileList.indexOf(file)
        const newFileList = this.fileList.slice()
        newFileList.splice(index, 1)
        this.fileList = newFileList
      },
      beforeUpload(file) {
        //        this.fileList = [...this.fileList, file]
        this.fileList = [file]
        this.filename = file.name
        return false
      },
      handleUpload() {
        const vm = this
        const formData = new FormData()
        formData.append('gid', g_id)
        formData.append('file', this.fileList[0])
        this.uploading = true
        let file = formData.get('file'), gid = formData.get('gid')
        this.$store.dispatch('upload', formData).then((data) => {
          vm.uploading = false
          vm.media = data.data
          vm.media.filename = vm.filename
          vm.media.type = vm.type
          vm.state = '上传完毕'
          vm.$emit('uploaded', vm.media, vm.index)
        })
      }
    }
  }
</script>

<style>
  .ant-upload-list {
    display: inline-block;
  }
</style>
