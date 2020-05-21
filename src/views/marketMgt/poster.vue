<template>
  <div class="main">
    <el-button type="primary" class="add" @click="add">添加海报</el-button>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        align="center"
        label="海报图片"
        width="180"
      >
        <template slot-scope="scope">
          <a :href="$upLoadUrl + '/file/view/'+scope.row.imgUrl" target="_blank">
            <img :src="$upLoadUrl + '/file/view/'+scope.row.imgUrl" alt="" class="postImg">
          </a>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="advertType"
        label="关联类型"
        width="180"
      />
      <el-table-column
        align="center"
        prop="advertPosition"
        label="海报位置"
      />
      <el-table-column
        align="center"
        prop="linkUrl"
        label="链接"
      />
      <el-table-column
        align="center"
        prop="orderNum"
        label="顺序"
      />
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
        </el-form-item>
        <el-form-item
          label="海报图片"
          :label-width="formLabelWidth"
        >
          <el-upload
            class="avatar-uploader"
            :action="$upLoadUrl+'/file/upload'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="addForm.imgUrl" :src="$upLoadUrl + '/file/view/'+addForm.imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="关联类型" :label-width="formLabelWidth">
          <el-radio-group v-model="addForm.advertType">
            <el-radio-button label="链接" />
            <el-radio-button label="书籍" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="海报位置" :label-width="formLabelWidth">
          <el-radio-group v-model="addForm.advertPosition">
            <el-radio-button label="精选" />
            <el-radio-button label="书架" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="顺序" :label-width="formLabelWidth">
          <el-input v-model="addForm.orderNum" />
        </el-form-item>
        <el-form-item label="链接" :label-width="formLabelWidth">
          <el-input v-model="addForm.linkUrl" />
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
      formLabelWidth: '80px',
      addForm: {
        linkUrl: '',
        orderNum: 1,
        advertType: '链接',
        advertPosition: '精选',
        imgUrl: ''
      },
      imgUrl: '',
      dialogFormVisible: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    submit() {
      console.log(this.addForm)
      const tmp = { ...this.addForm }
      tmp.advertType = tmp.advertType == '链接' ? 1 : 2
      tmp.advertPosition = tmp.advertPosition == '精选' ? 1 : 2
      request({
        url: '/system/advert/save',
        method: 'post',
        data: tmp
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
      this.addForm = {
        linkUrl: '',
        orderNum: 1,
        advertType: '链接',
        advertPosition: '精选',
        imgUrl: ''
      }
      this.dialogFormVisible = true
    },
    getList() {
      request({
        url: '/system/advert/list',
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
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageNo = val
    },
    // 删除列表
    delItem(ids) {
      request({
        url: '/system/advert/delete',
        method: 'post',
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
      if (index === 0) { // 通过
        this.$confirm('是否确认审核通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '审核通过!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      } else if (index === 2) { // 拒绝
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
      } else {
        this.addForm = { ...row }
        console.log(row)
        const { advertType, advertPosition } = this.addForm
        this.addForm.advertType = advertType == 1 ? '链接' : '书籍'
        this.addForm.advertPosition = advertPosition ? '精选' : '书架'
        this.dialogFormVisible = true
      }
    },
    // 上传图片
    handleAvatarSuccess(res, file) {
      this.addForm.imgUrl =  res.data
      // this.imgUrl = URL.createObjectURL(file.raw);
      // console.log(res)
      // this.addForm.imgUrl=res.data
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      // const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      // this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      // if (!isLt2M) {
      // this.$message.error('上传头像图片大小不能超过 2MB!');
      // }
      // return isJPG && isLt2M;
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
        .postImg{
            width:50px;
            height: 50px;
        }
        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
            border: 1px dashed #d9d9d9;
        }
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }
    }
</style>
