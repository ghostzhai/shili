<template>
  <a-modal
    title="索引操作"
    :visible.sync="visible"
    width="60%"
    okText="确认"
    cancelText="取消"
    @ok="handleOk"
    @cancel="$emit('close')">
    <a-form :form="form">
      <a-form-item label="名称："
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-input v-decorator="[
                          'name',
                          {
                            rules: [{ required: true, message: '名称' }]
                          }
                        ]"/>
      </a-form-item>
      <a-form-item label="属性："
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-select v-decorator="[
                          'property',
                          {
                            rules: [{ required: true, message: '请输入属性' }]
                          }
                        ]">
          <a-select-option v-for="item in config" :key="item" :value="item">{{item}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="类型："
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-select v-decorator="[
                          'type',{
                            rules: [{ required: true, message: '请输入类型' }]
                          }
                        ]">
          <a-select-option value="SECONDARY">secondary</a-select-option>
          <a-select-option value="RANGE">range</a-select-option>
          <a-select-option value="SEARCH">search</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
  export default {
    props: {
      'visible': {
        type: Boolean,
        default: false
      },
      'config': {
        type: Array,
        default: () => {return []}
      }
    },
    components: {},
    data() {
      const formItemLayout = {
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
      handleOk() {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.$emit('ok', values)
          }
        })
      }
    }
  }
</script>

<style></style>
