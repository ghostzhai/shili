<template>
  <div class="component-container" style="width: 100%; height:100%">
    <div>
      <!-- The circle layout puts nodes in a circle. -->
      <!-- 圆布局将节点置于圆上。 -->
      <input type="button" class="btn-1" @click="changeType('circle')"/>
      <!-- The CoSE layout by Bilkent with enhanced compound node placement. CoSE Bilkent gives near-perfect end results.
          Bilkent的COSE布局，具有增强的复合节点布局。cose-bilkent给出了近乎完美的最终结果。 -->
      <!--<input type="button" class="btn-2" @click="changeType('cose-bilkent')"/>-->
      <!-- The cose (Compound Spring Embedder) layout uses a physics simulation to lay out graphs. It works well with noncompound graphs and it has additional logic to support compound graphs well. -->
      <!-- COSE（复合弹簧嵌入器）布局使用物理模拟来绘制图形。它可以很好地与非磅图一起工作，并且它有额外的逻辑来支持复合图。 -->
      <input type="button" class="btn-3" @click="changeType('cose')"/>
      <!-- The grid layout puts nodes in a well-spaced grid. -->
      <!-- 网格布局将节点放置在间隔良好的网格中。 -->
      <input type="button" class="btn-4" @click="changeType('grid')"/>
      <!-- The Dagre layout for DAGs and trees. -->
      <!--<input type="button" class="btn-5" @click="changeType('dagre')"/>-->
      <!-- The concentric layout positions nodes in concentric circles, based on a metric that you specify to segregate the nodes into levels -->
      <!-- 同心布局将节点定位在同心圆中，基于指定的等级将节点分隔为级别 -->
      <input type="button" class="btn-2" @click="changeType('concentric')"/>

      <input type="button" class="btn-1" @click="changeType('random')"/>
      <input type="button" class="btn-1" @click="changeType('breadthfirst')"/>

    </div>
    <div id="cy" style="height: 100%;width:100%;"></div>
  </div>
</template>

<script>
  import {graph} from '@/util/index' // graph数据处理工具类
  // const layoutKinds = require(['@static/cytoscape/layout/cytoscape-klay', '@static/cytoscape/layout/cytoscape-cose-bilkent']);
  export default {
    components: {},
    data() {
      return {
        nodes: null,
        links: null
      }
    },
    created() {
    },
    methods: {
      init() {
        this.nodes = graph.getNode(this.$store.state.all_graph)
        this.links = graph.getLink(this.$store.state.all_graph)
        // 原始数据转为连线需要的格式
        var gLinks = getGraphLinks(this.links)
        // 原始数据转为点需要的格式
        var gNodes = getGraphNodes(this.nodes)
        console.log(gNodes)
        if(!(gLinks || gNodes)) {
          return
        }
        window.cy = cytoscape({
          container: document.getElementById('cy'),
          layout: {
            name: 'random'
          },
          style: [
            {
              selector: 'node',
              style: {
                'content': 'data(id)',
                'label': 'data(showName)',
                'text-margin-y': '25px',
                'font-size': '20px',
                // 'width': function (obj) {
                //   var textLength = obj._private.data.id.length
                //   var length = 15 * textLength
                //   return length + 'px'
                // },
                'background-color': '#DFDFEF',
                'border-color': '#7E7E7E',
                'border-width': 1,
              },
            },
            {
              selector: 'edge',
              style: {
                // 'content': 'data(relation)',
                'width': '2px',
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
                // 'label': 'data(label)'
              }
            },
          ],
          elements: {
            nodes: gNodes,
            edges: gLinks
          },
        });
          // 处理点
          cy.nodes('[label = "person"]').style({
            'background-color': '#61BFFC'
          })
          cy.nodes('[label = "software"]').style({
            'background-color': '#00DD17'
          })
      },
      changeType(type) {
        // console.log('layoutKinds:', layoutKinds)
        // cytoscape.use(layoutKinds)
        var layout = window.cy.layout({
          name: type
        });
        layout.run();
      }
    },
    mounted() {
      this.init()
    }
  }

  function getGraphNodes(nodes) {
    var gNodes = []
    for(var i = 0; i < nodes.length; i++) {
      var gNode = {
        data: {
          id: nodes[i].id,
          label: nodes[i].label,
          showName: nodes[i].properties ? nodes[i].properties['名称']: ''
        },
        properties: nodes[i].properties
      }
      gNodes.push(gNode)
    }
    return gNodes
  }
  function getGraphLinks(links) {
    var lines = []
    for(var i = 0; i < links.length; i++) {
      var line = {
        data: {
          source: links[i].outV,
          target: links[i].inV
        },
        orgData: links[i]
      }
      lines.push(line)
    }
    return lines
  }
</script>

<style>
  .btn-1 {
    background-image: url('../../static/1.png');
    width: 31px;
    height: 31px;
  }
  .btn-2 {
    background-image: url('../../static/2.png');
    width: 31px;
    height: 31px;
  }
  .btn-3 {
    background-image: url('../../static/3.png');
    width: 31px;
    height: 31px;
  }
  .btn-4 {
    background-image: url('../../static/4.png');
    width: 31px;
    height: 31px;
  }
  .btn-5 {
    background-image: url('../../static/5.png');
    width: 31px;
    height: 31px;
  }
</style>
