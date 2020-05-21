<template>
  <div class="main">
    <el-button type="primary" class="add" @click="dialogFormVisible=true">新增套餐</el-button>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        align="center"
        label="编号"
        prop="id"
        width="180"
      />
      <el-table-column
        align="center"
        prop="name"
        label="套餐名称"
        width="180"
      />
      <el-table-column
        align="center"
        prop="description"
        label="权益描述"
      />
      <el-table-column
        align="center"
        prop="rmbAmount"
        label="套餐价格"
        width="180"
      />
      <el-table-column
        align="center"
        prop="time"
        label="套餐时长"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.time }} {{ scope.row.timeType==1?'日':(scope.row.timeType==2?'月':'年') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="createDate"
        label="创建时间"
      />
      <el-table-column
        align="center"
        label="操作"
      >
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

    <el-dialog title="新增套餐" :visible.sync="dialogFormVisible">
      <el-form :model="addForm">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item label="权益描述" :label-width="formLabelWidth">
          <el-input v-model="addForm.description" type="textarea" />
        </el-form-item>
        <el-form-item label="套餐价格" :label-width="formLabelWidth">
          <el-input v-model.number="addForm.rmbAmount">
            <template slot="append">(元)</template>
          </el-input>
        </el-form-item>
        <el-form-item label="套餐时长" :label-width="formLabelWidth">
          <el-input v-model.number="addForm.time" />
          <el-radio-group v-model="addForm.timeType">
            <el-radio-button label="日" />
            <el-radio-button label="月" />
            <el-radio-button label="年" />
          </el-radio-group>
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
        name: '',
        description: '',
        amount: 0,
        time: '', // 周期数
        timeType: '日', // 1日 2月 3年
        billType: 1
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    submit() {
      console.log(this.addForm)
      let { timeType } = this.addForm
      if (timeType == '日') {
        timeType = 1
      } else if (timeType == '月') {
        timeType = 2
      } else {
        timeType = 3
      }
      this.addForm.timeType = timeType
      request({
        url: '/system/billMenu/save',
        method: 'post',
        data: this.addForm
      }).then((res) => {
        console.log(res)
        this.dialogFormVisible = false
        this.pageNo = 1
        this.getList()
      })
    },
    getList() {
      request({
        url: '/system/billMenu/list',
        method: 'get',
        params: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          billType: 1// 套餐类型 1会员 2书币套餐
        }
      }).then((res) => {
        console.log(res)
        this.tableData = res.data
        this.total = res.count
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.pageNo = 1
      this.getList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageNo = val
      this.getList()
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
      // console.log(row)
      if (index === 0) { // 下架
        this.addForm.id = row.id
        this.addForm.name = ''
        this.addForm.description = ''
        this.addForm.amount = 0
        this.addForm.rmbAmount = 0
        this.addForm.time = 0
        this.addForm.timeType = 1
        this.addForm.billType = 1
        this.submit()
      } else if (index === 2) { // 删除
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delItem(row.id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      } else { // 编辑
        this.addForm = { ...row }
        if (this.addForm.timeType == 1) {
          this.addForm.timeType = '日'
        } else if (this.addForm.timeType == 2) {
          this.addForm.timeType = '月'
        } else {
          this.addForm.timeType = '年'
        }
        console.log(this.addForm)
        this.dialogFormVisible = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
     .main{
        padding:30px;
        .add{
            margin-bottom:20px;
        }
        .pagination{
            float:right;
            margin-top:30px;
        }

    }
</style>
