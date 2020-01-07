<template>
  <div class="container">
    <!-- 编辑实体弹出框 -->
    <data-link-modal :visible.sync="showDataLink" @close="hideLinkModal" :type="dataType"></data-link-modal>
    <div class="box">
      <div class="card" v-for="item in database" >
          <a-card
            @click="openDataLinkModal(item.type)"
            hoverable
            style="width: 100%"
            class="bd-card"
          >
            <img
              alt="example"
              :src="item.imgUrl"
              slot="cover"
              class="bd-card-img"
            />
            <a-card-meta
              :title="item.name"
              :description="item.descript"
              class="bd-card-meta">
            </a-card-meta>
          </a-card>
      </div>
    </div>
  </div>
</template>

<script>
  import dataLinkModal from '@/components/import/dataLinkModal'
  import dameng from  '@/assets/image/dameng.jpg'
  import mysql from  '@/assets/image/mysql.jpg'
  import sqllite from  '@/assets/image/sqllite.jpg'
  import oracle from  '@/assets/image/oracle.jpg'

  export default {
    components: { dataLinkModal },
    data() {
      return {
        mysql,
        sqllite,
        dameng,
        oracle,
        dataType: '', // 选中的数据库类型
        showDataLink: false,
        database: [
          {
            name: 'MySQL',
            type: 'mysql',
            descript: 'MySQL是一种关系数据库管理系统，关系数据库将数据保存在不同的表中，而不是将所有数据放在一个大仓库内，这样就增加了速度并提高了灵活性。',
            imgUrl: mysql
          }, {
            name: 'SQLite',
            type: 'sqlite',
            descript: 'SQLite，是一款轻型的数据库，是遵守ACID的关系型数据库管理系统，它包含在一个相对小的C库中。它是D.RichardHipp建立的公有领域项目。',
            imgUrl: sqllite
          }, {
            name: 'Oracle',
            type: 'oracle',
            descript: 'Oracle数据库系统是目前世界上流行的关系数据库管理系统，系统可移植性好、使用方便、功能强，适用于各类大、中、小、微机环境。',
            imgUrl: oracle
          }, {
            name: '达蒙数据库',
            type: 'mysql',
            descript: '达梦数据库管理系统是达梦公司推出的具有完全自主知识产权的高性能数据库管理系统，简称DM。达梦数据库管理系统的最新版本是7.0版本，简称DM7。',
            imgUrl: dameng
          }
        ],
      }
    },
    computed: {
    },
    created() {
    },
    methods: {
      openDataLinkModal(type) {
        this.dataType = type
        this.showDataLink = true
      },
      hideLinkModal() {
        this.showDataLink = false
      }
    }
  }
</script>

<style scoped>
  .bd-card{
    border-radius: 3px;
    background: #F7F9FA;
  }
  .bd-card-meta, .ant-card-meta{
    color: red!important;
  }
  .bd-card:hover{
    border-radius: 3px;
    border-color:#108ee9;
  }
  .bd-card-img {
    border-bottom: 1px solid #E9E9E9;
  }
  .ant-card-body {
    background-color: red !important;
  }
  .ant-card-meta {
    margin: auto!important;
  }
</style>
