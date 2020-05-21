<template>
    <div class="main">
        <el-button type="primary" class="add" @click="add">新增素材</el-button>
        <el-table
        :data="tableData"
        style="width: 100%">
            <el-table-column
                align="center"
                label="素材编号"
                prop="id"
                width="400">
                </el-table-column>
            <el-table-column
                align="center"
                prop="sysName"
                label="素材名称"
                width="400">
            </el-table-column>
            <el-table-column
                align="center"
                label="文件">
                <template slot-scope="scope">
                    <a :href="scope.row.sysValue" target="_blank" style="color:#1890ff">下载</a>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row,0)" type="text" size="medium">编辑</el-button>
                    <el-button @click="handleClick(scope.row,1)" type="text" size="medium">删除</el-button>
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
        <!-- 弹框 -->
        <el-dialog title="新增/编辑素材" :visible.sync="dialogFormVisible">
            <el-form :model="signInForm" ref="addForm" label-width="80px">
                <el-form-item label="套餐名称">
                    <el-input v-model="signInForm.sysName" style="width:220px;"></el-input>
                </el-form-item>
                <el-form-item label="上传文件">
                    <el-upload
                        class="avatar-uploader"
                        :action="$upLoadUrl+'/file/upload'"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess1"
                        :before-upload="beforeAvatarUpload1"
                    >
                        <span v-if="signInForm.sysValue">{{signInForm.sysValue}}</span>
                        <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </el-upload>
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
        data(){
            return{
                tableData: [],
                total:0,
                currentPage:1,
                pageNo:1,
                pageSize:10,
                dialogFormVisible:false,
                signInForm:{
                    sysName:'',
                    sysValue:'',
                    sysType:1
                },
                dialogImageUrl: '',
                dialogVisible: false
            }
        },
        mounted(){
            this.getList()
        },
        methods:{
            //文件上传
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            submit(){
                console.log(this.signInForm)
                request({
                    url: '/system/config/save',
                    method: 'post',
                    data:this.signInForm
                }).then((res)=>{
                    this.dialogFormVisible=false
                    this.$message({
                        type: 'success',
                        message: res.message
                    });
                    this.getList()
                })

            },
            //添加公告
            add(){
                this.signInForm={
                    sysName:'',
                    sysValue:'',
                    sysType:1
                },
                this.dialogFormVisible=true
            },
            handleChange(value){
                console.log(value);
            },
             getList(){
                request({
                    url: '/system/config/list',
                    method: 'get',
                    params:{
                        pageNo:this.pageNo,
                        pageSize:this.pageSize,
                        sysType:1
                    }
                }).then((res)=>{
                    console.log(res)
                    this.tableData=res.data
                    this.total=res.count
                })
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize=val
                this.pageNo=1
                this.getList()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.pageNo=val
                this.getList()
            },
            delItem(ids){
                request({
                    url: '/system/cashOut/delete',
                    method: 'POST',
                    data:{
                        ids
                    }
                }).then((res)=>{
                    console.log(res)
                    this.$message({
                        type: 'success',
                        message: res.message
                    });
                    this.getList()
                }) 
            },
            handleClick(row,index){
                if(index===0){//通过
                    this.signInForm={...row}
                    this.dialogFormVisible=true
                }else{//删除
                this.$confirm('是否删除该素材?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            this.delItem(row.id)
                        }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });          
                    });
                }
            },
             handleAvatarSuccess1(res, file) {
            this.signInForm.sysValue = res.data
            // this.imgUrl = URL.createObjectURL(file.raw);
            // console.log(res)
            // this.addForm.imgUrl=res.data
            },
            beforeAvatarUpload1(file){
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
            margin-bottom:20px;
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

    }
</style>