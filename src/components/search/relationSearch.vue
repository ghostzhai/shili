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
          <a-form-item :label="`类型`">
            <a-input
              value="名称"
              placeholder="不限"
              disabled
            />
            <!--<a-select-->
              <!--v-decorator="[-->
                <!--`类型`,-->
                <!--{-->
                  <!--rules: [{-->
                    <!--required: false,-->
                    <!--message: '请输入!',-->
                  <!--}],-->
                <!--}-->
              <!--]"-->
              <!--showSearch-->
              <!--placeholder="请输入"-->
              <!--:defaultActiveFirstOption="false"-->
              <!--:showArrow="false"-->
              <!--:filterOption="false"-->
              <!--@search="handleLXSearch"-->
              <!--@change="handleChange"-->
              <!--:notFoundContent="fetching ? undefined : null">-->
              <!--<a-spin v-if="fetching" slot="notFoundContent" size="small"/>-->
              <!--<a-select-option v-for="(d, $index) in searchResult" :key="d.id">{{d.id}}</a-select-option>-->
            <!--</a-select>-->
          </a-form-item>
        </a-col>
        <a-col :span="5">
          <a-form-item :label="`查询方式`" has-feedback>
            <a-select
              @change="handleLXSelectChange"
              v-decorator="[
                '类型查询方式',
                {rules: [{ required: false, message: '请选择!' }]}
              ]"
              placeholder="请选择"
            >
              <a-select-option v-for="item in searchKinds" :value="item.value" :key="item.label">
                {{item.label}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="5">
          <a-form-item :label="`过滤条件`" has-feedback>
            <a-select
              v-decorator="[
                '类型过滤条件',
                {rules: [{ required: false, message: '请选择!' }]}
              ]"
              placeholder="请选择"
            >
              <a-select-option v-if="selectLXKinds == '1'" v-for="item in accurateKinds" :value="item.value" :key="item.label">
                {{item.label}}
              </a-select-option>
              <a-select-option v-if="selectLXKinds == '2'" v-for="item in rangeLXKinds" :value="item.value" :key="item.label">
                {{item.label}}
              </a-select-option>
              <a-select-option v-if="selectLXKinds == '3'" v-for="item in vagueLXKinds" :value="item.value" :key="item.label">
                {{item.label}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="5" :xs="{ span: 9 }" :sm="{span:9}" :md="{span:9}" :lg="{span:9}" :xl="{span:9}">
          <a-form-item  :label="`查询（不限制）`" has-feedback>
            <a-input
              v-decorator="[
                '类型值',
                {
                  rules: [{
                    required: false,
                    message: '请选择!',
                  }],
                }
              ]"
              placeholder="不限"
            />
          </a-form-item>
        </a-col>
        <!--<a-col :span="4">-->
          <!--<a-form-item>-->
            <!--<a-button>添加</a-button>-->
          <!--</a-form-item>-->
        <!--</a-col>-->
      </a-row>
      <!--属性查询-->
      <a-row :gutter="24">
        <a-col :span="5">
          <a-form-item :label="`属性`">
            <a-select v-decorator="[
                '属性',
                {rules: [{ required: false, message: 'Please select your gender!' }]}
              ]">
              <a-select-option :value="item.name" v-for="item in properties.propertykeys" :key="item.id">{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="5">
          <a-form-item :label="`查询方式`" has-feedback>
            <a-select
              @change="handleSXSelectChange"
              v-decorator="[
                '属性查询方式',
                {rules: [{ required: false, message: '请选择!' }]}
              ]"
              placeholder="请选择"
            >
              <a-select-option v-for="item in searchKinds" :value="item.value" :key="item.label">
                {{item.label}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="5">
          <a-form-item :label="`过滤条件`" has-feedback>
            <a-select
              v-decorator="[
                '属性过滤条件',
                {rules: [{ required: false, message: '请选择!' }]}
              ]"
              placeholder="请选择"
            >
              <a-select-option v-if="selectSXKinds == '1'" v-for="item in accurateKinds" :value="item.value" :key="item.label">
                {{item.label}}
              </a-select-option>
              <a-select-option v-if="selectSXKinds == '2'" v-for="item in rangeSXKinds" :value="item.value" :key="item.label">
                {{item.label}}
              </a-select-option>
              <a-select-option v-if="selectSXKinds == '3'" v-for="item in vagueSXKinds" :value="item.value" :key="item.label">
                {{item.label}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="5" :xs="{ span: 9 }" :sm="{span:9}" :md="{span:9}" :lg="{span:9}" :xl="{span:9}">
          <a-form-item :label="`查询（不限制）`" has-feedback>
            <a-input
              v-decorator="[
                '属性值',
                {
                  rules: [{
                    required: false,
                    message: '请选择!',
                  }],
                }
              ]"
              placeholder="不限"
            />
          </a-form-item>
        </a-col>
        <!--<a-col :span="4">-->
          <!--<a-form-item>-->
            <!--<a-button>添加</a-button>-->
          <!--</a-form-item>-->
        <!--</a-col>-->
      </a-row>
      <!--起点-->
      <a-row :gutter="24">
        <a-col :span="24">
          <a-Divider orientation="left">其它选项</a-Divider>
        </a-col>
        <a-col :span="5">
          <a-form-item :label="`起点`">
            <a-select
              v-decorator="[
            `起点`,
            {
            rules: [{
            required: false,
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
      <!--终点-->
      <a-row :gutter="24">
        <a-col :span="5">
          <a-form-item :label="`终点`">
            <a-select
              v-decorator="[
            `终点`,
            {
            rules: [{
            required: false,
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
    <search-result v-if="isShowSearchResult" :searchType="'relation'" :resultNum="resultNum"></search-result>
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
          }],
        accurateKinds: [     // 精确条件下的过滤条件
          {
            label: '等于',
            value: 'eq'
          },{
            label: '不等于',
            value: 'neq'
          },{
            label: '是',
            value: '_is'
          },{
            label: '不是',
            value: '_not'
          }
        ],
        rangeLXKinds: [
          {
            label: '列表',
            value: 'list'
          }
        ],
        rangeSXKinds: [       // 范围条件下的过滤条件
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
          }, {
            label: '列表',
            value: 'list'
          },
          {
            label: '数值型包含',
            value: 'inside'
          },
          {
            label: '数值型不包含',
            value: 'outside'
          },
        ],
        vagueLXKinds: [
          {
            label: '字符型包含',
            value: 'inside'
          },
          {
            label: '字符型不包含',
            value: 'outside'
          },
          // {
          //   label: '以...开头',
          //   value: 'beginwith'
          // }
        ],
        vagueSXKinds: [      // 模糊条件下的过滤条件
          {
            label: '字符型包含',
            value: 'contains'
          },
          {
            label: '字符型不包含',
            value: 'exclude'
          },
          // {
          //   label: '以...开头',
          //   value: 'beginwith'
          // },
        ],
        selectLXKinds: '0',         // 类型查询，选择类型后决定过滤条件， 默认0，没有可选项
        selectSXKinds: '0',         // 属性查询，选择类型后决定过滤条件， 默认0，没有可选项
        fetching: false,
        resultNum: 0
      }
    },
    computed: {
      searchResult: function () {
        return graph.getNode(this.$store.state.graph)
      },
      isShowSearchResult: function () {
        return this.$store.state.isShowSearchResult
      },
      properties: function () {
        return this.$store.state.all_properties
      },
    },
    methods: {
      handleSearch  (e) {
        const vm = this
        e.preventDefault();
        this.form.validateFields((error, values) => {
          console.log('error', error);
          if (!error) {
            var searchStr = getRelationSearchStr(values)
            this.$store.dispatch('getAllGraphNum', searchStr + '.count()').then((result) => {
              vm.resultNum = result.data.data ? result.data.data[0] : 0
            })
            this.$store.dispatch('getAllGraph', searchStr + '.limit(' + search_limit + ')')
              .then(function () {
                vm.$store.dispatch('setSearchFlag', true)
              }).catch(function (err) {
                if(err) {
                  vm.$message.error('请求错误:' + err)
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
        this.form.value = tar.name
      }
    }
  }

  /**
   * 查询的字符串拼接
   * @param data
   * @returns {string|string}
   */
  function getRelationSearchStr(data) {
    console.log('填写的过滤条件', data)
    var vertexS=''//邻接边条件
    var vertexT=''//邻接点条件
    var labelD=''//类型条件
    var propertyD=''//属性条件
    var str = 'g.E()'
    var currentGraph=''
    if(computed_str)
      currentGraph=computed_str+';g=sub.traversal();'
    // 关系查询
    // 此处拼接查询语句
    if(undefined != data['终点']){
      vertexS='.match(__.as("a").inV().hasId("'+data['终点']+'")).select("a").dedup()'
    }
    if(undefined!=data['起点']){
      vertexT='.match(__.as("b").outV().hasId("'+data['起点']+'")).select("b").dedup()'
    }
    if(undefined != data['类型值']){
      switch(data['类型过滤条件']){
        case '_is'://相等
          labelD='.match(__.as("c").hasLabel("'+data['类型值']+'")).select("c").dedup()'
          break;
        case '_not'://不相等
          labelD='.match(__.as("c").not(hasLabel("'+data['类型值']+'"))).select("c").dedup()'
          break;
        case 'eq'://相等
          labelD='.match(__.as("c").hasLabel("'+data['类型值']+'")).select("c").dedup()'
          break;
        case 'neq'://不相等
          labelD='.match(__.as("c").not(hasLabel("'+data['类型值']+'"))).select("c").dedup()'
          break;
        case 'list'://列表
          labelD='.match(__.as("c").hasLabel('+data['类型值']+')).select("c").dedup()'
          break;
        case 'inside':
          labelD='.filter({ it.get().label().contains("'+data['类型值']+'") }).dedup()'
          break;
        case 'outside':
          labelD='.filter({ !it.get().label().contains("'+data['类型值']+'") }).dedup()'
          break;
        case 'beginwith':
          labelD='.filter({ it.get().label().matches("'+data['类型值']+'".*) }).dedup()'
          break;
      }
    }
    if(undefined != data['属性']){
      switch(data['属性过滤条件']){
        case 'eq'://数值型相等
          propertyD='has("'+data['属性']+'").match(__.as("e").has("'+data['属性']+'",'+'eq('+data['属性值']+'))).select("e").dedup()'
          break;
        case '_is'://是
          propertyD='has("'+data['属性']+'").match(__.as("e").has("'+data['属性']+'",'+'eq("'+data['属性值']+'"))).select("e").dedup()'
          break;
        case '_not'://不是
          propertyD='has("'+data['属性']+'").match(__.as("e").has("'+data['属性']+'",'+'neq("'+data['属性值']+'"))).select("e").dedup()'
          break;
        case 'neq'://不相等
          propertyD='has("'+data['属性']+'").match(__.as("e").has("'+data['属性']+'",'+'neq('+data['属性值']+'))).select("e").dedup()'
          break;
        case 'lt'://小于
          propertyD='has("'+data['属性']+'").match(__.as("e").has("'+data['属性']+'",'+'lt('+data['属性值']+'))).select("e").dedup()'
          break;
        case 'lte'://小于等于
          propertyD='has("'+data['属性']+'").match(__.as("e").has("'+data['属性']+'",'+'lte('+data['属性值']+'))).select("e").dedup()'
          break;
        case 'gt'://大于
          propertyD='has("'+data['属性']+'")..match(__.as("e").has("'+data['属性']+'",'+'gt('+data['属性值']+'))).select("e").dedup()'
          break;
        case 'gte'://大于等于
          propertyD='has("'+data['属性']+'").match(__.as("e").has("'+data['属性']+'",'+'gte('+data['属性值']+'))).select("e").dedup()'
          break;
        case 'inside'://数值型包含
          var range=data['属性值'].split(",")
          propertyD='has("'+data['属性']+'").match(__.as("e").has("'+data['属性']+'",'+'between('+range[0]+','+range[1]+'))).select("e").dedup()'
          break;
        case 'outside'://数值型不包含
          var range=data['属性值'].split(",")
          propertyD='has("'+data['属性']+'").match(__.as("e").has("'+data['属性']+'",'+'outside('+range[0]+','+range[1]+'))).select("e").dedup()'
          break;
        case 'contains'://字符型包含
          propertyD='has("'+data['属性']+'").filter({ it.get().value("'+data['属性']+'").contains("'+data['属性值']+'") }).dedup()'
          break;
        case 'exclude'://字符型不包含
          propertyD='or(has("'+data['属性']+'").filter({ !it.get().value("'+data['属性']+'").contains("'+data['属性值']+'") }),hasNot("'+data['属性']+'")).dedup()'
          break;
        case 'beginwith'://以...开头
          propertyD='has("'+data['属性']+'").filter({ it.get().value("'+data['属性']+'").matches("'+data['属性值']+'".*) }).dedup()'
          break;
        case 'list'://列表
          propertyD='has("'+data['属性']+'").match(__.as("e").has("'+data['属性']+'",'+'within('+data['属性值']+'))).select("e").dedup()'
      }
    }
    str=currentGraph+str+labelD+vertexT+vertexS+propertyD
    console.log(str)
    return str
  }
</script>

<style scoped>
  .abc{
    padding: 35px;
  }
</style>
