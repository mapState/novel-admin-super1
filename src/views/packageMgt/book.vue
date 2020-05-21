<template>
  <div class="main">
    <el-button type="primary" class="add" @click="addFormShow">新增套餐</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column align="center" label="编号" prop="id" width="180" />
      <el-table-column align="center" prop="amount" label="书币金额" width="180" />
      <el-table-column align="center" prop="rmbAmount" label="套餐价格" />
      <el-table-column align="center" prop="giveAmount" label="赠送书币" width="180" />
      <el-table-column align="center" prop="createDate" label="创建时间" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="handleClick(scope.row,0)">下架</el-button>
          <el-button type="text" size="medium" @click="handleClick(scope.row,1)">编辑</el-button>
          <el-button type="text" size="medium" @click="handleClick(scope.row,2)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      background
      :current-page="currentPage"
      :page-sizes="[10, 20, 40, 100]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog title="新增/编辑套餐" :visible.sync="dialogFormVisible">
      <el-form :model="addForm">
        <el-form-item label="书币金额" :label-width="formLabelWidth">
          <el-input v-model.number="addForm.amount">
            <template slot="append">(书币)</template>
          </el-input>
        </el-form-item>
        <el-form-item label="套餐价格" :label-width="formLabelWidth">
          <el-input v-model.number="addForm.rmbAmount">
            <template slot="append">(元)</template>
          </el-input>
        </el-form-item>
        <el-form-item label="赠送书币" :label-width="formLabelWidth">
          <el-input v-model.number="addForm.giveAmount">
            <template slot="append">(书币)</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      pageNo: 1,
      pageSize: 10,
      dialogFormVisible: false,
      formLabelWidth: '80px',
      addForm: {
        amount: 0,
        giveAmount: 0,
        rmbAmount: 0,
        billType: 2 // 套餐类型 1会员 2书币套餐
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    addFormShow() {
      this.addForm = {}
      this.addForm.billType = 2
      this.dialogFormVisible = true
    },
    getList() {
      request({
        url: '/system/billMenu/list',
        method: 'get',
        params: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          billType: 2 // 套餐类型 1会员 2书币套餐
        }
      }).then(res => {
        console.log(res)
        this.tableData = res.data
        this.total = res.count
      })
    },
    submit() {
      request({
        url: '/system/billMenu/save',
        method: 'post',
        data: this.addForm
      }).then(res => {
        console.log(res)
        this.$message({
          type: 'success',
          message: res.message
        })
        this.dialogFormVisible = false
        this.getList()
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageNo = val
    },
    // 删除
    delItem(ids) {
      request({
        url: '/system/billMenu/delete',
        method: 'post',
        data: {
          ids
        }
      }).then(res => {
        console.log(res)
        this.$message({
          type: 'success',
          message: res.message
        })
        this.dialogFormVisible = false
        this.getList()
      })
    },
    handleClick(row, index) {
      console.log(row)
      if (index === 0) {
        // 下架
        this.addForm.id = row.id
        this.addForm.giveAmount = 0
        this.addForm.amount = 0
        this.addForm.rmbAmount = 0
        this.addForm.billType = 2
        this.submit()
      } else if (index === 2) {
        // 删除
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.delItem(row.id)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
      } else {
        // 编辑
        this.addForm = { ...row }
        this.dialogFormVisible = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.main {
  padding: 30px;
  .add {
    margin-bottom: 20px;
  }
  .pagination {
    float: right;
    margin-top: 30px;
  }
}
</style>
