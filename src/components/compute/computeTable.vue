<template>
    <div>
      <!--<a-button class="editable-add-btn" @click="handleAdd">Add</a-button>-->
      <a-table class="table-box"  bordered :dataSource="tableData"  size="small" :columns="columns" :pagination="false">
        <template slot="name" slot-scope="text, record">
          <editable-cell :text="text" @change="onCellChange(record.key, 'name')"/>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-popconfirm
            v-if="dataSource.length"
            title="Sure to delete?"
            @confirm="() => onDelete(record.key)">
            <a href="javascript:;">Delete</a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
</template>

<script>
    export default {
      props: ['tableData','count'],
        data() {
          return {
            columns: [ {
              title: '名称',
              dataIndex: 'Mc',
            }, {
              title: '说明',
              dataIndex: 'des',
              // scopedSlots: { customRender: 'operation' },
            }],
          }
        },
      methods:{
        onCellChange (key, dataIndex) {
          return (value) => {
            const dataSource = [...this.dataSource]
            const target = dataSource.find(item => item.key === key)
            if (target) {
              target[dataIndex] = value
              this.dataSource = dataSource
            }
          }
        },
        onDelete (key) {
          const dataSource = [...this.dataSource]
          this.dataSource = dataSource.filter(item => item.key !== key)
        },
        handleAdd () {
          const { count, dataSource } = this
          const newData = {
            key: count,
            Mc: `Edward King ${count}`,
            des: 58,
          }
          this.dataSource = [...dataSource, newData]
          this.count = count + 1
        },
      },
      mounted( ){
        console.log(this.count)
      }
    }
</script>

<style scoped>
  .table-box{
    margin-top: 5px;
  }
</style>
