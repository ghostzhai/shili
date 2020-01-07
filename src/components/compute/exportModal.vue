<template>
  <a-modal
    title="生成子图"
    :visible.sync="visible"
    :confirmLoading="confirmLoading"
    width="40%"
    okText="确认"
    cancelText="取消"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form
      :form="form"
    >
      <a-form-item label="文件名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input v-decorator="[ 'con', {rules: [{ required: true, message: '请输入！' }]}]"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
    export default {
      name: "export-modal",
      props: ['visible','rulesMs'],
      data() {
          return {
            confirmLoading: false,
            form: this.$form.createForm(this),
            graphName: ''
          }
      },
      methods: {
        handleOk (e) {
          const vm = this
          e.preventDefault();
          vm.form.validateFields((err, values) => {
            if (!err) {
              vm.graphName = values
              this.$store.dispatch('createZt',{graphName: vm.graphName.con,gremlin:vm.rulesMs,pGraph:g_id})
                .then((data) => {
                  if(data.data)
                  this.$confirm({
                    title: '生成子图成功,你要跳转到子图浏览吗？',
                    onOk() {
                      console.log('OK');
                      // vm.$router.push({path: '/compute/manager'})
                      window.open(`/#/compute/subgraph/${data.data}`)
                    },
                    onCancel() {
                      console.log('Cancel');
                    },
                    class: 'test',
                  });
                })
              this.$emit('close')
            }
          });
        },
        handleCancel() {
          this.$emit('close')
        }
      }
    }
</script>

<style scoped>

</style>
