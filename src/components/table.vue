<template>
  <div style="width: 100%" class="result-card">
    <a-table :columns="columns" :dataSource="data" size="middle" />
  </div>
</template>

<script>
  import {graph} from '@/util/index' // graph数据处理工具类
  import {kg} from '@/api/index'

  const columns = [{
    title: '路径',
    dataIndex: 'path',
  }];

  export default {
    props: ['tableData'],
    data() {
      return {
        columns,  // 表格头配置
        data: []  // 表格内容
      }
    },
    watch: {
      tableData: function () {
        this.init(this.tableData)
      }
    },
    methods: {
      /**
       * 处理传进来的表格数据
       * @param orgData
       */
      init(orgData) {
        const vm = this
        vm.data = []
        if(orgData && orgData.path) { // 最短路径
          var path = orgData.path
          var obj = {
            path: '',
            key: '0'
          }
          //拼查询字符串
          var searchStr = getSearchStr_All(path)
          // 查询id对应名称，存在map
          kg.g_board({
            data: {
              'id': 'card_1',
              'code': searchStr
            }
          }).then((result) => {
            if(result.status === 200) {
              var nameArr = result.data.data
              // id: name
              var idMap = {}
              for(var i in path) {
                idMap[path[i]] = nameArr[i]
              }
              for(var i = 0; i < path.length; i++) {
                obj.path += idMap[path[i]]
                if(i !== path.length - 1) {
                  obj.path += ' --> '
                }
              }
              vm.data.push(obj)
            }
          })
        } else if (orgData && orgData.paths) { // 全路径
          var paths = orgData.paths
          var idArr = toArr(paths)
          var searchStr = getSearchStr_All(idArr)
          var idMap = {}
          kg.g_board({
            data: {
              'id': 'card_1',
              'code': searchStr
            }
          }).then((result) => {
            if(result.status === 200) {
              var nameArr = result.data.data
              for(var i in idArr) {
                idMap[idArr[i]] = nameArr[i]
              }
              for(var i = 0; i < paths.length; i++) {
                var objects = paths[i].objects
                var onePath = {
                  path: '',
                  key: i
                }
                for(var j = 0; j < objects.length; j++) {
                  onePath.path += idMap[objects[j]]
                  if(j !== objects.length - 1) {
                    onePath.path += ' --> '
                  }
                }
                vm.data.push(onePath)
              }
            }
          })

        } else {}
      }
    },
    created() {
      this.init(this.tableData)
    }
  }
  function findNode(id) {

  }
  function toArr(paths) {
    // id的map
    var idObj = {}
    for(var i = 0; i < paths.length; i++) {
      var objects = paths[i].objects
      for(var j = 0; j < objects.length; j++) {
        idObj[objects[j]] = ''
      }
    }
    // 转数组
    var idArr = []
    for(var i in idObj) {
      idArr.push(i)
    }
    return idArr
  }
  // 拼根据id查名字的字符串
  function getSearchStr_All(idArr) {
    // 拼接
    var searchStr = "g.V("
    for(var i = 0; i < idArr.length; i++) {
      searchStr += "'" + idArr[i] + "',"
    }
    searchStr += ").as('a').select('a').by('名称')"
    return searchStr
  }
</script>

<style>
</style>
