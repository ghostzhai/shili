<template>
  <div style="overflow-x: hidden">
  <a-row type="flex" justify="center" :gutter="32">
    <a-col :span="22" class="duo-mei-ti">
      <a-icon type="youtube"></a-icon>&nbsp;&nbsp;<b>多媒体</b></a-col>
    <a-col :span="12" class="duo-mei-ti-1">
      <a-input-group compact>
        <a-input style="width: 70%" defaultValue="查询的内容" v-model="searchStr" />
        <a-select v-model="selectType">
          <a-select-option :value="item.value" v-for="item in typeList" :key="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-button type="primary" icon="search" @click="onSearch">查询</a-button>
      </a-input-group>
    </a-col>
    <a-col :span="23">
      <div style="text-align: center">
        <a-alert v-if="resultNum" :message="'查询结果共 ' + resultNum + ' 条'" type="info"/>
      </div>
      <a-table v-if="nodes.length>0 && isShowSearchResult" :columns="tableColumns" :dataSource="nodes"
               size="middle"  :pagination="false">
        <span slot="action" slot-scope="text, record">
          <a-button size="small" @click="mediaView(record)">预览</a-button>
          <a-button size="small" @click="mediaDownload(record)">下载</a-button>
        </span>
      </a-table>
    </a-col>
    </a-row>
    <!--多媒体预览-->
    <media-view-modal :visible.sync="isShowMediaModal" :config="mediaConfig" @close="hidePopup()"></media-view-modal>
  </div>
</template>

<script>
  import {graph, cm} from '@/util/index' // graph数据处理工具类
  import mediaViewModal from '@/components/common/mediaViewModal'

  let timeout

  export default {
    components: { graph, mediaViewModal },
    data() {
      return {
        typeList: [   // 多媒体类型
          {
            name: '视频',
            value: '视频'
          },
          {
            name: '图像',
            value: '图像'
          },
          {
            name: '文本',
            value: '文本'
          },
          {
            name: '音频',
            value: '音频'
          },
          {
            name: '全部',
            value: '全部'
          }
        ],
        selectType: '音频', // 选中的多媒体类型
        searchStr: '',  // 输入的查询内容
        isShowMediaModal: false,
        mediaConfig: null,  // 多媒体预览的
        tableColumns: [{  // 查询结果的列
          title: '名称',
          dataIndex: '名称',
        }, {
          title: '类型',
          dataIndex: '类型',
        }, {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        }],
        resultNum: 0   //查询结果的条数
      }
    },
    computed: {
      isShowSearchResult: function () {
        return this.$store.state.isShowSearchResult
      },
      nodes: function () {
        return cm.getPropertityArr(this.$store.state.all_graph)
      },
    },
    methods: {
      onSearch() {
        if(!this.searchStr) {
          return
        }
        const vm = this
        var currentGraph=''
        if(computed_str)
          currentGraph=computed_str+';g=sub.traversal();'
        var searchStr = 'g.V().hasLabel("多媒体").'
        var typeStr = 'has("类型","' + this.selectType + '").'
        var str = 'filter({ it.get().value("名称").contains("' + this.searchStr + '") })'
        if(this.selectType === '全部') {
          searchStr += str
        } else {
          searchStr += typeStr + str
        }
        searchStr=currentGraph+searchStr

        this.$store.dispatch('getAllGraphNum', searchStr + '.count()').then((result) => {
          vm.resultNum = result.data.data ? result.data.data[0] : 0
        })
        this.$store.dispatch('getAllGraph', searchStr + '.limit(' + search_limit + ')')
          .then(function (data) {
            vm.$store.dispatch('setSearchFlag', true)
          }).catch(function (err) {
          if(err) {
            vm.$message.error('请求错误:'+ err)
          }
        })
      },
      /**
       * 多媒体预览
       * @param item
       */
      mediaView(item) {
        item['value'] = item.id
        item['type'] = item['类型']
        this.mediaConfig = item
        this.isShowMediaModal = true
      },
      /**
       * 多媒体下载
       * @param item
       */
      mediaDownload(item) {
        var url = ''
        url = graph_api + '/util/download.do?id=' + item['id'] + '&name=' + item['名称'] + '&gid=hugegraph'
        try{
          var elemIF = document.createElement("iframe");
          elemIF.src = url;
          elemIF.style.display = "none";
          document.body.appendChild(elemIF);
        }catch(e){
        }
      },
      hidePopup() {
        this.isShowMediaModal = false
      }
    }
  }

</script>

<style>
  .duo-mei-ti{
    padding:16px;border-bottom:1px solid rgb(235, 237, 240);
  }
  .duo-mei-ti-1{
    padding-top:16px;padding-bottom:32px;
  }
</style>
