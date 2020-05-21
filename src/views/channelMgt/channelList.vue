<template>
    <div class="main">
        <div class="searchBox">
            <el-button type="primary" @click="add">新增渠道</el-button>
            <el-button type="primary" class="fr sBtn" @click="searchBook">搜索</el-button>
            <el-input
                class='fr sInput'
                size="smail"
                placeholder="请输入渠道名称、手机号"
                v-model.trim="searValue"
                clearable>
            </el-input>
        </div>
            <el-table
            :data="tableData"
            style="width: 100%">
                <el-table-column
                    prop="id"
                    label="渠道编号"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="loginName"
                    label="渠道名称"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="userName"
                    label="联系人"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="联系方式"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="userImg"
                    label="身份证信息"
                    align="center"
                    width="180">
                    <template slot-scope="scope">
                        <a :href="scope.row.idAImage" target="_blank">
                            <img :src="$upLoadUrl + '/file/view/'+scope.row.idAImage" alt="" class="img"/>
                        </a>
                        <a :href="scope.row.idBImage" target="_blank">
                            <img :src="$upLoadUrl + '/file/view/'+ scope.row.idBImage" alt="" class="img"/>
                        </a>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="推广代理数"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="receivePercent"
                    label="分红"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="receiveType"
                    label="收款方式"
                    align="center"
                    width="100">
                </el-table-column> 
                 <el-table-column
                    prop="receiveAccount"
                    label="收款账号"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="提现记录">
                    <template slot-scope="scope">
                         <el-button @click="look(scope.row)" type="text" size="medium">查看</el-button>
                    </template>
                </el-table-column>
                 <el-table-column
                    prop="description"
                    label="备注"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row,0)" type="text" size="medium">编辑</el-button>
                        <el-button type="text" size="medium" @click="handleClick(scope.row,1)">重置密码</el-button>
                        <el-button type="text" size="medium" @click="handleClick(scope.row,2)">删除</el-button>
                        <el-button type="text" size="medium" @click="handleClick(scope.row,3)" v-if="scope.row.status==1">禁用</el-button>
                        <el-button type="text" size="medium" @click="handleClick(scope.row,4)" v-else>启用</el-button>
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
        <el-dialog title="新增/编辑渠道" :visible.sync="dialogFormVisible">
            <el-form :model="form" ref="addForm" label-suffix=":">
                <el-form-item label="渠道名称" 
                prop="loginName"
                :label-width="formLabelWidth">
                     <el-input v-model="form.loginName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系人" 
                prop="userName"
                :label-width="formLabelWidth">
                    <el-input v-model="form.userName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" 
                prop="phone"
                :label-width="formLabelWidth">
                     <el-input v-model="form.phone" autocomplete="off">
                     </el-input>
                </el-form-item>
                <el-form-item label="身份证(正反)" 
                :label-width="formLabelWidth">
                     <el-upload
                        class="avatar-uploader"
                        :action="$upLoadUrl+'/file/upload'"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess1"
                        :before-upload="beforeAvatarUpload1"
                    >
                        <img v-if="form.idAImage" :src="$upLoadUrl+'/file/view/'+form.idAImage" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </el-upload>
                    <el-upload
                        class="avatar-uploader"
                        :action="$upLoadUrl+'/file/upload'"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess2"
                        :before-upload="beforeAvatarUpload2"
                    >
                        <img v-if="form.idBImage" :src="$upLoadUrl+'/file/view/'+form.idBImage" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </el-upload>
                </el-form-item>
                <el-form-item label="收款方式" 
                prop="receiveType"
                :label-width="formLabelWidth">
                     <el-input v-model="form.receiveType" autocomplete="off">
                     </el-input>
                </el-form-item>
                <el-form-item label="收款账号" 
                prop="receiveAccount"
                :label-width="formLabelWidth">
                     <el-input v-model="form.receiveAccount" autocomplete="off">
                     </el-input>
                </el-form-item>
                <el-form-item label="分成比例" 
                prop="receivePercent"
                :label-width="formLabelWidth">
                     <el-input v-model="form.receivePercent" autocomplete="off">
                         <template slot="append">%</template>
                     </el-input>
                </el-form-item>
                <el-form-item label="备注" 
                prop="description"
                :label-width="formLabelWidth">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="form.description">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="提现记录" :visible.sync="dialogFormVisible1">
            <el-table
                :data="tableData1"
                style="width: 100%">
                    <el-table-column
                        align="center"
                        label="提现账号"
                        prop="id"
                        width="300">
                    </el-table-column>
                <el-table-column
                        align="center"
                        label="提现金额"
                        prop="outAmout"
                        width="200">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="提现时间"
                        prop="createDate"
                        width="260">
                    </el-table-column>
                </el-table>
                <div class="pagination1Box">
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
                pageNo1:1,
                pageSize1:10,
                total:0,
                total1:0,
                tableData: [],
                tableData1: [],
                currentPage:1,
                currentPage1:1,
                formLabelWidth: '120px',//labelwidth
                dialogFormVisible: false,//控制dialog显示
                dialogFormVisible1: false,//控制dialog显示
                searValue:'',
                setTopRadio:'是',
                fileList:[{
                    name:'',
                    url:''
                }],
                dialogImageUrl: '',
                dialogVisible: false,
                 dialogVisible1: false,
                checkboxGroup1: ['上海'],
                cities: ['上海', '北京', '广州', '深圳'],
                form:{
                    idAImage:'',
                    idBImage:'',
                    loginName:'',
                    userName:'',
                    phone:'',
                    receiveType:'',
                    receiveAccount:'',
                    receivePercent:'',
                    description:'',
                    type:1
                },
                xfId:''

            }
        },
        mounted(){
            this.getList()
        },
        methods:{
            //提现记录
            getList1(userId){
                request({
                    url: '/system/cashOut/list',
                    method: 'get',
                    params:{
                        pageNo:this.pageNo1,
                        pageSize:this.pageSize1,
                        userId:this.xfId,
                        type:1//渠道
                    }
                }).then((res)=>{
                    console.log(res)
                    this.tableData1=res.data
                    this.total1=res.count
                    this.dialogFormVisible1=true
                })
            },
            getList(){
                request({
                    url: '/system/back/list',
                    method: 'get',
                    params:{
                        pageNo:this.pageNo,
                        pageSize:this.pageSize,
                        type:1
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
                this.xfId=row.id
                this.getList1()
            },
            delItem(userId){
                request({
                    url: '/system/back/remove',
                    method: 'get',
                    params:{
                        userId
                    }
                }).then((res)=>{
                    console.log(res)
                    this.$message({
                        type: 'success',
                        message: res.message
                    });
                    this.pageNo=1
                    this.getList()
                })
            },
            disableItem(userId){
                 request({
                    url: '/system/back/pass',
                    method: 'get',
                    params:{
                        userId
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
            resetPassword(userId){
                 request({
                    url: '/system/back/reset',
                    method: 'get',
                    params:{
                        userId
                    }
                }).then((res)=>{
                    console.log(res)
                    this.$message({
                        type: 'success',
                        message: res.message
                    });
                })
            },
            handleClick(row,index) {
                console.log(row,index);
                if(index===2){//删除
                    this.$confirm('此操作将删除该渠道, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            this.delItem(row.id)
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消'
                        });          
                    });
                }else if(index==0){//编辑
                    this.form={...row}
                    this.form.type-=0
                    this.dialogFormVisible=true
                }else if(index==1){//充值密码
                    this.resetPassword(row.id)
                }else if(index==3){//禁用
                    this.$confirm('此操作将禁用该渠道, 是否继续?', '提示', {
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
                }else if(index==4){//启用
                   this.disableItem(row.id) 
                }
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
             handleSizeChange1(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize1=val
                this.getList1()
            },
            handleCurrentChange1(val) {
                console.log(`当前页: ${val}`);
                this.pageNo1=val
                this.getList1()
            },
            //新增小说
            add(){
                this.dialogFormVisible=true
            },
            save(){
                request({
                    url: '/system/back/save',
                    method: 'post',
                    data:this.form
                }).then((res)=>{
                    console.log(res)
                    this.dialogFormVisible=false
                    this.$message({
                        type: 'success',
                        message: res.message
                    });
                    this.pageNo=1
                    this.getList()
                })
            },
            //提交新增分类
            submit(){
                //校验
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                       this.save()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
             // 上传图片
            handleAvatarSuccess1(res, file) {
            this.form.idAImage =  res.data
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
             // 上传图片
            handleAvatarSuccess2(res, file) {
            this.form.idBImage = res.data
            },
            beforeAvatarUpload2(file){
           
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
        .pagination1Box{
            width:100%;
            display: flex;
            flex-direction: row-reverse;
            margin-top:20px;
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