<template>
  <div style="overflow-x: hidden">
    <!--联合搜索-->
    <a-row>
      <!--source本体类型-->
      <a-col
        :span="6" style="padding: 35px;">
        <a-row :style="{ paddingLeft: '5px',paddingBottom:'10px'}">出实体类型</a-row>
        <a-select
                  :style="{ width: '100%',paddingBottom:'6px'}"
                  @change="handleSourceChange"
                  v-model="sourceName">
          <a-select-option :value="item.name" v-for="item in all_node.vertexlabels" :key="item.name">{{item.name}}</a-select-option>
        </a-select>
        <a-form
          v-if="source"
          :form="sourceForm"
          @submit="handleSubmit"
        >
          <a-form-item
            v-for="property in source.properties"
            :key="property"
            :label="property"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 24}"
          >
            <a-input
              v-decorator="[
                `${property}`,
                {rules: [{ required: false, message: 'Please input your note!' }]}
              ]"
            />
          </a-form-item>
        </a-form>
      </a-col>
      <!--关系类型-->
      <a-col
        :span="6"
        class="abc" style="padding: 35px;">
        <a-row :style="{ paddingLeft: '5px',paddingBottom:'10px'}">关系类型</a-row>
        <a-select class=""
                  :style="{ width: '100%',paddingBottom:'6px'}"
                  placeholder="请完成 前两项~"
                  v-model="relationId" @change="handleRelationChange()">
          <a-select-option :value="item.id" v-for="item in relationList" :key="item.id">{{item.name}}</a-select-option>
        </a-select>
        <a-form
          v-if="relation"
          :form="relationForm"
          @submit="handleSubmit"
        >
          <a-form-item
            v-for="property in relation.properties"
            :key="property"
            :label="property"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 24 }"
          >
            <a-input
              v-decorator="[
                `${property}`,
                {rules: [{ required: false, message: 'Please input your note!' }]}
              ]"
            />
          </a-form-item>
        </a-form>
      </a-col>
      <!--target本体类型-->
      <a-col :span="6"
             class="abc" style="padding: 35px;">
        <a-row :style="{ paddingLeft: '5px',paddingBottom:'10px'}">入实体类型</a-row>
        <a-input class=""
                 :style="{ width: '100%',paddingBottom:'6px'}"
                 placeholder="请完成 前两项~" v-model="targetName" />
        <a-form
          v-if="target"
          :form="targetForm"
          @submit="handleSubmit"
        >
          <a-form-item
            v-for="property in target.properties"
            :key="property"
            :label="property"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 24 }"
          >
            <a-input
              v-decorator="[
                `${property}`,
                {rules: [{ required: false, message: 'Please input your note!' }]}
              ]"
            />
          </a-form-item>
        </a-form>
      </a-col>
      <a-col style="padding: 35px" :span="6" v-if="target">
        <a-row :style="{ paddingLeft: '5px',paddingBottom:'10px'}">&nbsp;</a-row>
        <a-button type="primary" @click="handleSubmit">查询</a-button>
      </a-col>
    </a-row>
    <!--<a-row :gutter="24">-->
      <!--<a-col :span="24"></a-col>-->
      <!--<a-col :span="5" v-if="target">-->
        <!--<a-button type="primary" @click="handleSubmit">查询</a-button>-->
      <!--</a-col>-->
    <!--</a-row>-->
    <search-result v-if="isShowSearchResult" :searchType="'union'" :resultNum="resultNum"></search-result>
  </div>
</template>

