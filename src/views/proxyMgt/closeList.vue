<template>
    <div class="main">
        <div>
            <span>总余额：{{tableData.amount}}</span>
            <el-button type="primary"  @click="withdraw" style="margin-left:20px;">提现</el-button>
        </div>
        <!-- <div class="searchBox">
            <el-date-picker
                v-model="date"
                @change="dateChange"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="primary" class="fr sBtn" @click="search">搜索</el-button>
            <el-input
                class='fr sInput'
                size="smail"
                placeholder="请输入渠道名称"
                v-model.trim="searValue"
                clearable>
            </el-input>

        </div> -->
            <el-table
            :data="tableData"
            style="width: 100%">
                <el-table-column
                    prop="userBack.loginName"
                    label="代理名称"
                    align="center"
                    width="240">
                </el-table-column>
                <el-table-column
                    prop="userBack.userName"
                    label="联系人"
                    align="center"
                    width="240">
                </el-table-column>
                <el-table-column
                    prop="userBack.phone"
                    label="联系方式"
                    align="center"
                    width="240">
                </el-table-column>
                 <el-table-column
                    prop="amount"
                    label="结算金额"
                    align="center"
                    width="240">
                </el-table-column>
                <el-table-column
                    prop="userBack.createDate"
                    label="结算时间"
                    align="center"
                    width="300">
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
        <el-dialog title="新增分类" :visible.sync="dialogFormVisible">
            <el-form :model="form" ref="addForm">
                <el-form-item label="分类名称" 
                prop="name"
                :rules="{
                    required: true, message: '分类名称不能为空', trigger: 'change'
                }"
                :label-width="formLabelWidth">
                     <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="编号" 
                prop="id"
                :rules="{
                    required: true, message: '编号不能为空', trigger: 'change'
                }"
                :label-width="formLabelWidth">
                    <el-input v-model="form.id" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="添加图标" 
                prop="img"
                :label-width="formLabelWidth">
                    <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">提交</el-button>
            </div>
        </el-dialog>

        <el-dialog title="提现" :visible.sync="dialogFormVisible1">
            <p>提现金额：{{tableData.amount}}</p>
            <p>提现方式：{{tableData.userBack&&tableData.userBack.receiveType}}</p>
            <p>提现账号：{{tableData.userBack&&tableData.userBack.receiveAccount}}</p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="submit1">提交</el-button>
            </div>
        </el-dialog>
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
                dialogFormVisible: false,//控制dialog显示
                dialogFormVisible1:false,
                form:{name:'',id:'',img:''},
                imageUrl: '',//临时图片地址,
                searValue:'',
                date:'',//选择时间
            }
        },
        mounted(){
            this.getList()
        },
        methods:{
            submit1(){
                request({
                    url: '/system/cashOut/save',
                    method: 'post',
                    data:{
                        outAmount:this.tableData.amount,
                        outStatus:0,
                        receiveAccount:this.tableData.userBack&&this.tableData.userBack.receiveAccount,
                        receiveType:this.tableData.userBack&&this.tableData.userBack.receiveType,
                        userId:this.$store.getters.id
                    }
                }).then((res) => {
                    console.log(res)
                    this.$message({
                    type: 'success',
                    message: res.message
                    })
                    this.dialogFormVisible1 = false
                })
            },
            withdraw(){
                this.dialogFormVisible1=true
            },
            getList(){
                let params={
                        // startDate:this.date?this.date[0]:' ',
                        // endDate:this.date?this.date[1]:' ',
                        pageNo:this.pageNo,
                        pageSize:this.pageSize,
                        key:this.searValue,
                        type:2
                    }
                    if(this.$store.getters.type!=0){
                        params.userId=this.$store.getters.id
                    }
                    if(this.date[0]&&this.date[1]){
                        params.startDate=this.date[0]
                        params.endDate=this.date[1]
                    }
                request({
                    url: '/system/orderDetail/list',
                    method: 'get',
                    params
                }).then((res)=>{
                    console.log(res)
                    this.tableData=res.data
                    this.total=res.count
                })
            },
            search(){
                this.pageNo=1
                this.getList()
                console.log(this.searValue)
            },
            //确认选择时间
            dateChange(){
                console.log(this.date)
            },
            //row
            look(row){//查看
                
            },
            handleClick(row,index) {
                console.log(row,index);
                if(index===2){//禁用
                    this.$confirm('此操作将禁用该会员, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            this.$message({
                                type: 'success',
                                message: '禁用成功!'
                            });
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消'
                        });          
                    });
                }else if(index==0){//设置会员
                    
                }else{//充值书币

                }
            },
             handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize=val
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.pageNo=val
            },
            //新增分类
            addClass(){
                this.dialogFormVisible=true
            },
            //提交新增分类
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
            margin-top:30px;
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