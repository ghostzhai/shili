<template>
  <a-modal
    title="Basic Modal"
    :visible.sync="visible"
    @ok="handleOk"
    @cancel="$emit('close')"
    destroyOnClose>
    <a-form :form="form">
      <a-form-item label="名称："
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <!-- v-decorator form表单特有，0位设置变量名，1位当前输入框的一些配置项:rules位检测规则、initialValue设置初始值 -->
        <a-input v-decorator="[
                          'name',
                          {
                            rules: [{ required: true, message: '名称' }]
                          }
                        ]"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
  export default {
    props: ['visible'],
    components: {},
    data() {
      const formItemLayout = {// form表单布局设置
        labelCol: {span: 6},
        wrapperCol: {span: 12}
      }
      return {
        formItemLayout
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this)// 创建一个表单对象
    },
    methods: {
      handleOk: function () {// 点击确认后执行方法
        this.form.validateFields((err, values) => {// form表单验证
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
      }
    }
  }
</script>

<style></style>