<script>
  import {graph} from '@/util/index' // graph数据处理工具类
  import searchResult from '@/components/search/searchResult'

  export default {
    components: { graph, searchResult },
    data() {
      return {
        sourceName: '',
        source: null,  // 选中的起点的完整实体类型
        relationId: '', //选中的关系ID
        relation: null, // 选中的完整关系类型
        targetName: '', //选中的目标名称
        target: null,  // 选中的终点的完整实体类型
        relationList: [], // 关系下拉列表
        sourceForm: this.$form.createForm(this),
        relationForm: this.$form.createForm(this),
        targetForm: this.$form.createForm(this),
        resultNum: 0
      }
    },
    computed: {
      all_node: function () {
        return this.$store.state.all_node
      },
      all_link: function () {
        return this.$store.state.all_link
      },
      isShowSearchResult: function () {
        return this.$store.state.isShowSearchResult
      }
    },
    methods: {
      /**
       * 选中起点的处理，获得可选的关系列表
       */
      handleSourceChange(){
        this.relationId = ''
        this.relation = null
        this.relationList = []
        this.target = null
        this.targetName = ''
        // 获得此起点下可选关系
        let links = this.all_link.edgelabels
        for(let i = 0; i < links.length; i++) {
          if(links[i].source_label === this.sourceName) {
            this.relationList.push(links[i])
          }
        }
        this.source = getVertex(this.sourceName, this.all_node.vertexlabels)
      },
      /**
       * 选中关系，获得终点
       * @param relation
       */
      handleRelationChange(relation){
        // 设置选中的关系名，目标实体类型
        let links = this.all_link.edgelabels
        for(let i = 0; i < links.length; i++) {
          if(this.relationId === links[i].id) {
            this.targetName = links[i].target_label
            this.relation = links[i]
          }
        }
        this.target = getVertex(this.targetName, this.all_node.vertexlabels)
      },
      handleSubmit() {
        const vm = this
        let sourceNum = 0
        let relationNum = 0
        let targetNum = 0
        let searchStr = "g.V().match(__.as('x').hasLabel('" + this.sourceName + "').as('y')).select('y')"
        this.sourceForm.validateFields((err, values) => {
          if (!err) {
            let sourecObj = this.getObjHasValue(values)
            let str = ""
            let flagNum = 0   // 为下面字符串做标记
            for(let i in sourecObj) {
              let asName = "b" + sourceNum
              if(flagNum === 0) {
                str += ".has('" + i + "'," + sourecObj[i] + ").as('" + asName + "').select('" + asName + "').match(__.as('" + asName + "')"
              } else {
                str += ".has('" + i + "'," + sourecObj[i] + ").as('" + asName + "')).select('" + asName + "').match(__.as('" + asName + "')"
              }
              sourceNum++
              flagNum++
            }
            searchStr += str
          }
        });
        this.relationForm.validateFields((err, values) => {
          if (!err) {
            let relationObj = this.getObjHasValue(values)
            let str = ''
            if((searchStr.split('match').length-1) === 1) {
              str = ".outE('" + this.relation.name + "').as('c').select('c').match(__.as('c')"
            } else {
              str = ".outE('" + this.relation.name + "').as('c')).select('c').match(__.as('c')"
            }
            for(let i in relationObj) {
              let asName = "c" + relationNum
              str += ".has('" + i + "'," + relationObj[i] + ").as('" + asName + "')).select('" + asName + "').match(__.as('" + asName + "')"
              relationNum++
            }
            searchStr += str
            searchStr += ".otherV().as('g')).select('g').match(__.as('g')"
          }
        });
        var asName = ""
        this.targetForm.validateFields((err, values) => {
          if (!err) {
            var targetObj = this.getObjHasValue(values)
            var str = ".hasLabel('" + this.targetName + "').as('d')).select('d').match(__.as('d')"
            asName = "d"
            for(var i in targetObj) {
              asName += targetNum
              str += ".has('" + i + "'," + targetObj[i] + ").as('" + asName + "')).select('" + asName + "').match(__.as('" + asName + "')"
              targetNum++
            }
            searchStr += str
          }
        });
        let tmpStr = searchStr.split(".match")
        tmpStr.splice(tmpStr.length-1,1);
        searchStr = tmpStr.join(".match")
        var cNum = null
        if(relationNum === 0) {
          cNum = ''
        } else {
          cNum = relationNum - 1
        }
        searchStr = searchStr.substring(0, searchStr.length - (asName.length+3))
        searchStr += "'c" + cNum + "')"
        var currentGraph=''
        if(computed_str)
          currentGraph=computed_str+';g=sub.traversal();'
        searchStr=currentGraph+searchStr
        this.$store.dispatch('getAllGraphNum', searchStr + '.count()').then((result) => {
          vm.resultNum = result.data.data ? result.data.data[0] : 0
        })
        this.$store.dispatch('getAllGraph', searchStr + '.limit(' + search_limit + ')')
          .then(function (data) {
            vm.$store.dispatch('setSearchFlag', true)
          }).catch(function (err) {
          if(err) {
            vm.$message.error('请求错误:' + err)
          }
        })
      },
      // 取得有值的对象
      getObjHasValue(obj) {
        let propertykeys = this.$store.state.all_properties.propertykeys
        let propertiesSetting = this.$store.state.propertiesSetting
        let rObj = {}
        for(let i in obj) {
          if(obj[i]) {
            let dType = ''
            for(let j = 0; j< propertykeys.length; j++) {
              if(propertykeys[j].name === i) {
                dType = 'e_' + propertykeys[j].data_type
              }
            }
            rObj[i] = dType ? propertiesSetting[dType](obj[i]) : obj[i]
          }
        }
        return rObj
      }
    },
    created() {
    }
  }
  // 根据名称获得实体类型详细数据
  function getVertex(name, vertexList) {
    for(let i = 0; i < vertexList.length; i++) {
      if(name === vertexList[i].name){
        return vertexList[i]
      }
    }
  }
</script>

<style>
</style>
