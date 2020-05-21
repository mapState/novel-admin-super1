<template>
    <div class="main">
        <div class="btnBox">
            <el-button type="primary" class="add" @click="addClass">新增章节</el-button>
        <el-upload
            class="upload-demo"
            :action="$upLoadUrl+'/file/upload'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess1"
            :before-upload="beforeAvatarUpload1">
            <el-button type="primary" class="">批量导入</el-button>
        </el-upload>
        </div>
            <el-table
            :data="tableData"
            style="width: 100%">
                <el-table-column
                    prop="orderNum"
                    label="章节"
                    align="center"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="chapterName"
                    label="名称"
                    align="center"
                    width="200">
                </el-table-column>
                 <el-table-column
                    prop="chapterAmount"
                    label="价格"
                    align="center"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="isFree"
                    label="试读"
                    align="center"
                    width="200">
                    <template slot-scope="scope">
                        <el-radio-group v-model="scope.row.isFree" size="small" @change="isFreechange(scope.row.id,$event)">
                            <el-radio-button :label="1">是</el-radio-button>
                            <el-radio-button :label="0">否</el-radio-button>
                        </el-radio-group>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row,0)" type="text" size="medium">删除</el-button>
                        <!-- <el-button type="text" size="medium" @click="handleClick(scope.row,1)">编辑</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
            class="pagination"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 40, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
          <el-dialog title="新增章节" :visible.sync="dialogFormVisible1" @close="diaClose1">
            <el-form :model="charterForm" ref="charterForm" label-suffix=":">
                <el-form-item label="章节" 
                prop="orderNum"
                :label-width="formLabelWidth">
                     <el-input v-model.number="charterForm.orderNum" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="章节名称" 
                prop="chapterName"
                :label-width="formLabelWidth">
                    <el-input v-model="charterForm.chapterName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="试读" 
                prop="isFree"
                :label-width="formLabelWidth">
                    <el-radio-group v-model="charterForm.isFree">
                        <el-radio-button :label="1">是</el-radio-button>
                        <el-radio-button :label="0">否</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="价格" 
                prop="chapterAmount"
                :label-width="formLabelWidth">
                    <el-input v-model.number="charterForm.chapterAmount" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="添加文件" 
                prop="chapterUrl"
                :label-width="formLabelWidth">
                     <el-upload
                        class="avatar-uploader"
                        :action="$upLoadUrl+'/file/upload'"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess2"
                        :before-upload="beforeAvatarUpload2"
                    >
                        <span v-if="charterForm.chapterUrl">{{charterForm.chapterUrl}}</span>
                        <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="submit1">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
let bookId=''
import request from '@/utils/request'
    export default {
        data(){
            return{
                tableData: [],
                total:0,
                currentPage:1,
                formLabelWidth: '120px',//labelwidth
                dialogFormVisible1: false,//控制dialog显示
                fileList:[],
                charterForm:{
                    orderNum:'',
                    chapterName:'',
                    isFree:0,
                    chapterUrl:'',
                    bookId:'',
                    chapterAmount:''
                }
            }
        },
        mounted(){
            bookId=this.$route.query.bookId
            this.charterForm.bookId=bookId
            console.log(bookId)
            this.getList()
        },
        methods:{
            isFreechange(id,e){
                request({
                    url: '/system/chapter/save',
                    method: 'post',
                    data: {
                        bookId:this.charterForm.bookId,
                        id,
                        isFree:e
                    }
                }).then((res) => {
                    console.log(res)
                    this.$message({
                    type: 'success',
                    message: res.message
                    })
                })
            },
            delItem(ids){
                 request({
                    url: '/system/book/delete',
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
            diaClose1(){
                this.fileList=[]
                this.charterForm={
                    orderNum:'',
                    chapterName:'',
                    isFree:0,
                    chapterUrl:'',
                    bookId:bookId
                }
                this.$refs['charterForm'].resetFields()
            },
             handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件`);
            },
            submit1(){
                 request({
                    url: '/system/chapter/save',
                    method: 'post',
                    data:this.charterForm
                }).then((res) => {
                    console.log(res)
                    this.$message({
                    type: 'success',
                    message: res.message
                    })
                    this.pageNo=1
                    this.getList()
                    this.dialogFormVisible1=false
                })
            },
             getList(){
                request({
                    url: '/system/chapter/list',
                    method: 'get',
                    params:{
                        pageNo:this.pageNo,
                        pageSize:this.pageSize,
                        bookId:this.charterForm.bookId
                    }
                    }).then((res)=>{
                        this.total=res.count
                        this.tableData=res.data
                        console.log(res.data)
                })
            },
            delItem(ids){
                request({
                    url: '/system/chapter/delete',
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
            //row
            handleClick(row,index) {
                console.log(row,index);
                if(index===0){//删除
                    this.$confirm('此操作将永久删除该章节, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            this.delItem(row.id)
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消删除'
                        });          
                    });
                }else{//编辑
                    this.charterForm={...row}
                    this.dialogFormVisible1=true
                }
            },
             handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageNo=1
                this.getList()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.getList()
            },
            //新增分类
            addClass(){
                this.dialogFormVisible1=true
            },
            closeForm(){
                this.form={name:'',orderNum:'',type:1}
                this.$refs['addForm'].resetFields()
            },
            handleAvatarSuccess2(res, file) {
                this.charterForm.chapterUrl = res.data
                // this.imgUrl = URL.createObjectURL(file.raw);
                // console.log(res)
                // this.addForm.imgUrl=res.data
            },
            beforeAvatarUpload2(file) {
                // const isJPG = file.type === 'image/jpeg';
                // const isLt2M = file.size / 1024 / 1024 < 2;

                // if (!isJPG) {
                // this.$message.error('上传头像图片只能是 JPG 格式!');
                // }
                // if (!isLt2M) {
                // this.$message.error('上传头像图片大小不能超过 2MB!');
                // }
                // return isJPG && isLt2M;
            },
            handleAvatarSuccess1(res, file) {
                let zipUrl = res.data
                let zipName=file.name.split('.')[0]
                let type=2
               request({
                    url: '/system/bookFile/readEnd',
                    method: 'post',
                    data:{
                        type,
                        zipName,
                        zipUrl
                    }
                }).then((res) => {
                    console.log(res)
                    this.$message({
                    type: 'success',
                    message: res.message
                    })
                })
            },
            beforeAvatarUpload1(file) {
                // const isJPG = file.type === 'image/jpeg';
                // const isLt2M = file.size / 1024 / 1024 < 2;

                // if (!isJPG) {
                // this.$message.error('上传头像图片只能是 JPG 格式!');
                // }
                // if (!isLt2M) {
                // this.$message.error('上传头像图片大小不能超过 2MB!');
                // }
                // return isJPG && isLt2M;
            },

        }
    }
</script>
<style lang="scss" scoped>
     .main{
        padding:30px;
        .add{
            margin-bottom:30px;
        }
        .pagination{
            float:right;
            margin-top:30px;
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
        .img{
            width:60px;
            height: 60px;
        }
        .btnBox{
            display: flex;
        }
        .add{
            margin-bottom:30px;
            margin-right: 30px;
        }
    }
</style>