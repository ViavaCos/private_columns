<template>
  <div class="private-table-wrap">
    <el-card class="private-table-wrap">
      <div slot="header" class="clearfix">
        <span>使用 Element UI</span>
        <PrivateColumnsSetting class="private-table-setting" :initial-columns="tableColumns" @refresh="() => getPrivateColumns()" />
      </div>

      <el-table
        v-loading="loading"
        class="private-table-content"
        :data="tableData"
        border
        style="width: 100%"
        @header-dragend="headerDragend"
      >
        <el-table-column
          v-for="column in displayColumns"
          :key="column.field"
          :prop="column.field"
          :label="column.title"
          :width="column.width"
        />
      </el-table>
    </el-card>
  </div>
</template>

<script>
import PrivateColumnsSetting from './PrivateColumnsSetting.vue'
import { fetchPrivateColumns, updatePrivateColumns } from '@/api'

export default {
  name: 'ElementTable',
  components: {
    PrivateColumnsSetting
  },
  data() {
    return {
      loading: false,
      remoteColumns: [],
      tableColumns: [
        {
          field: 'date',
          title: '日期',
          width: 180,
          sort: 1
        },
        {
          field: 'name',
          title: '姓名',
          width: 180,
          sort: 2
        },
        {
          field: 'address',
          title: '地址',
          sort: 3
        }
      ],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  computed: {
    displayColumns() {
      return this.remoteColumns.filter(i => !i.hidden)
    }
  },
  created() {
    this.getPrivateColumns()
  },
  methods: {
    async headerDragend(newWidth, oldWidth, column, event) {
      console.log({ newWidth, oldWidth, column, event })
      // console.log(column.index)
      const index = this.remoteColumns.findIndex(item => item.field === column.property)
      if (index < 0) {
        return
      }

      const newColumns = [...this.remoteColumns]
      newColumns.splice(index, 1, {
        ...this.remoteColumns[index],
        width: newWidth
      })
      await updatePrivateColumns(newColumns)

      // 更新成功后调用接口获取新的配置
      this.getPrivateColumns()
    },
    // 获取私有列配置
    async getPrivateColumns() {
      this.loading = true
      this.remoteColumns = []
      try {
        const res = await fetchPrivateColumns()
          this.loading = false
        if (res.length) {
          this.remoteColumns = res
          return
        }
        this.remoteColumns = JSON.parse(JSON.stringify(this.tableColumns))
      } catch (error) {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.private-table-wrap {
  text-align: left;
}
.private-table-setting {
  float: right;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
</style>
