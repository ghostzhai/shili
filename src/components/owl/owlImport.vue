<template>
  <div class="container">
      <a-layout class="pd-ben">
        <a-row class="pd-ben-box">
          <a-row type="flex" justify="center">
            <a-col :span="24">
              <a-upload-dragger name="file" :multiple="false" :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload">
                <p class="ant-upload-drag-icon">
                  <a-icon type="inbox" />
                </p>
                <p class="ant-upload-text">OWL-导入</p>
                <p class="ant-upload-hint">请选择要上传的文件</p>
              </a-upload-dragger>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" style="margin-top: 40px;">
            <a-col :span="24">
              <!--<a-button type="default" @click="handleCancel" :disabled="fileList.length === 0">取消</a-button>-->
              <a-button type="primary" @click="handleImport" :loading="btnLoading">确定</a-button>
            </a-col>
          </a-row>
        </a-row>
      </a-layout>
  </div>
</template>
<script>
  export default {
    name: 'owl-import',
    data () {
      return {
        importOwl: null,
        fileList: [],
        ModalText: 'Content of the modal',
        visible: false,
        confirmLoading: false,
        btnLoading: false
      }
    },
    methods: {
      /* 以下为上传的代码 */
      handleRemove(file) {
        const index = this.fileList.indexOf(file)
        const newFileList = this.fileList.slice()
        newFileList.splice(index, 1)
        this.fileList = newFileList
      },
      handleCancel () {
        this.fileList= []
        this.$message.warning(`取消上传`);
      },
      beforeUpload(file) {
        //        this.fileList = [...this.fileList, file]
        this.fileList = [file]
        return false
      },
      handleImport(){
        const vm = this
        const formData = new FormData()
        if(this.fileList.length === 0) {
          this.$message.error(`请选择OWL文件`);
          return
        }
        formData.append('file', this.fileList[0])
        // this.uploading = true
        // let file = formData.get('file')
        this.btnLoading = true
        this.$store.dispatch('importOwl', formData).then((data) => {
          vm.importOwl = data
          console.log(vm.importOwl)
          this.btnLoading = false
          if(vm.importOwl.code == 200){
            this.$confirm({
              title: '导入成功',
              // content: JSON.stringify(data),
              async onOk() {
                window.location.reload()
              }
            });
            // this.$message.success(`上传成功`);
          }else{
            this.$message.error(`请选择OWL文件`);
          }
        })
      }
    },



  }
</script>
<style scoped>
  .pd-ben{
    text-align: center;
  }
  .pd-ben-box{
    background: #ffff;
    padding: 60px 60px;
  }
</style>
