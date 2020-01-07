<template>
  <div class="container overf-hidden">
    <a-layout class="a-l">
      <a-layout-header class="a-l-header">
        <a-row type="flex" justify="start">
          <a-col :span="5"><b>关系类型列表</b></a-col>
          <a-col :span="15">
            <b>
              <template v-if="current_link.name">{{current_link.name}}</template>
              <template v-else>新建关系类型</template>
            </b>
          </a-col>
        </a-row>
      </a-layout-header>
      <a-layout>
        <a-layout-sider width="250" class="overf-hidden-lie"
                        breakpoint="lg"
                        collapsedWidth="0">
          <a-menu mode="inline" :style="{ height: '100%', borderRight: 0}">
            <a-menu-item>
              <a-input-search
                placeholder="输入搜索文本"
                style="width: 200px"
                v-model="searchStr"
              />
            </a-menu-item>
            <a-menu-item>
              <a-button @click="addOwl" style="width: 200px" type="dashed">新建</a-button>
            </a-menu-item>
            <a-menu-item :key="item.id" v-for="item in links"
                         @click="selected(item)">
              <a-badge status="success"/>
              {{item.name}}
            </a-menu-item>
          </a-menu>
        </a-layout-sider>

        <a-layout-content>
          <div class="pd-20" v-if="new_link || current_link.id">
            <!--<h2 v-if="current_link.name">{{current_link.name}}</h2>-->
            <!--<h2 v-else>新建关系类型</h2>-->
            <a-Divider orientation="left"><b style="color: #666">关系类型管理</b></a-Divider>
            <!--<h3>关系类型1管理</h3>-->
            <a-row class="ben-attribute">
              <a-form :form="form">
                <!--<a-form-item label="Code："-->
                <!--:label-col="formItemLayout.labelCol"-->
                <!--:wrapper-col="formItemLayout.wrapperCol">-->
                <!--<a-input v-decorator="[-->
                <!--'id',-->
                <!--{-->
                <!--rules: [{ required: true, message: '请输入Code' }],-->
                <!--initialValue: current_link.id-->
                <!--}-->
                <!--]"/>-->
                <!--</a-form-item>-->
                <a-form-item label="名称："
                             :label-col="formItemLayout.labelCol"
                             :wrapper-col="formItemLayout.wrapperCol">
                  <a-input v-decorator="[
                          'name',
                          {
                            rules: [{ required: true, message: '请输入名称' }],
                            initialValue: current_link.name
                          }
                        ]"/>
                </a-form-item>
                <a-form-item label="Source："
                             :label-col="formItemLayout.labelCol"
                             :wrapper-col="formItemLayout.wrapperCol">
                  <a-select v-decorator="[
                          'source_label',
                          {
                            rules: [{ required: true, message: '请输入source' }],
                            initialValue: current_link.source_label
                          }
                        ]">
                    <a-select-option v-for="item in all_owl" :key="item.id" :value="item.name">{{item.name}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="Target："
                             :label-col="formItemLayout.labelCol"
                             :wrapper-col="formItemLayout.wrapperCol">
                  <a-select v-decorator="[
                          'target_label',
                          {
                            rules: [{ required: true, message: '请输入target' }],
                            initialValue: current_link.target_label
                          }
                        ]">
                    <a-select-option v-for="item in all_owl" :key="item.id" :value="item.name">{{item.name}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-form>

              <a-col class="ben-attribute-center"><span>属性：</span>
                <a-button @click="Mproperty = true"> + 添加属性</a-button>
              </a-col>
              <a-table class="ben-attribute-table" :columns="columns" :dataSource="data" :pagination="false"
                       size="small" bordered>
                <a-checkbox slot="isIndex" slot-scope="isIndex" :value="isIndex"></a-checkbox>
                <span slot="operation" slot-scope="text, record, index">
                  <a-button v-if="record.name !== graph_key" @click="data.splice(index, 1);getIndex()" type="dashed" size="small">
                    <a-Icon type="delete"></a-Icon>
                    <!--删除-->
                  </a-button>
                </span>
              </a-table>
            </a-row>
            <a-row>
              <a-col :span="19"></a-col>
              <a-col :span="4">
                <a-button @click="deleteOwl" v-if="!new_link">删除</a-button>
                <a-button @click="ok" type="primary" style="float: right">保存</a-button>
              </a-col>
            </a-row>
            <template v-if="!new_link">
              <a-Divider orientation="left"><b style="color: #666">实体类型索引管理</b></a-Divider>
              <!--<h3>实体类型索引管理</h3>-->
              <a-row class="ben-attribute">
                <a-col class="ben-attribute-center"><span>索引：</span>
                  <a-button @click="newIndex"> + 新建索引</a-button>
                </a-col>
                <a-table class="ben-attribute-table" :columns="indexColumns" :dataSource="indexData" :pagination="false"
                         size="small" bordered>
                <span slot="operation" slot-scope="text, record, index">
                    <a-button v-if="(record.fields&&record.fields[0]) !== graph_key || record.index_type !== 'SEARCH'" @click="deleteIndex(index, record)" type="dashed" size="small">
                     <a-Icon type="delete"></a-Icon>
                      <!--删除-->
                    </a-button>
                </span>
                </a-table>
              </a-row>
            </template>
          </div>
        </a-layout-content>
      </a-layout>
      <a-row style="border-top: 1px solid #ebedf0;height:30px;"><br></a-row>
    </a-layout>

    <property-list :visible.sync="Mproperty" @ok="pushProperty" @close="Mproperty = false"></property-list>

    <!-- 新建/编辑索引 -->
    <index-modal :visible.sync="Mindex" :config="indexConfig" @ok="pushIndex" @close="Mindex = false"></index-modal>
  </div>
</template>

<script>
  import propertyList from '@/components/owl/propertyList'
  import indexModal from '@/components/owl/indexModal'
  import {mapActions, mapState} from 'vuex'
  import schema from '../../util/schema'

  const columns = [
    {
      title: '中文名字',
      dataIndex: 'name',
      scopedSlots: {customRender: 'name'},
      width: 200
    }, {
      title: '类型',
      dataIndex: 'type',
      width: 200
    }, {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'},
      width: 200
    }]
  const indexColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 200
    }, {
      title: '属性',
      dataIndex: 'fields',
      width: 200
    }, {
      title: '类型',
      dataIndex: 'index_type',
      width: 200
    }, {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'},
      width: 200
    }
  ]
  export default {
    components: {propertyList, indexModal},
    data() {
      const formItemLayout = {
        labelCol: {span: 3},
        wrapperCol: {span: 20}
      }
      return {
        formItemLayout,
        columns,
        indexColumns,
        graph_key,
        current_link: {},
        searchStr: '',
        new_link: false,
        data: [],
        indexData: [],
        indexIds: [],
        property_names: [],
        Mproperty: false,
        Mindex: false,
        indexConfig: []
      }
    },
    created() {
      this.$store.dispatch('getAllEntity')
    },
    beforeCreate() {
      this.form = this.$form.createForm(this)// 创建一个表单对象
    },
    computed: {
      'all_owl': function () {
        return this.$store.state.all_node ? this.$store.state.all_node.vertexlabels : []
      },
      'links': function () {
        let links = this.$store.state.all_link ? this.$store.state.all_link.edgelabels : []
        let searchInputValue = this.searchStr
        //如果存在，根据条件过滤
        if (searchInputValue) {
          return links.filter(function (daily) {
            return String(daily.name).indexOf(searchInputValue) > -1
          })
        }
        // 如果不存在，整体返回
        return links
      }
    },
    methods: {
      ...mapActions(['gremlin', 'getAllNode', 'getAllIndex', 'getAllLink', 'getAllProperties']),
      selected(item) {
        const vm = this
        this.new_link = false
        this.old_name = item.name
        this.current_link = item
        this.data = []
        this.indexData = []
        let properties = Object.values(item.properties)
        this.$store.state.all_properties.propertykeys.forEach((v, i) => {
          if (properties.indexOf(v.name) > -1) {
            vm.data.push({
              name: v.name,
              type: v.data_type
            })
          }
        })
        vm.getIndex()
      },
      getIndex() {
        const vm = this
        vm.property_names = []
        let indexs = this.$store.state.all_index ? this.$store.state.all_index.data : []
        this.data.forEach((v) => {
          vm.property_names.indexOf(v.name) === -1 ? vm.property_names.push(v.name) : ''
        })
        vm.indexIds = []
        vm.indexData = []
        indexs.forEach((v) => {
          if (vm.property_names.indexOf(v.fields[0]) > -1 && v.base_value === vm.current_link.name) {
            vm.indexIds.push(v.id)
            vm.indexData.push(v)
          }
        })
      },
      addOwl() {
        this.form.resetFields();
        this.new_link = true
        this.data = []
        this.current_link = {}
        this.indexData = []
      },
      pushProperty(data) {
        this.data.push({
          name: data.name,
          type: data.data_type
        })

        this.getIndex()
      },
      newIndex() {
        this.Mindex = true
        this.indexConfig = this.property_names
      },
      pushIndex(item) {
        const self = this
        // 检查页面临时索引列表有没有重复的
        for (let i = 0; i < this.indexData.length; i++) {
          if (this.indexData[i].name === item.name) {
            this.$message.error('此索引名称已存在,不能添加重复索引');
            return
          }
        }
        // 检查
        // this.getAllIndex(true).then((response) => {
        //   const indexList = response.data
        //   for (var i = 0; i < indexList.length; i++) {
        //     if (indexList[i].name === item.name) { // 如果这个索引其实就是属于这个实体类型
        //       if (indexList[i].base_value !== this.current_link && this.current_link.name) {
        //         this.$message.error('此索引名称已存在,不能添加重复索引');
        //         return
        //       }
        //     }
        //   }
        const indexItem = {
          name: item.name,
          fields: [item.property],
          index_type: item.type,
          label_name: self.current_link.name,
          label_type: 'onE'
        }
        //{
        //   "id": 109,
        //   "name": "create_test3Vxx",
        //   "base_type": "VERTEX_LABEL",
        //   "base_value": "create_test3333",
        //   "index_type": "SECONDARY",
        //   "fields": ["ptype"]
        // }
        this.gremlin(schema.index.create(indexItem)).then((data) => {
          if (data.code === 500) {
            this.error(data.message)
            return
          }
          this.getAllIndex(true).then(() => {
            this.indexData.push(indexItem)
            this.success('新加成功')
            this.Mindex = false
          })
        })
        // })
      },
      /**
       * 直接删除index
       * */
      deleteIndex(index, record) {
        const self = this
        this.$confirm({
          title: '删除索引确认',
          content: `您确定要删除这个索引(${record.name}?)`,
          async onOk() {
            self.gremlin(schema.index.deleteByName(record.name)).then((data) => {
              if (data.code === 500) {
                self.error('删除失败');
                return
              }
              self.getAllIndex(true).then(() => {
                self.indexData.splice(index, 1)
                self.success('删除成功')
              })
            })
          }
        })
      },
      /**
       * 显示服务器错误
       * @param msg 附加信息
       */
      error(msg) {
        if (this.form) this.form.resetFields()
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
        if (this.form) this.form.resetFields()
        if (typeof msg === 'undefined') msg = '执行成功';
        this.$success({
          title: '成功',
          content: msg,
        });
      },
      /**
       * 删除一个本体
       */
      async deleteOwl() {
        const self = this;
        if (this.current_link && this.current_link.name) {
          this.$confirm({
            title: '删除关系类型确认',
            content: `您确定要删除这个关系类型(${this.current_link.name}?)`,
            async onOk() {
              const name = self.current_link.name;
              let str = schema.edge.getCount(name);
              let data = await self.gremlin(str);
              if (data.code !== 500) {// 不存在节点
                const gremlinList = [];
                data = await self.getAllIndex(true);
                const indexList = data.data; // 所有索引列表
                for (var i = 0; i < indexList.length; i++) {
                  if (indexList[i].base_value === self.current_link.name)
                    gremlinList.push(schema.index.deleteByName(indexList[i].name))
                }
                gremlinList.push(schema.edge.deleteByName(name));
                console.log(gremlinList.join("\n").split(';').join(';\n'));
                data = await self.gremlin(gremlinList.join(';'));

                data = await self.getAllLink(true);
                let found = false;
                if (data && data.edgelabels) {
                  for (let i = 0; i < data.edgelabels.length; i++) {
                    var item = data.edgelabels[i];
                    if (item.name === name) {
                      found = true
                    }
                  }
                }
                if (found) {
                  self.error('删除失败')
                } else {
                  self.addOwl();
                  self.success('成功删除实体:' + name)
                  self.form.resetFields();
                  return true
                }
              } else {// 存在
                if (data[0])
                  self.error(`此关系类型具有${data[0]}个实体,无法删除`)
                else
                  self.error(data.message)
              }
            },
            onCancel() {
            },
          });
        }
      },
      /**
       * 编辑或保存
       */
      ok() {
        const self = this
        self.form.validateFields(async (err, values) => {
          if (!err) {
            values.propertyList = self.data;
            let data = '';
            if (self.new_link === true) {//新建
              console.log('Received values of form: ', values);
              data = await self.gremlin(schema.edge.getByName(values.name));
              if (data.code !== 500) {
                self.error(data.message)
                return
              } else {
                var gremlin = schema.edge.create(values);
                console.log('gremlin', gremlin)
                data = await self.gremlin(gremlin);
                if (data.code === 500) {
                  self.error(data.message);
                  return
                }
              }
              // 刷新
              data = await self.getAllIndex(true);
              data = await self.getAllLink(true);
              if (data && data.edgelabels) {
                for (let j = 0; j < data.edgelabels.length; j++) {
                  if (data.edgelabels[j].name === values.name) {
                    self.selected(data.edgelabels[j]);
                    self.success('成功建立关系类型:' + values.name);
                    break
                  }
                }
              }
            } else {//编辑
              let data = await self.gremlin(schema.edge.getCount(name));
              if (data.code === 500) {//说明无实体,可以删除重建
                const old_name = self.old_name
                const name = values.name
                const gremlinRemoveList = []
                // 获得所有列表
                const allIndex = await self.getAllIndex(true);
                const indexList = allIndex.data // 所有索引列表
                // 2. 删除旧的
                if (indexList)
                  for (var i = 0; i < indexList.length; i++) {
                    if (indexList[i].base_value === self.current_link.name) {
                      gremlinRemoveList.push(schema.index.deleteByName(indexList[i].name))
                    }

                  }
                gremlinRemoveList.push(schema.edge.deleteByName(old_name));
                // 3. 建立新的
                values = getIndexList(values);
                values.propertyList = self.data;
                console.log('values', values)
                const gremlinCreateStr = schema.edge.create(values)

                function getIndexList(item) {
                  const name = item.name;
                  item.indexList = [];
                  if (indexList)
                    for (let i = 0; i < indexList.length; i++) {
                      if (indexList[i].base_value === old_name) {
                        item.indexList.push(indexList[i])
                      }
                    }
                  return item
                }

                // 4. 各种重建
                const gremlinRemoveStr = gremlinRemoveList.join(";");
                console.log(gremlinRemoveStr.split(';').join('\n')+'\n', gremlinCreateStr.split(';').join('\n'));
                //执行
                data = await self.gremlin(gremlinRemoveStr);
                data = await self.gremlin(gremlinCreateStr);
                this.form.resetFields();
                if (data.code !== 500) {
                  // 刷新
                  data = await self.getAllNode(true);
                  data = await self.getAllIndex(true);
                  data = await self.getAllProperties(true);
                  data = await self.getAllLink(true);
                  if (data && data.edgelabels) {
                    for (let j = 0; j < data.edgelabels.length; j++) {
                      if (data.edgelabels[j].name === values.name) {
                        self.selected(data.edgelabels[j]);
                        self.success('成功修改关系类型:' + values.name);
                        break
                      }
                    }
                  }
                } else {
                  self.error(data.message)
                }
              } else {
                self.error(`此关系类型具有${data[0]}个关系,无法修改`)
                return
              }
            }
            this.form.resetFields();
          }
        })
      },
    }
  }
</script>

<style>
  .ant-table-small > .ant-table-content > .ant-table-body {
    margin: 0px;
  }

  .ben-attribute-table {
    margin: 20px 0px;
  }

  .ben-attribute-center button {
    float: right;
  }

  .ben-attribute {
    background: #fff;
    border: 1px solid #ebedf0;
    border-radius: 4px;
    padding: 40px;
    margin-bottom: 20px;
    box-shadow: #e8e8e8 2px 2px 6px 0.3px;
  }

  .overf-hidden-lie {
    background: #fff;
    /*text-transform: capitalize;*/
    overflow: auto;
    overflow-x: hidden;
  }

  .overf-hidden {
    overflow: hidden;
  }
</style>
