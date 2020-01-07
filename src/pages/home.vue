<template>
  <div class="pd-150">
   <a-row class="pd-150-box">
     <a-col :span="6"></a-col>
     <a-col :span="12">
       <h2 class="font22">Uni Graph</h2>
       <div class="li-hei">
         随着大数据时代的到来，面向多源、异构、海量数据集成组织和统一访问需求，
         综合运用自然语言处理、知识图谱和图谱数据库构建等技术，形成数据集成访问
         服务及平台系统，将在国防信息化工作中发挥核心重要的作用。
       </div>
     </a-col>
     <a-col :span="6"></a-col>
   </a-row>
   <a-row :gutter="24">
     <!--查询-->
      <a-col :span="6" :xs="{ span: 24 }" :sm="{span:24}" :md="{span:24}" :lg="{span:24}" :xl="{span:6}" :style="{paddingLeft:'20px',paddingBottom:'40px'}">
        <div class="h-card">
          <a-row><div class="h-top"><img :src="search" alt="" ></div></a-row>
          <a-row clss="hca-rd">
            <div class="h-card-head"><b>查询</b></div>
            <div class="box-card-head"><span>对图谱数据进行多角度查询</span></div>
            <a-row>
              <a-col :xs="{ span: 8 }" :sm="{span:8}" :md="{span:8}" :lg="{span:8}" :xl="{span:8}"
                     style="padding:10px"
                     v-for="item in menu.search"
                     :key="item.key">
                <a-icon type="tags" theme="twoTone"/>
                <span><router-link :to="{  name: item.component,params: {type: item.params}}">{{item.name}}</router-link></span>
              </a-col>
            </a-row>
          </a-row>
        </div>
      </a-col>
     <!--本体-->
      <a-col :span="6" :xs="{ span: 24 }" :sm="{span:24}" :md="{span:24}" :lg="{span:24}" :xl="{span:6}" :style="{paddingLeft:'20px',paddingBottom:'40px'}">
        <div class="h-card">
          <a-row><div class="h-top"><img :src="ont" alt=""></div></a-row>
          <a-row clss="hca-rd">
            <div class="h-card-head"><b>本体/关系</b></div>
            <div class="box-card-head"><span>创建、管理和导入/导出图谱本体数据</span></div>
            <a-row>
              <a-col :xs="{ span: 8 }" :sm="{span:8}" :md="{span:8}" :lg="{span:8}" :xl="{span:8}"
                     v-for="item in menu.owl" :key="item.key" style="padding:10px">
                <a-icon type="tags" theme="twoTone"/>
                <span><router-link :to="{  name: item.component,params: {type: item.params}}">{{item.name}}</router-link></span>
              </a-col>
            </a-row>
          </a-row>
        </div>
      </a-col>
     <!--实体-->
      <a-col :span="6" :xs="{ span: 24 }" :sm="{span:24}" :md="{span:24}" :lg="{span:24}" :xl="{span:6}" :style="{paddingLeft:'20px',paddingBottom:'40px'}">
        <div class="h-card">
          <a-row><div class="h-top"><img :src="entiy" alt=""></div></a-row>
          <a-row clss="hca-rd">
            <div class="h-card-head"><b>实体/关系</b></div>
            <div class="box-card-head"><span>创建、管理和可视化分析图谱数据</span></div>
            <a-row>
              <a-col :xs="{ span: 8 }" :sm="{span:8}" :md="{span:8}" :lg="{span:8}" :xl="{span:8}"
                     v-for="item in menu.entity" :key="item.key" style="padding:10px">
                <a-icon type="tags" theme="twoTone"/>
                <span><router-link :to="{  name: item.component,params: {type: item.params}}">{{item.name}}</router-link></span>
              </a-col>
            </a-row>
          </a-row>
        </div>
      </a-col>
     <!--计算-->
      <a-col :span="6" :xs="{ span: 24 }" :sm="{span:24}" :md="{span:24}" :lg="{span:24}" :xl="{span:6}" :style="{paddingLeft:'20px',paddingBottom:'40px'}">
       <div class="h-card">
         <a-row><div class="h-top"><img :src="jisuan" alt=""></div></a-row>
         <a-row clss="hca-rd">
           <div class="h-card-head"><b>计算</b></div>
           <div class="box-card-head"><span>提供图谱数据上的计算分析和推理功能</span></div>
           <a-row>
             <a-col :xs="{ span: 8 }" :sm="{span:8}" :md="{span:8}" :lg="{span:8}" :xl="{span:8}"
                    v-for="item in menu.compute" :key="item.key" style="padding:10px">
               <a-icon type="tags" theme="twoTone"/>
               <span><router-link :to="{  name: item.component}">{{item.name}}</router-link></span>
             </a-col>
           </a-row>
         </a-row>
       </div>
     </a-col>
    </a-row>
  </div>
</template>

<script>
  import menu from '@/util/firstMenuConfig'
  import image from '@/assets/image/logo.svg'
  import entiy from '@/assets/image/entiy.svg'
  import ont from '@/assets/image/ont.svg'
  import search from '@/assets/image/search.svg'
  import jisuan from '@/assets/image/jisuan.svg'
    export default {
      name: "home",
      data() {
        return {
          image,
          entiy,
          ont,
          jisuan,
          search,
          menu
        }
      },
    }
</script>

<style scoped>
  .pd-150-box {
    padding: 50px 100px 100px 50px;
  }
  /*这是首页四个体样式 */
  .h-card {
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.05);
  }
  .h-card .h-top:hover {
    background: #e6f7ff;
  }
  .h-top img{
    width: 90%;
  }
  .h-card{
    background: #fff;padding: 10px;
    border-radius: 6px;
  }
  .box-card-head {
    text-align: center;color: rgba(0,0,0,0.45);
  }
  .h-card-head{
    padding: 20px;
  }


</style>
