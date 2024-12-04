<template>
  <div class="private-columns-setting">
    <el-button icon="el-icon-setting" type="text" @click="dialogVisible = true">设置</el-button>

    <el-dialog
      title="表头配置"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-tree
        ref="privateSettingTree"
        v-loading="loading"
        :data="columns"
        draggable
        :props="{ label: 'title' }"
        show-checkbox
        node-key="field"
        default-expand-all
        :append-to-body="true"
        :expand-on-click-node="false"
        :close-on-press-escape="false"
        :default-checked-keys="defaultCheckedKeys"
        :destroy-on-close="true"
        :allow-drop="allowDrop"
      />

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" plain @click="reset">重 置</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPrivateColumns, updatePrivateColumns } from '@/api'

export default {
  name: 'PrivateColumnsSetting',
  props: {
    initialColumns: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      columns: [],
      defaultCheckedKeys: []
    }
  },
  watch: {
    dialogVisible: {
      handler(newVal) {
        newVal && this.getPrivateColumns()
      }
    }
  },
  methods: {
    async reset() {
      this.columns = JSON.parse(JSON.stringify(this.initialColumns))
    },
    // 获取私有列配置
    async getPrivateColumns() {
      this.loading = true
      try {
        const res = await fetchPrivateColumns()
        this.loading = false
        if (!res.length) {
          this.columns = JSON.parse(JSON.stringify(this.initialColumns))
        } else {
          this.columns = res.sort((a, b) => a.sort - b.sort)
        }

        this.defaultCheckedKeys = this.columns.filter(i => !i.hidden).map(i => i.field)
      } catch (error) {
        this.loading = false
      }
    },
    allowDrop(draggingNode, dropNode, type) {
      // BUGFIX: 修复丢失的勾选（拖拽勾选的节点后，此勾选会被丢失）
      if (draggingNode.checked) {
        const originSelectedKeys = this.$refs.privateSettingTree.getCheckedKeys()

        setTimeout(() => {
          this.$refs.privateSettingTree.setCheckedKeys(originSelectedKeys)
        }, 200);
      }
      // type 参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
      if (type === 'inner') {
        return false
      }
      return true
    },
    // 确认
    async confirm() {
      try {
        const selectedKeys = this.$refs.privateSettingTree.getCheckedKeys()
        const newColumns = this.columns.map((i, index) => {
          return {
            ...i,
            sort: index + 1,
            hidden: !selectedKeys.includes(i.field)
          }
        })
        await updatePrivateColumns(newColumns)
        this.dialogVisible = false
        this.$emit('refresh')
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style scoped>

</style>
