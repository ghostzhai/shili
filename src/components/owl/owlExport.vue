<template>
    <div class="container">
      <a-layout class="pd-ben">
        <a-row class="pd-ben-box">
          <a-row type="flex" justify="center" style="display:none">
            <a-col :span="24" style="padding-bottom: 60px">
              <a-row>
                <a-col :span="8"><span>本体(个)</span> <h1>{{ expData}}</h1></a-col>
                <a-col :span="8"><span>属性(个)</span> <h1>{{ expData &&  Object.keys(expData.properties).length}}</h1></a-col>
                <a-col :span="8"><span>关系(个)</span> <h1>{{ expData && expData.relationships.length}}</h1></a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" >
            <a-col :span="24"><a-button type="default" style="width:100%;"  @click="exportOWL">导出文件<a-icon type="download" /></a-button> </a-col>
          </a-row>
        </a-row>
      </a-layout>
    </div>
</template>

<script>
    export default {
      name: "owl-export",
      data () {
        return {

        }
      },
      computed: {
        expData: function () {
          return this.$store.state.exportData
        }
      },
      methods: {
        exportOWL(){
          // this.$store.dispatch('exportOwl')
          // window.location.href = graph_zjy + '/ontology/exportOwl';
          let url =  graph_zjy + '/ontology/exportOwl'
          window.open(url)
        }
      }
    }
</script>

<style scoped>
  .pd-ben{
    text-align: center;
  }
  .pd-ben-box{
    background: #ffff;
    padding: 60px 60px;
  }
  .pd-ben-box h1{
    color: #1890ff;
  }
</style>

