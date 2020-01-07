<template>
  <a-modal
    title="编辑实体"
    :visible.sync="visible"
    :confirmLoading="confirmLoading"
    width="40%"
    okText="确认"
    cancelText="取消"
    @ok="handleOk"
    @cancel="handleCancel">
    <a-form
      :form="form"
    >
      <a-form-item label="链接串" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input v-decorator="[ 'con', {rules: [{ required: true, message: '请输入！' }]}]"/>
      </a-form-item>
      <a-form-item label="用户名" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input v-decorator="['username',{rules: [{ required: true, message: '请输入！' }]} ]"/>
      </a-form-item>
      <a-form-item label="密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input v-decorator="[ 'password',{rules: [{ required: true, message: '请输入！' }]}]"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
  import {graph} from '@/util/index'

  export default {
    components: {},
    props: ['visible', 'type'],
    data() {
      return {
        confirmLoading: false,
        formLayout: 'horizontal',
        form: this.$form.createForm(this),
      }
    },
    methods: {
      handleOk(e) {
        const vm = this
        vm.confirmLoading = true
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            values['type'] = vm.type
            console.log('Received values of form: ', values);
            this.$store.dispatch('setDatabaseInfo', values).then((result) => {
              this.$emit('close')
            })
          }
          vm.confirmLoading = false
        });
      },
      handleCancel() {
        this.$emit('close')
      }
    }
  }
</script>

<style></style>
