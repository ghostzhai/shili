<template>
  <div>
    <a-form
      class="abc"
      :form="form"
      @submit="handleSearch"
    >
      <!--类型查询-->
      <a-row :gutter="24">
        <a-col :span="5">
          <a-form-item :label="`实体`">
            <a-select
              v-decorator="[
            `实体`,
            {
            rules: [{
            required: true,
            message: '请输入!',
            }],
            }
            ]"
              showSearch
              placeholder="请输入"
              :defaultActiveFirstOption="false"
              :showArrow="false"
              :filterOption="false"
              @search="handleLXSearch"
              @change="handleChange"
              :notFoundContent="fetching ? undefined : null">
              <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
              <a-select-option v-for="(d, $index) in searchResult" :key="d.id">{{d.name}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <!--度数查询-->
      <a-row :gutter="24">
        <a-col :span="5">
          <a-form-item :label="`度数`">
            <a-input
              v-decorator="[
                '度数',
                {
                  rules: [{
                    required: true,
                    message: '请选择!',
                  }],
                }
              ]"
              placeholder="不限"
            />
          </a-form-item>
        </a-col>
        <a-col :xs="{ span: 17 }" :lg="{ span: 10 }">
          <a-form-item>
            <a-checkbox
              v-show="false"
              v-decorator="[
              '度数过滤条件',
                {
                  required: true,
                  initialValue: '1',
                }
              ]"
            >
            </a-checkbox>
          </a-form-item>
        </a-col>
      </a-row>
      <!--邻接边-->
      <a-row :gutter="24">
        <a-col :span="24">
          <a-Divider orientation="left">其它选项</a-Divider>
        </a-col>
        <a-col :span="5">
          <a-form-item :label="`边类型`">
            <a-select v-decorator="[
                '边类型',
                {rules: [{ required: false, message: 'Please select your gender!' }]}
              ]">
              <a-select-option :value="item.name" v-for="item in all_link.edgelabels" :key="item.id">{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col
          :span="24"
          :style="{ textAlign: 'right' }"
        >
          <a-button
            :style="{ marginLeft: '8px' }"
            @click="handleReset"
          >
            清除
          </a-button>
          <a-button
            type="primary"
            html-type="submit"
          >
            查询
          </a-button>
        </a-col>
      </a-row>
    </a-form>
    <search-result v-if="isShowSearchResult" :searchType="'correlation'" :resultNum="resultNum"></search-result>
  </div>
</template>

<script>
  import {graph} from '@/util/index' // graph数据处理工具类
  import searchResult from '@/components/search/searchResult'

  let timeout

  export default {
    components: { graph, searchResult },
    data() {
      return {
        expand: false,
        form: this.$form.createForm(this),
        fetching: false,
        resultNum: 0   // 查询结果的数量
      }
    },
    computed: {
      // 查询的结果数据
      searchResult: function () {
        return graph.getNode(this.$store.state.graph)
      },
      all_node: function () {
        return this.$store.state.all_node
      },
      all_link: function () {
        return this.$store.state.all_link
      },
      // 是否显示结果
      isShowSearchResult: function () {
        return this.$store.state.isShowSearchResult
      }
    },
    methods: {
      handleSearch  (e) {
        const vm = this
        e.preventDefault();
        this.form.validateFields((error, values) => {
          console.log('error', error);
          if (!error) {
            var searchObj = getCorrelationSearchStr(values)
            console.log('查询语句：', searchObj.searchStr)
            this.$store.dispatch('getAllGraphNum', searchObj.searchNumStr).then((result) => {
              vm.resultNum = result.data.data ? result.data.data[0] : 0
            })
            this.$store.dispatch('getAllGraph', searchObj.searchStr)
              .then(function () {
                vm.$store.dispatch('setSearchFlag', true)
              }).catch(function (err) {
                if(err) {
                  vm.$message.error('请求错误:'+ err)
                }
              })
          }
        });
      },
      handleReset () {
        this.form.resetFields();
      },
      handleLXSearch(value) {
        const vm = this
        vm.fetching = true
        if (timeout) {
          clearTimeout(timeout)
          timeout = null
        }

        function getResult() {
          vm.$store.dispatch('getGraph', value).then(function () {
            vm.fetching = false
          })
        }

        timeout = setTimeout(getResult, 300)// 延迟搜索
      },
      handleChange(value) {
        let tar
        this.searchResult.forEach((v, i) => {
          v.id === value ? tar = v : tar
        })
        this.value = value
        this.$store.dispatch('setRoot', tar)
      }
    }
  }

  /**
   * 拼查询的字符串
   * @param data 表单的内容
   * @returns {{searchStr: string, searchNumStr: string}}
   */
  function getCorrelationSearchStr(data) {
    console.log('填写的过滤条件', data)
    var str = ''
    var numStr = ''
    var currentGraph=''
    if(computed_str)
      currentGraph=computed_str+';g=sub.traversal();'
    // 关联查询
    // 此处拼接查询语句
    var op='is('+data['度数']+')'
    var edge='bothE()'
    if(2==data['度数过滤条件'])
      op='is(lte('+data['度数']+'))'
    if(undefined!=data['边类型'])
      edge='bothE("'+data['边类型']+'")'
    str='g.V("'+data['实体']+'").repeat('+edge+ '.sideEffect(otherV().store("a"))' +'.otherV().simplePath()).until(loops().'+op+'.or().cap("a").unfold().dedup().count().is(gt(' + search_limit + ')))' + '.path()'
    numStr = 'g.V("'+data['实体']+'").repeat('+edge+ '.sideEffect(otherV().store("a"))' +'.otherV().simplePath()).until(loops().'+op+').path()' + '.select("a").unfold().dedup().count()'
    var obj = {
      searchStr: currentGraph+str,
      searchNumStr: currentGraph+numStr
    }
    return obj
  }
</script>

<style scoped>
  .abc{
    padding: 35px;
  }
  /*.ant-advanced-search-form {*/
    /*padding: 24px;*/
    /*background: white;*/
    /*border: 1px solid #d9d9d9;*/
    /*border-radius: 6px;*/
  /*}*/

  /*.ant-advanced-search-form .ant-form-item {*/
    /*display: flex;*/
  /*}*/

  /*.ant-advanced-search-form .ant-form-item-control-wrapper {*/
    /*flex: 1;*/
  /*}*/

  /*#components-form-demo-advanced-search .ant-form {*/
    /*max-width: none;*/
  /*}*/
  /*#components-form-demo-advanced-search .search-result-list {*/
    /*margin-top: 16px;*/
    /*border: 1px dashed #e9e9e9;*/
    /*border-radius: 6px;*/
    /*background-color: #fafafa;*/
    /*min-height: 200px;*/
    /*text-align: center;*/
    /*padding-top: 80px;*/
  /*}*/
</style>
