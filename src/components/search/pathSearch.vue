<template>
  <div>
    <a-form
      class="abc"
      :form="form"
      @submit="handleSearch"
    >
      <!--查询模式-->
      <a-row :gutter="24" class="bottom-line">
        <!--<a-col :span="10" :xs="{ span: 17 }">-->
          <!--<a-form-item :label="`单选`">-->
            <!--<a-radio-group-->
              <!--v-decorator="['查询模式',{-->
                <!--rules: [{-->
                  <!--required: false,-->
                  <!--message: '请选择!',-->
                <!--}],-->
              <!--}]">-->
              <!--<a-radio value="1">-->
                <!--起点/终点-->
              <!--</a-radio>-->
              <!--<a-radio value="2">-->
                <!--探索模式（多节点）-->
              <!--</a-radio>-->
            <!--</a-radio-group>-->
          <!--</a-form-item>-->
        <!--</a-col>-->
      </a-row>
      <!--起点终点查询-->
      <a-row :gutter="24" class="bottom-line">
        <a-col :span="5">
          <a-form-item :label="`起点`">
            <a-select
              v-decorator="[
            `起点`,
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
        <a-col :span="5">
          <a-form-item :label="`终点`">
            <a-select
              v-decorator="[
            `终点`,
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
      <!--度数-->
      <a-row :gutter="24" class="bottom-line">
        <a-col :span="5">
          <a-form-item :label="`度数`">
            <a-input
              v-decorator="[
                `度数`,
                {
                  rules: [{
                    required: true,
                    message: '请输入!',
                  }],
                }
              ]"
              placeholder="请输入"
            />
          </a-form-item>
        </a-col>
      </a-row>
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
        <!--<a-col :xs="{ span: 17, offset: 1 }" :lg="{ span: 10 }">-->
        <a-col :xs="{ span: 17}" :lg="{ span: 10 }">
          <a-form-item :label="`单选`">
            <a-radio-group
              v-decorator="['边过滤条件',{
                rules: [{
                  required: true,
                  message: '请选择!',
                }],
              }]">
              <a-radio value="1">
                全路径
              </a-radio>
              <a-radio value="2">
                最短路径
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <!--其他-->
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
    <search-result v-if="isShowSearchResult" :searchType="'path'"></search-result>
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
        searchKinds: [
          {
            label: '精确查询',
            value: '1'
          },{
            label: '范围查询',
            value: '2'
          },{
            label: '模糊查询',
            value: '3'
          }],  //查询方式
        accurateKinds: [     // 精确条件下的过滤条件
          {
            label: '等于',
            value: 'eq'
          },{
            label: '不等于',
            value: 'neq'
          }
        ],
        rangeKinds: [       // 范围条件下的过滤条件
          {
            label: '小于',
            value: 'lt'
          },{
            label: '大于',
            value: 'gt'
          },{
            label: '小于等于',
            value: 'lte'
          },{
            label: '大于等于',
            value: 'gte'
          },
        ],
        vagueKinds: [      // 模糊条件下的过滤条件
          {
            label: '包含',
            value: 'inside'
          },
          {
            label: '不包含',
            value: 'outside'
          },
          // {
          //   label: '以...开头',
          //   value: 'gte'
          // },
        ],
        selectLXKinds: '0',         // 类型查询，选择类型后决定过滤条件， 默认0，没有可选项
        selectSXKinds: '0',         // 属性查询，选择类型后决定过滤条件， 默认0，没有可选项
        fetching: false,
      }
    },
    computed: {
      searchResult: function () {
        return graph.getNode(this.$store.state.graph)
      },
      all_link: function () {
        return this.$store.state.all_link
      },
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
            var searchObj = getPathSearchObj(values)
            this.$store.dispatch('getPath', searchObj)
              .then(function () {
                vm.$store.dispatch('setSearchFlag', true)
              }).catch(function (err) {
                if(err) {
                  vm.$message.error('请求错误:', err)
                }
              })
          }
        });
      },
      handleLXSelectChange (value) {
        this.selectLXKinds = value
      },
      handleSXSelectChange (value) {
        this.selectSXKinds = value
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
   * 获得请求的参数对象
   * @param data
   * @returns {{source: string, target: string, max_depth: number, direction: string}}
   */
  function getPathSearchObj(data) {
    console.log('填写的过滤条件', data)
    var obj = {
      source: "4a5d15d542a843c89e56663d8f547c01",
      target: "4a5d15d542a843c89e56663d8f547c06",
      max_depth: 5,
      direction: 'OUT'
    }
    switch (data['查询模式']){
      case '1':
        //  起点终点
        obj.type = 'qz'
        break
      case '2':
        // 探索
        obj.type = 'ts'
        break
      default:
        break
    }
    obj.source = data['起点']
    obj.target = data['终点']
    obj.condition = data['边过滤条件']
    obj.max_depth = data['度数']
    obj.side_type = data['边类型']
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
