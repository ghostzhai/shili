<template>
  <a-modal
    title="导入"
    :visible.sync="visible"
    :confirmLoading="confirmLoading"
    width="40%"
    okText="确认"
    cancelText="取消"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form">
      <!--<a-form-item label="文件名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">-->
        <!--<a-input v-decorator="[ 'Mc', {rules: [{ required: true, message: '请输入！' }]}]"/>-->
      <!--</a-form-item>-->
      <a-form-item label="文件" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <div class="upload-panel">
          <a-upload style="display: inline-block"
                    :fileList="fileList"
                    :remove="handleRemove"
                    :beforeUpload="beforeUpload">
            <a-button>选择文件</a-button>
          </a-upload>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
  export default {
    name: 'import-modal',
    props: ['visible'],
    data() {
      return {
        confirmLoading: false,
        form: this.$form.createForm(this),
        fileList: []
      }
    },
    methods: {
      handleOk(e) {
        const vm = this
        this.form.validateFields((err, values) => {
          if (!err) {
            const vm = this
            const formData = new FormData()
            // formData.append('fileName', values.Mc) // 文件名称
            formData.append('file', this.fileList[0])
            let file = formData.get('file')
            console.log(formData)
            this.$emit('close', formData)
          }
        })
      },
      handleCancel() {
        this.$emit('close')
      },
      /* 以下为上传的代码 */
      handleRemove(file) {
        const index = this.fileList.indexOf(file)
        const newFileList = this.fileList.slice()
        newFileList.splice(index, 1)
        this.fileList = newFileList
      },
      beforeUpload(file) {
        this.fileList = [file]
        return false
      }
    }
  }
</script>

<style scoped>

</style>
