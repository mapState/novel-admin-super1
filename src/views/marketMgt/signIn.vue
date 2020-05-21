<template>
  <div class="main">
    <el-button type="primary" class="add" @click="add">添加签到</el-button>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        align="center"
        label="签到天数"
        type="index"
        width="400"
      />
      <el-table-column
        align="center"
        prop="sysValue"
        label="签到奖励"
        width="400"
      />
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="handleClick(scope.row,0)">编辑</el-button>
          <el-button type="text" size="medium" @click="handleClick(scope.row,1)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      background
      :current-page="currentPage"
      :page-sizes="[10, 20, 40, 100]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 弹框 -->
    <el-dialog title="添加签到" :visible.sync="dialogFormVisible">
      <el-form ref="addForm" :model="signInForm" label-width="80px">
        <el-form-item label="签到时间">
          第
          <el-input-number v-model="signInForm.sysName" @change="handleChange" />
          天
        </el-form-item>
        <el-form-item label="签到奖励">
          <el-input v-model="signInForm.sysValue" style="width:220px;" />(书币)
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
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
      signInForm: {
        sysName: '',
        sysValue: '',
        sysType: 4
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    submit() {
      request({
        url: '/system/config/save',
        method: 'post',
        data: this.signInForm
      }).then((res) => {
        console.log(res)
        this.$message({
          type: 'success',
          message: res.message
        })
        this.dialogFormVisible = false
        this.pageNo = 1
        this.getList()
      })
    },
    // 添加公告
    add() {
      this.dialogFormVisible = true
    },
    handleChange(value) {
      console.log(value)
    },
    getList() {
      request({
        url: '/system/config/list',
        method: 'get',
        params: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          sysType: 4// 1素材 2邀请好友奖励 3 新用户注册赠送 4 签到配置
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
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageNo = val
    },
    // 删除提现列表
    delItem(ids) {
      request({
        url: '/system/config/delete',
        method: 'post',
        data: {
          ids,
          sysType: 4
        }
      }).then((res) => {
        console.log(res)
        this.$message({
          type: 'success',
          message: res.message
        })
        this.dialogFormVisible = false
        this.pageNo = 1
        this.getList()
      })
    },
    handleClick(row, index) {
      if (index === 0) { // 编辑
        this.signInForm = { ...row }
        this.dialogFormVisible = true
      } else { // 删除
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
