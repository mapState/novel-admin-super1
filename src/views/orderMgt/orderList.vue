<template>
    <div class="main">
        <div class="searchBox">
            <el-button type="primary" class="fr sBtn" @click="searchBook">搜索</el-button>
            <el-input
                class='fr sInput'
                size="smail"
                placeholder="请输入订单编号"
                v-model.trim="searValue"
                clearable>
            </el-input>
        </div>
            <el-table
            :data="tableData"
            style="width: 100%">
                <el-table-column
                    prop="id"
                    label="订单编号"
                    align="center"
                    width="140">
                </el-table-column>
                <el-table-column
                    prop="user.userName"
                    label="用户名"
                    align="center"
                    width="140">
                </el-table-column>
                <el-table-column
                    prop="billMenu.billType"
                    label="消费项目"
                    align="center"
                    width="140">
                </el-table-column>
                <el-table-column
                    prop="billMenu.amount"
                    label="金额"
                    align="center"
                    width="140">
                </el-table-column> 
                 <el-table-column
                    prop="payStatus"
                    label="支付状态"
                    align="center"
                    width="140">
                </el-table-column>
                <el-table-column
                    prop="user.createUserId"
                    label="上级代理"
                    align="center"
                    width="140">
                </el-table-column>
                <el-table-column
                    prop="user.region"
                    width='140'
                    align="center"
                    label="上级渠道">
                </el-table-column>
                <el-table-column
                    prop="createDate"
                    label="下单时间"
                    align="center"
                    width="160">
                     <template slot-scope="scope">
                       <span>{{payStatus==0?'删除':(payStatus==1?'未支付':'已支付')}}</span>
                       <span>{{createDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="medium">删除</el-button>
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
    </div>
    </div>
</template>

<script>
import request from '@/utils/request'
    export default {
        data(){
            return{
                pageNo:1,
                pageSize:10,
                total:0,
                tableData: [],
                currentPage:1,
                formLabelWidth: '120px',//labelwidth
                dialogFormVisible1: false,//控制dialog显示 充值书币
                topUpForm:{
                    a:'1'
                },
                dialogFormVisible2:false,//dialog 设置会员
                
                form:{name:'',id:'',img:''},
                imageUrl: '',//临时图片地址,
                searValue:'',
            }
        },
        mounted(){
            this.getList()
        },
        methods:{
            getList(){
                request({
                    url: '/system/order/list',
                    method: 'get',
                    params:{
                        pageNo:this.pageNo,
                        pageSize:this.pageSize
                    }
                }).then((res)=>{
                    console.log(res)
                    this.tableData=res.data
                    this.total=res.count
                })
            },
            searchBook(){
                console.log(this.searValue)
                this.pageNo=1
                request({
                    url: '/system/order/list',
                    method: 'get',
                    params:{
                        pageNo:this.pageNo,
                        pageSize:this.pageSize,
                        id:this.searValue
                    }
                }).then((res)=>{
                    console.log(res)
                    this.tableData=res.data
                    this.total=res.count
                    this.$message({
                        type: 'success',
                        message: res.message
                    });
                })
            },
            delOrder(ids){
                 request({
                    url: '/system/order/delete',
                    method: 'post',
                    data:{
                       ids
                    }
                }).then((res)=>{
                    console.log(res)
                    this.getList()
                    this.$message({
                        type: 'success',
                        message: res.message
                    });
                })
            },
            handleClick(row) {
                 this.$confirm('此操作将删除该订单, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            this.delOrder(row.id+'')
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消'
                        });          
                    });
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
            //提交充值
            submit(){
                //校验
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible=false
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
             //提交设置会员
            submit2(){
               
            },
            //上传图片
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
                console.log(file)
                this.form.img=this.imageUrl
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            }
        }
    }
</script>
<style lang="scss" scoped>
     .main{
        padding:30px;
        .searchBox{
            width:100%;
            height: 40px;
            padding-bottom:60px;
            .sInput{
                width:300px;
                margin-right: 10px;
            }
            .sBtn{
                height: 40px;
            }
            .fr{
                float: right;
            }
        }
        .add{
            margin-bottom:30px;
        }
        .pagination{
            float:right;
            margin:30px;
        }
        .img{
            width:50px;
            height:50px;
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