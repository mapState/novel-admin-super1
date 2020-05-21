<template>
  <div class="main">
    <el-button type="primary" class="add" @click="add">新增用户</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column align="center" label="昵称" prop="userName" width="200" />
      <el-table-column align="center" label="账号" prop="loginName" width="200" />
      <el-table-column align="center" label="身份" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.type==0?'管理员':(scope.row.type==1?'渠道':'代理') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="handleClick(scope.row,0)">编辑</el-button>
          <el-button type="text" size="medium" @click="handleClick(scope.row,1)">重置密码</el-button>
          <el-button type="text" size="medium" @click="handleClick(scope.row,2)">禁用</el-button>
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
    <el-dialog title="新增/编辑用户" :visible.sync="dialogFormVisible">
      <el-form ref="addForm" :model="signInForm" label-width="80px">
        <el-form-item
          label="用户名称"
          prop="userName"
          :rules="[
            { required: true, message: '请输入用户名称', trigger: 'blur' }
          ]"
        >
          <el-input v-model="signInForm.userName" style="width:220px;" />
        </el-form-item>
        <el-form-item
          label="账号"
          prop="loginName"
          :rules="[
            { required: true, message: '请输入账号', trigger: 'blur' }
          ]"
        >
          <el-input v-model="signInForm.loginName" style="width:220px;" />
        </el-form-item>
        <el-form-item
          label="角色"
          prop="type"
          :rules="[
            { required: true, message: '请选择角色', trigger: 'blur' }
          ]"
        >
          <el-radio-group v-model="signInForm.type">
            <el-radio-button :label="0">管理员</el-radio-button>
            <el-radio-button :label="1">渠道</el-radio-button>
            <el-radio-button :label="2">代理</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit1">确认</el-button>
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
        loginName: '',
        userName:'',
        type: 0,
        roles:[]
      },
      classList:[]
    }
  },
  mounted() {
    this.getList()
    this.getClass()
  },
  methods: {
     getClass() {
      request({
        url: '/system/role/list',
        method: 'get'
      }).then((res) => {
        console.log(res)
       this.classList=res.data
      })
    },
    // 保存用户
    submit1() {
      this.$refs['addForm'].validate(valid => {
        console.log(this.signInForm)
        let roles=[]
        if (valid) {
          let {type}=this.signInForm
          console.log(this.signInForm)
          if(type==0){
              roles.push(this.classList[2].id)
          }else if(type==1){
              roles.push(this.classList[0].id)
          }else if(type==2){
              roles.push(this.classList[1].id)
          }
          this.signInForm.roles=roles
          request({
            url: '/system/back/save',
            method: 'post',
            data: this.signInForm
          }).then(res => {
            console.log(res)
            this.$message({
              type: 'success',
              message: res.message
            })
            this.getList()
            this.dialogFormVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加公告
    add() {
      this.signInForm = {}
      this.dialogFormVisible = true
    },
    handleChange(value) {
      console.log(value)
    },
    // 禁用用户
    delUser(userId) {
      request({
        url: '/system/back/pass',
        method: 'get',
        params: {
          userId
        }
      }).then(res => {
        console.log(res.data)
        this.$message({
          type: 'success',
          message: res.message
        })
        this.pageNo = 1
        this.getList()
      })
    },
    // 重置密码
    reset(userId) {
      request({
        url: '/system/back/reset',
        method: 'get',
        params: {
          userId
        }
      }).then(res => {
        console.log(res)
        this.$message({
          type: 'success',
          message: res.message
        })
      })
    },
    getList() {
      request({
        url: '/system/back/list',
        method: 'get',
        params: {
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
      }).then(res => {
        console.log(res.data)
        this.tableData = res.data
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

    handleClick(row, index) {
      if (index === 0) {
        // 编辑
        this.signInForm = { ...row }
        this.dialogFormVisible = true
      } else if (index === 2) {
        // 禁用
        this.$confirm('是否禁用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.delUser(row.id)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
      } else {
        // 重置密码
        this.reset(row.id)
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
