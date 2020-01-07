<template>
  <a-modal
    title="Basic Modal"
    :visible.sync="visible"
    @ok="handleOk"
    @cancel="$emit('close')"
    destroyOnClose>
    <a-form :form="form">
      <a-form-item v-for="(value, key) in values"
         :key="key"
         :label="translate[key]"
         :label-col="formItemLayout.labelCol"
         :wrapper-col="formItemLayout.wrapperCol">
        <!-- v-decorator form表单特有，0位设置变量名，1位当前输入框的一些配置项:rules位检测规则、initialValue设置初始值 -->
        <a-input v-decorator="[
            `${key}`,
            {
              rules: [{ required: true, message: '请填写' + translate[key] }],
              initialValue: value
            }]"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
  export default {
    props: ['visible', 'initValues'],
    components: {},
    data() {
      const values = {// 定义一个变量，循环定义表单
        name: 'Jack',
        email: '255855@qq.com',
        age: '18',
        address: '辽宁大连市',
        '电话': '13888888888'
      }
      const translate = {// 定义一个翻译values中key成中文，form的变量也支持设置中文
        name: '姓名',
        email: '邮箱',
        age: '年龄',
        address: '地址',
        '电话': '电话'
      }
      const formItemLayout = {// form表单布局设置
        labelCol: {span: 6},
        wrapperCol: {span: 12}
      }
      return {
        values,
        translate,
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
