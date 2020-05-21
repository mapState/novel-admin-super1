<template>
  <div class="main">
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        align="center"
        label="会员编号"
        prop="user.id"
        width="180"
      />
      <el-table-column
        align="center"
        prop="user.userName"
        label="昵称"
        width="180"
      />
      <el-table-column
        align="center"
        prop="messageContent"
        label="消息内容"
      />
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="handleClick(scope.row,0)">查看</el-button>
          <el-button type="text" size="medium" @click="handleClick(scope.row,1)">回复</el-button>
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
      pageSize: 10
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      request({
        url: '/system/message/list',
        method: 'get',
        params: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          messageType: 1// 1用户消息 2系统公告
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
    delListItem(ids) {
      request({
        url: '/system/cashOut/delete',
        method: 'POST',
        data: {
          ids
        }
      }).then((res) => {
        console.log(res)
      })
    },
    handleClick(row, index) {
      if (index === 0) { // 查看

      } else if (index === 2) { // 删除
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '已删除!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      } else {

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
