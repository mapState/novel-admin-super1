<template>
  <div class="main">
    <el-button type="primary" class="add" @click="add" v-if="type==0">添加公告</el-button>
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
        prop="id"
        label="公告标题"
        width="180"
      />
      <el-table-column
        align="center"
        prop="messageContent"
        label="公告内容"
      >
        <template slot-scope="scope">
          <span v-html="scope.row.messageContent" />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="createDate"
        label="发布时间"
      />
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="handleClick(scope.row,0)" v-if="type==0">下架</el-button>
          <el-button type="text" size="medium" @click="handleClick(scope.row,1)" v-if="type==0">编辑</el-button>
          <el-button type="text" size="medium" @click="handleClick(scope.row,2)" v-if="type==0">删除</el-button>
          <el-button type="text" size="medium" @click="handleClick(scope.row,3)" v-if="type==1||type==2">查看</el-button>
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

    <el-dialog title="添加/编辑公告" :visible.sync="dialogFormVisible">
      <el-form :model="addForm">
        <!-- <el-form-item label="公告标题">
                    <el-input v-model="addForm.title"></el-input>
                </el-form-item> -->
        <el-form-item label="公告内容" />
      </el-form>
      <quill-editor ref="myQuillEditor" v-model="addForm.messageContent" style="height: 300px;margin-bottom:60px;" :options="editorOption" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看公告" :visible.sync="dialogFormVisible1">
      <div v-html="messageContent"></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/request'
import {
  quillEditor
} from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  components: {
    quillEditor
  },
  computed: {
    ...mapGetters([
      'type'
    ])
  },
  data() {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      pageNo: 1,
      pageSize: 10,
      addForm: {
        // title:'',
        messageContent: '',
        messageType: 2
      },
      dialogFormVisible: false,
      dialogFormVisible1:false,
      editorOption: {},
      messageContent:''
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 添加公告
    add() {
      this.addForm = {}
      this.addForm.messageContent = ''
      this.messageType = 2
      this.dialogFormVisible = true
    },
    submit() {
      console.log(this.content)
      request({
        url: '/system/message/save',
        method: 'post',
        data: this.addForm
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
    getList() {
      request({
        url: '/system/message/list',
        method: 'get',
        params: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          messageType: 2// 1用户消息 2系统公告
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
    // del
    delItem(ids) {
      request({
        url: '/system/message/delete',
        method: 'POST',
        data: {
          ids
        }
      }).then((res) => {
        console.log(res)
        this.$message({
          type: 'success',
          message: res.message
        })
        this.pageNo = 1
        this.getList()
      })
    },
    handleClick(row, index) {
      if (index === 0) { // 下架
        this.$confirm('是否确认下架?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.addForm = { ...row }
          this.addForm.messageContent = ''
          this.submit()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      } else if (index == 2) { // 删除
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
      } else if(index==1) { // 编辑
        this.addForm = { ...row }
        this.dialogFormVisible = true
      }else{
        this.messageContent=row.messageContent
        this.dialogFormVisible1=true
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
