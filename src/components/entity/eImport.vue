<template>
  <div class="container">
    <a-spin :spinning="spinning">
      <second-layout :title="title" :image="image" :breadcrumb="breadcrumb">
      <a-layout slot="tabs" class="ant-tabs pd-t-20">
          <div class="result-card pd-20">
            <a-steps :current="current">
              <a-step v-for="item in steps" :key="item.title" :title="item.content" />
            </a-steps>
          </div>
        <a-layout class="pd-21" style="overflow: auto;border: 1px solid #e9e9e9;" >
          <a-layout-content>
            <!--{{databaseInfo}}-->
            <database v-if="current == 0"></database>
            <entity-import v-if="current == 1"></entity-import>
            <!--<edge-import v-if="current == 2"></edge-import>-->
            <!--第四部成功-->
            <div class="container" v-if="current == 2" style="background-color: white">
              <a-row type="flex" justify="center" class="pd-20"><h2><a-icon type="check-circle" style="color:green;font-size: 36px;"/></h2> </a-row>
              <a-row type="flex" justify="center" ><h2>导入成功</h2> </a-row>
              <a-row type="flex" justify="center" class=" pd-20" v-if="resultInfo.data"><h2 style="background-color: #fbfbfb;padding:20px 80px;">导入成功: <b>{{resultInfo.data.insertSuccess}}</b>(个)</h2></a-row>
            </div>
          </a-layout-content>
        </a-layout>
        <a-layout-footer class="ft-r next-foot">
          <a-button type="primary" class="ft-r" v-if="current !== 3"
                    @click="next"
                    :disabled="(!databaseInfo.status)"
                    >下一步</a-button>
          <a-button type="primary" class="ft-r" v-if="current !== 0 || current !== 2"
                    @click="prev"
                    :disabled="(!databaseInfo.status)">上一步</a-button>
          <a-row type="flex" justify="center">
            <a-button type="primary" class="ft-r" v-if="current == 3">关闭</a-button>
            <a-button type="default" class="ft-r" v-if="current == 3">返回</a-button>
          </a-row>
        </a-layout-footer>
      </a-layout>
    </second-layout>
    </a-spin>
  </div>
</template>

<script>
  import database from '@/components/import/database'
  import entityImport from '@/components/import/entityImport'
  import edgeImport from '@/components/import/edgeImport'
  import secondLayout from '@/components/common/secondLayout'
  import image from '@/assets/image/peitu-03.svg'
  export default {
    components: {secondLayout, database, entityImport, edgeImport },
    data() {
      return {
        image,
        title: '实体浏览',
        activeKey: 'entity',
        breadcrumb: [
          {
            path: 'visualization',
            breadcrumbName: '实体',
            url: 'entity_visualization'
          }, {
            path: 'entity',
            breadcrumbName: '实体浏览'
          }],
        current: 0, //当前所在的步数
        steps: [
        {
          title: '第一步',
          content: '连接数据库',
        }, {
          title: '第二步',
          content: '实体导入策略',
        }, {
          title: '第三步',
          content: '结果',
        }],
        spinning: false,
      }
    },
    computed: {
      databaseInfo: function () {
        return this.$store.state.import_database.database_page
      },
      AllData: function () {
        return this.$store.state.import_database
      },
      resultInfo: function () {
        return this.$store.state.import_database.result
      }
    },
    created() {
    },
    methods: {
      next() {
        // 提交最后结果
        if(this.current === 1) {
          this.spinning = true
          this.submit().then((result)=>{
            if(result.data.code === 200) {
              this.resultInfo.data = result.data.data
              this.current++
            } else {
              this.$message.error(result.data.msg);
            }
            this.spinning = false
            return
          })
        }
        if(this.current < 1) {
          this.current++
        }
      },
      prev() {
        this.current--
      },
      submit() {
        var dbconfig = this.AllData.database_page.data
        var fields = []   // 表
        var fieldData = this.AllData.table_page.data
        for(var i = 0; i < fieldData.length; i++) {
          var field = fieldData[i]
          var fieldObj = {
            table: field.tableName,
            name: field.InfoName,
            code: field.InfoCode,
            ontology: field.vertexName,
            match: []
          }
          for(var j = 0; j < field.vertex.length; j++) {
            if(!field.vertex[j].col) {
              continue
            }
            var obj = {
              rdbCol: field.vertex[j].col,
              graphCol: field.vertex[j].name,
              tbl: field.tableName
            }
            fieldObj.match.push(obj)
          }
          fields.push(fieldObj)
        }
        var relationships = []  // 关系
        var relationData = this.AllData.relation_page.data
        for(var i = 0; i < relationData.length; i++) {
          var rData = relationData[i]
          var relationObj = {
            sourceTbl: rData.source.tableName,
            sourceCol: rData.source.colName,
            targetTbl: rData.target.tableName,
            targetCol: rData.target.colName,
            relType: rData.edge.select,
            sourceOntology: rData.source.vertexName,
            targetOntology: rData.target.vertexName,
            name:  rData.InfoName,
            code: rData.codeName,
            match: []
          }
          for(var j = 0; j < rData.edge.match.length; j++) {
            var matchObj = rData.edge.match[j]
            var obj = {
              tbl: matchObj.value[0],
              rdbCol: matchObj.value[0] + '.' + matchObj.value[1],
              graphCol: matchObj.graphCol
            }
            relationObj.match.push(obj)
          }
          relationships.push(relationObj)
        }
        var jsonData = {
          dbconfig: dbconfig,
          fields: fields,
          relationships: relationships
        }
        console.log('最终数据：', jsonData)
        return this.$store.dispatch('postImportData', {json: JSON.stringify(jsonData)})
      }
    }
  }
</script>

<style scoped>
  .ft-r button{
    margin-left: 10px;
  }
  .pd-t-20{
    margin-bottom: 0px;
  }
  .pd-20{
    padding: 40px;
  }
  .pd-21{
    background: #F9FAFB;
    padding: 20px;
  }
  .result-card{
    margin-bottom: 0px;
  }
  .next-foot{
    /*border-top:1px solid #e8e8e8;*/
    background: white;
    margin-top:0;
    padding:10px 20px !important;
  }
</style>
