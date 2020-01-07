<template>
  <div class="container">
    <a-layout class="a-l">
      <a-layout-header class="a-l-header">
        <a-row type="flex" justify="start">
          <a-col :span="5"><b>实体类型列表</b>
          </a-col>
          <a-col :span="5"><b>
            <template v-if="current_owl.name">{{current_owl.name}}</template>
            <template v-else>新建实体类型</template>
          </b></a-col>
        </a-row>
      </a-layout-header>
      <a-layout>
        <a-layout-sider width="250" class="overf-hidden-lie"
                        breakpoint="lg"
                        collapsedWidth="0">
          <!--这是新建按钮-->
          <!--<a-row style="padding: 20px 10%;">-->
            <!--<a-button @click="addOwl" style="width: 100%;" type="dashed"> 新建</a-button>-->
          <!--</a-row>-->
          <!--这是tab标签-->
          <a-row style="height:85%;">
            <!--从这里开始将树注释掉-->
            <!--<a-tabs defaultActiveKey="1"  style="width: 250px">-->
              <!--&lt;!&ndash;这是标签1&ndash;&gt;-->
              <!--<a-tab-pane key="1" style="width: 250px">-->
                <!--&lt;!&ndash;这是tab头名字&ndash;&gt;-->
                <!--<span slot="tab"><a-icon type="exception"/>属性列表</span>-->

                <!--从这里开始将树注释掉-->
                  <a-menu mode="inline" :style="{ height: '100%'}">
                    <!--这是查询框-->
                    <a-menu-item>
                      <a-input-search
                        placeholder="输入搜索文本"
                        style="width: 200px"
                        v-model="searchStr"
                      />
                    </a-menu-item>
                    <a-menu-item>
                      <a-button @click="addOwl" style="width: 200px" type="dashed"> 新建</a-button>
                    </a-menu-item>
                    <!--:style="{textTransform:'Lowercase'}"-->
                    <a-menu-item
                      :key="item.id" v-for="item in entities"
                      @click="selected(item)">
                      <a-badge status="success"/>
                      {{item.name}}
                    </a-menu-item>
                  </a-menu>
                <!--从这里开始将树注释掉-->
              <!--</a-tab-pane>-->
              <!--&lt;!&ndash;这是标签2&ndash;&gt;-->
              <!--<a-tab-pane key="2"  style="width: 250px;padding:0px 20px;">-->
                <!--<span slot="tab"><a-icon type="folder" />树形列表</span>-->
                <!--<a-row>-->
                  <!--<a-directory-tree-->
                    <!--:multiple="true"-->
                    <!--:defaultExpandAll="true"-->
                    <!--@select="selected"-->
                    <!--:treeData="treeData"-->
                  <!--&gt;</a-directory-tree>-->
                <!--</a-row>-->
              <!--</a-tab-pane>-->
            <!--</a-tabs>-->
                <!--从这里开始将树注释掉结束-->
          </a-row>
          <!--</a-tab-pane>-->
          <!--</a-tabs>-->
        </a-layout-sider>

        <a-layout-content>
          <!--{{entities}}-->
          <!--<br>-->
          <!--{{treeData}}-->
          <!--<br>-->
          <!--{{allLink}}-->
          <div class="pd-20" v-if="new_owl || current_owl.id">
            <!--<h2 v-if="current_owl.name">{{current_owl.name}}</h2>-->
            <!--<h2 v-else>新建实体类型</h2>-->
            <a-Divider orientation="left"><b style="color: #666">实体类型管理</b></a-Divider>
            <!--<h3>实体类型管理</h3>-->
            <a-row class="ben-attribute">
              <a-form :form="form">
                <!--<a-form-item label="Id："-->
                <!--:label-col="formItemLayout.labelCol"-->
                <!--:wrapper-col="formItemLayout.wrapperCol">-->
                <!--<a-input v-decorator="[-->
                <!--'id',-->
                <!--{-->
                <!--rules: [{ required: true, message: '请输入Id' }],-->
                <!--initialValue: current_owl.id-->
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
                            initialValue: current_owl.name
                          }
                        ]"/>
                </a-form-item>
              </a-form>
              <a-col class="ben-attribute-center"><span>属性：</span>
                <a-button @click="Mproperty = true"> + 新建属性</a-button>
              </a-col>
              <a-table class="ben-attribute-table" :columns="columns" :dataSource="data" :pagination="false"
                       size="small" bordered>
                <template v-for="col in ['name', 'type']" :slot="col" slot-scope="text, record, index">
                  <a-input
                    v-if="record.editable"
                    :value="text"
                    @change="handleChange($event.target.value, record.key, col)"
                  />
                  <template v-else>{{text}}</template>
                </template>
                <span slot="operation" slot-scope="text, record, index">
                  <span v-if="record.editable">
                    <a-button @click="save(record.key)">保存</a-button>
                    <a-popconfirm title='确定取消吗？' @confirm="cancel(record.key)">
                      <a>取消</a>
                    </a-popconfirm>
                  </span>
                  <span v-else>
                     <!--@click="edit(record.key)"-->
                    <!--<a-button>修改</a-button>-->
                    <!--<a-button @click="data.splice(index, 1);getIndex()">删除</a-button>-->
                    <a-button v-if="record.name !== graph_key" @click="data.splice(index, 1);getIndex()" type="dashed" size="small">
                      <a-Icon type="delete"></a-Icon>
                      <!--删除-->
                     </a-button>
                  </span>
                </span>
              </a-table>
            </a-row>
            <a-row>
              <a-col :span="18"></a-col>
              <a-col :span="5">
                <a-button @click="deleteOwl" v-if="!new_owl">删除</a-button>
                <a-button @click="ok" type="primary" style="float: right">保存</a-button>
              </a-col>
            </a-row>
            <template v-if="!new_owl">
              <a-Divider orientation="left"><b style="color: #666">实体类型索引管理</b></a-Divider>
              <a-row class="ben-attribute">
                <a-col class="ben-attribute-center"><span>索引：</span>
                  <a-button @click="newIndex"> + 新建索引</a-button>
                </a-col>

                <a-table class="ben-attribute-table" :columns="indexColumns"
                         :dataSource="indexData" :pagination="false"
                         size="small" bordered>
                <span slot="operation" slot-scope="text, record, index">
                  <a-button v-if="(record.fields&&record.fields[0]) !== graph_key || record.index_type !== 'SEARCH'" @click="deleteIndex(index,record)" type="dashed" size="small">
                    <a-Icon type="delete"></a-Icon>
                    <!--删除-->
                  </a-button>
                </span>
                </a-table>
              </a-row>
              <a-Divider orientation="left"><b style="color: #666">入边</b></a-Divider>
              <!--<h3>入边</h3>-->
              <a-row class="ben-attribute">
                <a-table class="ben-attribute-table" :columns="inEdgeColumns"
                         :dataSource="inEdge" :pagination="false"
                         size="small" bordered>
                </a-table>
              </a-row>

              <a-Divider orientation="left"><b style="color: #666">出边</b></a-Divider>
              <!--<h3>出边</h3>-->
              <a-row class="ben-attribute">
                <a-table class="ben-attribute-table" :columns="inEdgeColumns"
                         :dataSource="outEdge" :pagination="false"
                         size="small" bordered>
                </a-table>
              </a-row>
            </template>
            <!--{{inEdge}} <br><hr>-->
            <!--{{outEdge}}-->
          </div>
        </a-layout-content>
      </a-layout>
      <a-row style="border-top: 1px solid #ebedf0;height:30px;"><br></a-row>
    </a-layout>

    <!-- 新建属性 -->
    <property-list :visible.sync="Mproperty" @ok="pushProperty" @close="Mproperty = false"></property-list>

    <!-- 新建/编辑索引 -->
    <index-modal :visible.sync="Mindex" :config="indexConfig" @ok="pushIndex"
                 @close="Mindex = false"></index-modal>
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
      scopedSlots: {customRender: 'type'},
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
  const inEdgeColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 200
    }, {
      title: '开始节点',
      dataIndex: 'source_label',
      width: 200
    }, {
      title: '结束节点',
      dataIndex: 'target_label',
      width: 200
    },
    {
      title: '类型',
      dataIndex: 'frequency',
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
        inEdgeColumns,
        graph_key,
        current_owl: {},
        searchStr: '',
        new_owl: false,
        data: [],
        indexData: [],
        indexIds: [],
        property_names: [],
        Mproperty: false,
        Mindex: false,
        indexConfig: [],
        cacheData: null
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this)// 创建一个表单对象
    },
    computed: {
      'inEdge': function () {
        let edges = []
        if (this.$store.state.all_link)
          edges = this.$store.state.all_link.edgelabels
        if (this.current_owl && this.current_owl.name) {
          const returnData = []
          for (let i = 0; i < edges.length; i++) {
            if (edges[i].target_label === this.current_owl.name)
              returnData.push(edges[i])
          }
          return returnData
        }
      },
      'outEdge': function () {
        let edges = []
        if (this.$store.state.all_link)
          edges = this.$store.state.all_link.edgelabels
        if (this.current_owl && this.current_owl.name) {
          const returnData = []
          for (let i = 0; i < edges.length; i++) {
            if (edges[i].source_label === this.current_owl.name)
              returnData.push(edges[i])
          }
          return returnData
        }
      },
      'entities': function () {
        let entities = this.$store.state.all_node ? this.$store.state.all_node.vertexlabels : []
        let searchInputValue = this.searchStr
        //如果存在，根据条件过滤
        if (searchInputValue) {
          return entities.filter(function (daily) {
            return String(daily.name).indexOf(searchInputValue) > -1
          })
        }
        // 如果不存在，整体返回
        return entities
      },
      allLink(){
        return this.$store.state.all_link&&this.$store.state.all_link.edgelabels
      },
      /**
       * 自动计算:树形结构,用于显示继承关系
       * */
      treeData() {
        var treeData = []

        return treeData
        return [{
          title: '0-0',
          key: '0-0',
          children: [{
            title: '0-0-0',
            key: '0-0-0',
            children: [
              {title: '0-0-0-0', key: '0-0-0-0'},
              {title: '0-0-0-1', key: '0-0-0-1'},
              {title: '0-0-0-2', key: '0-0-0-2'},
            ],
          }, {
            title: '0-0-1',
            key: '0-0-1',
            children: [
              {title: '0-0-1-0', key: '0-0-1-0'},
              {title: '0-0-1-1', key: '0-0-1-1'},
              {title: '0-0-1-2', key: '0-0-1-2'},
            ],
          }, {
            title: '0-0-2',
          }],
        }, {
          title: '0-1',
          key: '0-1',
          children: [
            {title: '0-1-0-0', key: '0-1-0-0'},
            {title: '0-1-0-1', key: '0-1-0-1'},
            {title: '0-1-0-2', key: '0-1-0-2'},
          ],
        }, {
          title: '0-2',
          key: '0-2',
        }]
      }
    },
    methods: {
      ...mapActions(['gremlin', 'getAllNode', 'getAllIndex', 'getAllLink', 'getAllProperties']),
      selected(item) {
        const vm = this
        this.current_owl = item
        this.old_name = this.current_owl.name
        let properties = Object.values(item.properties)
        this.data = []
        this.indexData = []
        this.new_owl = false
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
        indexs.forEach((v) => {
          if (vm.property_names.indexOf(v.fields[0]) > -1 && v.base_value === vm.current_owl.name) {
            vm.indexIds.push(v.id)
            vm.indexData.push(v)
          }
        })
      },
      addOwl() {
        this.form.resetFields();
        this.new_owl = true
        this.data = []
        this.current_owl = {}
        this.indexData = []
      },
      pushProperty(data) {
        this.data.push({
          name: data.name,
          type: data.data_type
        });
        // this.getIndex()
      },
      handleChange(value, key, column) {
        const newData = [...this.data]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          target[column] = value
          this.data = newData
        }
      },
      edit(key) {
        const newData = [...this.data]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          target.editable = true
          this.data = newData
        }
      },
      save(key) {
        const newData = [...this.data]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          delete target.editable
          this.data = newData
          this.cacheData = newData.map(item => ({...item}))
        }
      },
      cancel(key) {
        const newData = [...this.data]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          Object.assign(target, this.cacheData.filter(item => key === item.key)[0])
          delete target.editable
          this.data = newData
        }
      },
      newIndex() {
        this.Mindex = true;
        this.indexConfig = this.property_names
      },
      /**
       * 保存index功能
       * */
      pushIndex(item) {
        // 检查页面临时索引列表有没有重复的
        for (let i = 0; i < this.indexData.length; i++) {
          if (this.indexData[i].name === item.name) {
            this.$message.error('此索引名称已存在,不能添加重复索引');
            return
          }
        }
        // 检查
        this.getAllIndex(true).then((response) => {
          const indexList = response.data
          if (indexList)
            for (var i = 0; i < indexList.length; i++) {
              if (indexList[i].name === item.name) { // 如果这个索引其实就是属于这个实体类型
                if (indexList[i].base_value !== this.current_owl && this.current_owl.name) {
                  this.$message.error('此索引名称已存在,不能添加重复索引');
                  return
                }
              }
            }
          const indexItem = {
            name: item.name,
            fields: [item.property],
            index_type: item.type,
            label_name: this.current_owl.name,
            label_type: 'onV'
          }
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
        })
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
                self.error(data.message)
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
        if (this.$form && typeof this.$form === 'function') this.$form.resetFields()
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
        if (this.$form && typeof this.$form === 'function') this.$form.resetFields()
        if (typeof msg === 'undefined') msg = '执行成功';
        this.$success({
          title: '成功',
          content: msg,
        });
      },
      /**
       * 编辑或保存
       */
      ok() {
        const self = this;
        self.form.validateFields(async (err, values) => {
          if (!err) {
            values.propertyList = self.data;
            let data = 'error';
            if (self.new_owl === true) {//新建
              console.log('Received values of form: ', values);
              const str = schema.vertex.getByName(values.name);
              data = await self.gremlin(str);
              if (data.code !== 500) {
                self.error('实体类型已经存在,不能重复建立');
                return
              } else {
                var gremlin = schema.vertex.create(values);
                console.log('gremlin', gremlin);
                data = await self.gremlin(gremlin);
                if (data.code === 500) {
                  self.error(data.message);
                  return
                }
              }
              // 刷新
              data = await self.getAllIndex(true);
              data = await self.getAllNode(true);
              if (data && data.vertexlabels) {
                for (let j = 0; j < data.vertexlabels.length; j++) {
                  if (data.vertexlabels[j].name === values.name) {
                    self.selected(data.vertexlabels[j]);
                    self.success('成功建立实体类型:' + values.name);
                    break
                  }
                }
              }
            } else {//编辑
              const old_name = self.old_name;
              var str = schema.vertex.getCount(old_name);
              let data = await self.gremlin(str);
              console.log(data);
              if (data.data && data.data.length && data.data[0] > 0) {
                self.error(`此实体类型有${data.data[0]}个实体,无法修改`);
                return
              } else {//说明无实体,可以删除重建
                const name = values.name;
                const gremlinList = [];
                const gremlinRemoveList = [];
                // 获得所有列表
                const edgeInfo = await self.getAllLink(true);
                const allIndex = await self.getAllIndex(true);
                const allProperties = await self.getAllProperties(true);
                const edgeList = edgeInfo.edgelabels; // 所有边列表
                const indexList = allIndex.data; // 所有索引列表
                const propertiesList = allProperties.propertykeys; // 所有属性列表
                const propertiesMap = {}; // 所有属性Map列表
                for (let i = 0; i < propertiesList.length; i++) {
                  propertiesMap[propertiesList[i].name] = propertiesList[i]
                }
                // 1. 暂存所有边列表
                const tempEdgeList = []
                if (edgeList)
                  for (let i = 0; i < edgeList.length; i++) {
                    const edge = edgeList[i]
                    if (edge.source_label === self.old_name || edge.target_label === self.old_name) {
                      const new_edge = getIndexAndPropertyList(edge);
                      // 删除边
                      gremlinRemoveList.push(schema.edge.deleteByName(edge.name));
                      // 更换名称
                      if (new_edge.source_label === self.old_name) new_edge.source_label = name
                      if (new_edge.target_label === self.old_name) new_edge.target_label = name
                      tempEdgeList.push(new_edge);
                    }
                  }
                // 2. 删除旧的

                if (indexList)
                  for (var i = 0; i < indexList.length; i++) {
                    if (indexList[i].base_value === self.current_owl.name)
                      gremlinRemoveList.push(schema.index.deleteByName(indexList[i].name))
                  }
                gremlinRemoveList.push(schema.vertex.deleteByName(old_name));
                // 3. 建立新的
                values = getIndexAndPropertyList(values);
                values.propertyList = self.data;

                gremlinList.push(schema.vertex.create(values));

                function getIndexAndPropertyList(item) {
                  const name = item.name;
                  item.indexList = [];
                  if (indexList)
                    for (let i = 0; i < indexList.length; i++) {
                      if (indexList[i].base_value === old_name) {
                        item.indexList.push(indexList[i])
                      }
                    }
                  item.propertyList = [];
                  if (item.properties && item.properties.length > 0)
                    for (let i = 0; i < item.properties.length; i++) {
                      const properties = propertiesMap[item.properties[i]];
                      if (properties) {
                        item.propertyList.push(properties)
                      }
                    }
                  return item
                }

                // 4. 各种重建
                // 重建边
                if (tempEdgeList.length > 0) {
                  for (let i = 0; i < tempEdgeList.length; i++) {
                    const edge = tempEdgeList[i];
                    gremlinList.push(schema.edge.create(edge))
                  }
                }
                const gremlinStr = gremlinList.join(";")
                const gremlinRemoveStr = gremlinRemoveList.join(";")
                console.log(gremlinRemoveList.join("\n").split(';').join(';\n') + '\n', gremlinList.join("\n").split(';').join(';\n'));
                //执行
                data = await self.gremlin(gremlinRemoveStr);
                data = await self.gremlin(gremlinStr);
                if (data.code !== 500) {
                  // 刷新
                  data = await self.getAllLink(true);
                  data = await self.getAllIndex(true);
                  data = await self.getAllProperties(true);
                  data = await self.getAllNode(true);
                  if (data && data.vertexlabels) {
                    for (let j = 0; j < data.vertexlabels.length; j++) {
                      if (data.vertexlabels[j].name === values.name) {
                        self.selected(data.vertexlabels[j]);
                        self.success('成功修改实体类型:' + values.name);
                        break
                      }
                    }
                  } else {
                    self.error(`此关系类型具有${data[0]}个关系,无法修改`)
                    return
                  }
                }
              }
            }
            this.form.resetFields();
          }
        })
      },
      /**
       * 删除一个实体类型
       */
      deleteOwl() {
        const self = this
        if (this.current_owl && this.current_owl.name) {
          this.$confirm({
            title: '删除实体类型确认',
            content: `您确定要删除这个实体类型(${this.current_owl.name}?)`,
            async onOk() {
              const name = self.current_owl.name;
              let data = await self.gremlin(schema.vertex.getCount(name));
              if (data.code !== 500) {// 不存在节点
                const gremlinList = [];
                data = await self.getAllIndex(true)
                const indexList = data.data; // 所有索引列表

                if (indexList)
                  for (var i = 0; i < indexList.length; i++) {
                    if (indexList[i].base_value === self.current_owl.name)
                      gremlinList.push(schema.index.deleteByName(indexList[i].name))
                  }
                gremlinList.push(schema.vertex.deleteByName(name))
                data = await self.gremlin(gremlinList.join(';'));
                console.log(gremlinList.join("\n").split(';').join(';\n'));

                let links = await self.getAllLink(true);
                links = links.edgelabels;
                const linksList = [];
                for (var i = 0; i < links.length; i++) {
                  let link = links[i];
                  if (link.source_label === name || links.target_label === name) {
                    linksList.push(link);
                  }
                }
                if (linksList.length > 0) {
                  self.error(`因为有${linksList.length}个边关联,无法删除实体类型,请先删除边`);
                  return
                }
                data = await self.getAllNode(true);
                let found = false;
                if (data && data.data) {
                  for (let i = 0; i < data.data.length; i++) {
                    var item = data.data[i];
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
                  self.error(`此实体类型具有${data[0]}个实体,无法删除`)
                else
                  self.error(data.message)
              }
            }
          });

        }
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
