<template>
  <div class="container overf-hidden">
    <a-layout class="a-l">
      <a-layout-header class="a-l-header">
        <a-row type="flex" justify="start">
          <a-col :span="5">
            <b>属性列表</b>
          </a-col>
          <a-col :span="15"><b>
            <template v-if="current_property.name">{{current_property.name}}</template>
            <template v-else>新建属性</template>
          </b></a-col>
        </a-row>
      </a-layout-header>
      <a-layout>
        <a-layout-sider
          class="overf-hidden-lie"
          style="background: #fff"
          width="250"
          breakpoint="lg"
          collapsedWidth="0">
          <a-menu
            mode="inline"
            :style="{ height: '100%', borderRight: 0,}"
          >
            <a-menu-item class="lieb-c">
              <a-input-search
                placeholder="输入搜索文本"
                style="width: 200px"
                v-model="searchStr"
              />
            </a-menu-item>
            <a-menu-item>
              <a-button @click="addProperty" style="width: 200px" type="dashed"> 新建</a-button>
            </a-menu-item>
            <a-menu-item :key="item.id" v-for="item in properties"
                         @click="selected(item)">
              <a-badge status="success"/>
              {{item.name}}
            </a-menu-item>
          </a-menu>
        </a-layout-sider>


        <a-layout-content>
          <div class="pd-20" v-if="new_property || current_property.id">
            <a-form :form="form">
              <!--<h2 v-if="current_property.name">{{current_property.name}}</h2>-->
              <!--<h2 v-else>新建属性</h2>-->
              <!--<a-form-item label="Code："-->
              <!--:label-col="formItemLayout.labelCol"-->
              <!--:wrapper-col="formItemLayout.wrapperCol">-->
              <!--<a-input v-decorator="[-->
              <!--'id',-->
              <!--{-->
              <!--rules: [{ required: true, message: '请输入Code' }],-->
              <!--initialValue: current_property.id-->
              <!--}-->
              <!--]"/>-->
              <!--</a-form-item>-->
              <a-form-item label="属性名称："
                           :label-col="formItemLayout.labelCol"
                           :wrapper-col="formItemLayout.wrapperCol">
                <a-input :disabled="!new_property" v-decorator="[
                          'name',
                          {
                            rules: [{ required: true, message: '请输入属性名称' }],
                            initialValue: current_property.name
                          }
                        ]"/>
              </a-form-item>
              <a-form-item label="类型："
                           :label-col="formItemLayout.labelCol"
                           :wrapper-col="formItemLayout.wrapperCol">
                <a-select :disabled="!new_property"
                  v-decorator="[
                    'link',
                    {
                      rules: [{ required: true, message: '请选择关联类型' }],
                            initialValue: current_property.user_data&&current_property.user_data.type?'MEDIA':current_property.data_type
                    }
                  ]"
                  placeholder="选择一个类型"
                  @change="handleChange">
                  <a-select-option value="TEXT">TEXT</a-select-option>
                  <a-select-option value="DATE">DATE</a-select-option>
                  <a-select-option value="UUID">UUID</a-select-option>
                  <a-select-option value="BYTE">BYTE</a-select-option>
                  <a-select-option value="BLOB">BLOB</a-select-option>
                  <a-select-option value="INT">INT</a-select-option>
                  <a-select-option value="FLOAT">FLOAT</a-select-option>
                  <a-select-option value="DOUBLE">DOUBLE</a-select-option>
                  <a-select-option value="LONG">LONG</a-select-option>
                  <a-select-option value="MEDIA">多媒体</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="多媒体类型："
                           v-if="linkType === 'MEDIA'||current_property.user_data&&current_property.user_data.type"
                           :label-col="formItemLayout.labelCol"
                           :wrapper-col="formItemLayout.wrapperCol">
                <a-select :disabled="!new_property" v-if="linkType === 'MEDIA'||current_property.user_data&&current_property.user_data.type"
                          v-decorator="[
                    'media',
                    {
                      rules: [{ required: function(){return linkType === 'MEDIA'}, message: '请选择多媒体类型' }],
                      initialValue:current_property.user_data&&current_property.user_data.type
                    }
                  ]"
                          placeholder="选择一个多媒体类型">
                  <a-select-option value="文本">文本</a-select-option>
                  <a-select-option value="图像">图像</a-select-option>
                  <a-select-option value="音频">音频</a-select-option>
                  <a-select-option value="视频">视频</a-select-option>
                </a-select>
              </a-form-item>
              <!--<a-form-item label="标题："-->
              <!--:label-col="formItemLayout.labelCol"-->
              <!--:wrapper-col="formItemLayout.wrapperCol">-->
              <!--<a-input v-decorator="[-->
              <!--'title',-->
              <!--{-->
              <!--rules: [{ required: false, message: '请输入标题' }],-->
              <!--initialValue: current_property.user_data ? current_property.user_data.showname : null-->
              <!--}-->
              <!--]"/>-->
              <!--</a-form-item>-->
            </a-form>
            <a-row>
              <a-col :span="19"></a-col>
              <a-col :span="4">
                <a-button v-if="!new_property" @click="remove()" style="float: right">删除</a-button>
                <a-button v-if="new_property" @click="create()" type="primary" style="float: right">新建</a-button>
              </a-col>
            </a-row>
          </div>
        </a-layout-content>
      </a-layout>
      <a-row style="border-top: 1px solid #ebedf0;height:30px;"><br></a-row>
    </a-layout>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import schema from '../../util/schema'

  export default {
    components: {},
    data() {
      const formItemLayout = {
        labelCol: {span: 3},
        wrapperCol: {span: 20}
      }
      return {
        formItemLayout,
        current_property: {},
        searchStr: '',
        linkType: null,
        new_property: false
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this)// 创建一个表单对象
    },
    computed: {
      'properties': function () {
        let properties = this.$store.state.all_properties ? this.$store.state.all_properties.propertykeys : []
        let searchInputValue = this.searchStr
        //如果存在，根据条件过滤
        if (searchInputValue) {
          return properties.filter(function (daily) {
            return String(daily.name).indexOf(searchInputValue) > -1
          })
        }
        // 如果不存在，整体返回
        return properties
      }
    },
    methods: {
      ...mapActions(['gremlin', 'getAllProperties', 'getAllNode', 'getAllLink']),
      selected(item) {
        this.form.resetFields();
        this.current_property = item;
        this.new_property = false
      },
      addProperty() {
        this.form.resetFields();
        this.new_property = true;
        this.current_property = {}
      },
      handleChange(key) {
        this.linkType = key
      },
      /**
       * 显示服务器错误
       * @param msg 附加信息
       */
      error(msg) {
        if (typeof msg === 'undefined') msg = '未知服务器错误';
        this.$error({
          title: '服务器错误',
          content: msg,
        });
      },
      /**
       * 显示成功信息
       * @param msg 附加信息
       */
      success(msg) {
        if (typeof msg === 'undefined') msg = '执行成功';
        this.$success({
          title: '成功',
          content: '',
        });
      },
      /**
       * 新建属性
       */
      create() {
        // 验证1.值都存在
        this.form.validateFields(async (err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            let data = false
            // 验证2.code不存在,可以新建
            data = await this.gremlin(schema.property.getByName(values.name));
            if (data.code !== 500) {
              this.error('属性已经存在,不能重复建立')
            } else {
              data = await this.gremlin(schema.property.create(values));
              if (data.code === 500) {
                this.error(data.message)
              } else {
                // 提交成功,刷新左侧列表
                data = await this.getAllProperties(true);
                // 自动选中新建的属性
                if (data && data.propertykeys) {
                  for (let i = 0; i < data.propertykeys.length; i++) {
                    var item = data.propertykeys[i]
                    if (item.name === values.name) {
                      this.selected(item)
                      this.success('成功建立属性:' + values.name)
                      linkType = null
                      break
                    }
                  }
                }
              }
            }
            this.form.resetFields();
          }
        });
      },
      async remove() {
        // 验证3.基于此属性的边不存在
        // 验证4.基于此属性的节点不存在
        if (this.current_property && this.current_property.name) {
          // const nodes = this.getAllNodes()
          // const links = this.getAllLinks()
          const name = this.current_property.name
          const str = schema.property.deleteByName(name)
          console.log(str)
          let data = await this.gremlin(str);
          // let data = await schema_remove_index
          if (false && data.code === 500) {
            this.error(data.message)
          } else {
            data = await this.getAllProperties(true);
            let found = false
            if (data && data.propertykeys) {
              for (let i = 0; i < data.propertykeys.length; i++) {
                var item = data.propertykeys[i]
                if (item.name === name) {
                  found = true
                }
              }
            }
            if (found) {
              this.error('删除失败')
            } else {
              this.addProperty()
              this.success('成功删除属性:' + name)
            }
          }
        }
      }
    }
  }
</script>

<style>
  .overf-hidden-lie {
    overflow: auto;
    overflow-x: hidden;
    background: #fff;
  }

  .overf-hidden {
    overflow: hidden;
  }

  .ant-card-hoverable:hover {
    border-color: #40a9ff;
  }

  .ant-card-meta-detail :hover {
    color: #1890FF;
  }

  .a-l {
    background: #fff;
  }

  .ant-layout.ant-layout-has-sider > .ant-layout, .ant-layout.ant-layout-has-sider > .ant-layout-content {
    background-color: rgba(249, 250, 251, 0.6);
  }

  .ant-layout-content {
  / / background-color: red;
  }

  .a-l-header {
    background: #fff;
    padding: 0 25px;
    border-bottom: 1px solid #ebedf0;
    line-height: 50px;
    height: 50px;
  }

  .a-l-header b {
    font-weight: 600;
    color: #666;
  }
</style>
