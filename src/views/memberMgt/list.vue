<template>
    <div class="main">
        <div class="searchBox">
            <el-button type="primary" class="fr sBtn" @click="searchBook">搜索</el-button>
            <el-input
                class='fr sInput'
                size="smail"
                placeholder="请输入小说名称"
                v-model.trim="searValue"
                clearable>
            </el-input>
        </div>
            <el-table
            :data="tableData"
            style="width: 100%">
                <el-table-column
                    prop="id"
                    label="会员编号"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="userImg"
                    label="头像"
                    align="center"
                    width="120">
                    <template slot-scope="scope">
                        <a :href="scope.row.userImg" target="_blank">
                            <img :src="scope.row.userImg" alt="" class="img"/>
                        </a>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="手机号"
                    align="center"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="money"
                    label="书币余额"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="a"
                    label="会员等级"
                    align="center"
                    width="100">
                </el-table-column> 
                 <el-table-column
                    prop="createUserId"
                    label="上级代理"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="region"
                    label="归属渠道"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="消费记录">
                    <template slot-scope="scope">
                         <el-button @click="look(scope.row)" type="text" size="medium">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row,0)" type="text" size="medium">设置会员</el-button>
                        <el-button type="text" size="medium" @click="handleClick(scope.row,1)">充值书币</el-button>
                        <el-button type="text" size="medium" @click="handleClick(scope.row,2)" v-if="type==0&&scope.row.status==0">启用</el-button>
                        <el-button type="text" size="medium" @click="handleClick(scope.row,2)" v-if="type==0&&scope.row.status">禁用</el-button>
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
        <el-dialog title="充值书币" :visible.sync="dialogFormVisible">
            <el-form :model="form" ref="addForm">
                <el-form-item label="当前书币" 
                prop="money"
                :label-width="formLabelWidth">
                    <el-input v-model.number="form.money" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">提交</el-button>
            </div>
        </el-dialog>
        <!-- 弹框 -->
        <el-dialog title="设置会员" :visible.sync="dialogFormVisible1">
            <div class="memberItem" v-for="item in memberList" :key="item.id" :class="{selClass:billId===item.id}" @click="selBid(item.id)">
                    <div class="name">{{item.name}}</div>
                    <div class="detali">
                        <span>权益描述:</span>
                        <span>{{item.description}}</span>
                    </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="submit1">提交</el-button>
            </div>
        </el-dialog>
        <!-- 弹框 -->
        <el-dialog title="消费记录" :visible.sync="dialogFormVisible2">
            <el-table
                :data="tableData1"
                style="width: 100%">
                    <el-table-column
                        align="center"
                        label="事项名称"
                        prop="bookId"
                        width="300">
                    </el-table-column>
                <el-table-column
                        align="center"
                        label="消费金额"
                        prop="bbCount"
                        width="200">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="消费时间"
                        prop="createDate"
                        width="260">
                    </el-table-column>
                </el-table>
                <el-pagination
                    class="pagination1"
                    background
                    @size-change="handleSizeChange1"
                    @current-change="handleCurrentChange1"
                    :current-page="currentPage1"
                    :page-sizes="[10, 20, 40, 100]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total1">
                </el-pagination>
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
                pageNo1:1,
                pageSize1:10,
                total:0,
                total1:0,
                tableData: [],
                tableData1:[],//消费记录
                currentPage:1,
                currentPage1:1,
                formLabelWidth: '120px',//labelwidth
                dialogFormVisible: false,//控制dialog显示
                dialogFormVisible1: false,//控制dialog显示
                dialogFormVisible2:false,
                imageUrl: '',//临时图片地址,
                searValue:'',
                form:{
                    money:'',
                    userId:''
                },
                memberList:[],
                billId:1,//会员套餐id
                userId:'',
                type:''
            }
        },
        mounted(){
            this.type=this.$store.getters.type
            this.getList()
            this.getBill()
        },
        methods:{
            selBid(id){
                this.billId=id
            },
            submit1(){
                 request({
                    url: '/system/user/setVIP',
                    method: 'post',
                    data:{
                        billId:this.billId,
                        userId:this.userId
                    }
                }).then((res)=>{
                    console.log(res)
                     this.$message({
                    type: 'success',
                    message: res.message
                    })
                    this.dialogFormVisible1=false
                    this.pageNo=1
                    this.getList()
                })
            },
            getBill(){
                request({
                    url: '/system/billMenu/list',
                    method: 'get',
                    params:{
                        billType:1
                    }
                }).then((res)=>{
                    console.log(res)
                    this.memberList=res.data
                })
            },
            //消费记录
            getList1(userId){
                request({
                    url: '/system/bbOrder/list',
                    method: 'get',
                    params:{
                        pageNo:this.pageNo1,
                        pageSize:this.pageSize1,
                        userId,
                        type:3//消费
                    }
                }).then((res)=>{
                    console.log(res)
                    this.tableData1=res.data
                    this.total1=res.count
                    this.dialogFormVisible2=true
                })
            },
            getList(){
                request({
                    url: '/system/user/list',
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
            },
            //row
            look(row){//查看
                // this.$router.push({path:'/memberMgt/record',query:{userId:row.id}});
                this.getList1(row.id)
            },
            disableItem(ids){
                request({
                    url: '/system/user/delete',
                    method: 'post',
                    data:{
                        ids
                    }
                }).then((res)=>{
                    console.log(res)
                     this.$message({
                    type: 'success',
                    message: res.message
                    })
                    this.pageNo=1
                    this.getList()
                })
            },
            handleClick(row,index) {
                console.log(row,index);
                if(index===2){//禁用
                    this.$confirm('此操作将禁用该会员, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            this.disableItem(row.id)
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消'
                        });          
                    });
                }else if(index==0){//设置会员
                    this.userId=row.id
                    this.dialogFormVisible1=true
                }else{//充值书币
                    this.form.money=row.money
                    this.form.userId=row.id
                    this.dialogFormVisible=true
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
             handleSizeChange1(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize1=val
            },
            handleCurrentChange1(val) {
                console.log(`当前页: ${val}`);
                this.pageNo1=val
            },
            //新增分类
            addClass(){
                this.dialogFormVisible=true
            },
            //充值
            submit(){
                request({
                    url: '/system/user/addBB',
                    method: 'post',
                    data:this.form
                }).then((res)=>{
                    console.log(res)
                     this.$message({
                    type: 'success',
                    message: res.message
                    })
                    this.dialogFormVisible=false
                    this.pageNo=1
                    this.getList()
                })
            },
            // //上传图片
            // handleAvatarSuccess(res, file) {
            //     this.imageUrl = URL.createObjectURL(file.raw);
            //     console.log(file)
            //     this.form.img=this.imageUrl
            // },
            // beforeAvatarUpload(file) {
            //     const isJPG = file.type === 'image/jpeg';
            //     const isLt2M = file.size / 1024 / 1024 < 2;

            //     if (!isJPG) {
            //     this.$message.error('上传头像图片只能是 JPG 格式!');
            //     }
            //     if (!isLt2M) {
            //     this.$message.error('上传头像图片大小不能超过 2MB!');
            //     }
            //     return isJPG && isLt2M;
            // }
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
        .pagination1{
           
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
        .memberItem{
            padding:20px;
            box-sizing: border-box;
            border:1px solid #ddd;
            margin-bottom:20px;
            .name{
                color:#000;
                font-weight: bold;
                margin-bottom:20px;
            }
            .detail{
                display: flex;
                color: #eee;
                font-weight: bold;
            }
            &.selClass{
                border-color: red;
            }
        }
    }
</style>