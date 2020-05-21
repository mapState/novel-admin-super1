<template>
  <div class="main">
    <el-button type="primary" class="add" @click="add">新增角色</el-button>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        align="center"
        label="角色名称"
        prop="name"
        width="400"
      />
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="handleClick(scope.row,0)">授权管理</el-button>
          <!-- <el-button type="text" size="medium" @click="handleClick(scope.row,1)">删除</el-button> -->
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
    <el-dialog title="新增角色" :visible.sync="dialogFormVisible">
      <el-form ref="addForm" :model="signInForm" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="signInForm.name" style="width:220px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit1">确认</el-button>
      </div>
    </el-dialog>
    <!-- 弹框 授权管理 -->
    <el-dialog title="授权管理" :visible.sync="dialogFormVisible1">
      <div class="list">
        <el-tree
          :data="treeData"
          show-checkbox
          node-key="id"
          ref="tree"
          :default-checked-keys="defaultIds"
          :props="defaultProps">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      pageNo: 1,
      pageSize: 10,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      signInForm: {
        name: ''
      },
      editId:'',//编辑菜单id
      treeData:[],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      defaultIds:[]
    }
  },
  computed:{
    ...mapGetters([
      'id'
    ]),
  },
  mounted() {
    this.getList()
  },
  methods: {
    submit(){
        let menus=this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
        console.log(menus);
        request({
        url: '/system/role/saveMenu',
        method: 'post',
        data: {
          id:this.editId,
          menus
        }
      }).then((res) => {
        console.log(res)
        this.$message({
          type: 'success',
          message: res.message
        })
        this.pageNo = 1
        this.getList()
        this.dialogFormVisible1 = false
      })
    },
    getTree(){
      console.log(this.id)
      request({
        url: '/system/menu/tree',
        method: 'get',
        params: {
          userId:this.id
        }
      }).then((res) => {
        console.log(res)
        this.treeData=res.data
        this.dialogFormVisible1 = true
      })
    },
    submit1() {
      request({
        url: '/system/role/save',
        method: 'post',
        data: this.signInForm
      }).then((res) => {
        console.log(res)
        this.$message({
          type: 'success',
          message: res.message
        })
        this.pageNo = 1
        this.getList()
        this.dialogFormVisible = false
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
        url: '/system/role/list',
        method: 'get',
        params: {
          pageNo: this.pageNo,
          pageSize: this.pageSize
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
    // 删除角色
    delRoles(id) {
      request({
        url: '/system/role/remove',
        method: 'post',
        data: {
          id
        }
      }).then((res) => {
        console.log(res)
        this.$message({
          type: 'success',
          message: res.message
        })
        this.getList()
      })
    },
    handleClick(row, index) {
      if (index === 0) { // 通过
        this.editId=row.id
        this.defaultIds=row.menus
        this.getTree()
      } else { // 拒绝
        this.$confirm('是否删除该角色?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delRoles(row.id)
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
