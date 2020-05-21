<template>
    <div class="main">
        <div class="searchBox">
            <el-button type="primary" class="add" @click="add">新增代理</el-button>
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
                    label="代理编号"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="loginName"
                    label="代理名称"
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
                    label="身份证信息"
                    align="center"
                    width="200">
                    <template slot-scope="scope">
                        <a :href="scope.row.idAImage" target="_blank">
                            <img :src="$upLoadUrl + '/file/view/'+scope.row.idAImage" alt="" class="img"/>
                        </a>
                        <a :href="scope.row.idBImage" target="_blank">
                            <img :src="$upLoadUrl + '/file/view/'+scope.row.idBImage" alt="" class="img"/>
                        </a>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="推广用户数"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="createUserId"
                    label="上级渠道"
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
                    prop="description"
                    label="注册推广链接"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    width="140"
                    fixed="right"
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row,0)" type="text" size="medium">编辑</el-button>
                        <el-button type="text" size="medium" @click="handleClick(scope.row,1)">重置密码</el-button>
                        <el-button type="text" size="medium" @click="handleClick(scope.row,2)">删除</el-button>
                        <el-button type="text" size="medium" @click="handleClick(scope.row,3)">禁用</el-button>
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
        <el-dialog title="新增/编辑代理" :visible.sync="dialogFormVisible">
            <el-form :model="form" ref="addForm">
                <el-form-item label="代理名称" 
                prop="loginName"
                :rules="{
                    required: true, message: '分类名称不能为空', trigger: 'change'
                }"
                :label-width="formLabelWidth">
                     <el-input v-model="form.loginName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系人" 
                prop="userName"
                :rules="{
                    required: true, message: '联系人不能为空', trigger: 'change'
                }"
                :label-width="formLabelWidth">
                    <el-input v-model="form.userName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" 
                prop="phone"
                :rules="{
                    required: true, message: '联系方式不能为空', trigger: 'change'
                }"
                :label-width="formLabelWidth">
                    <el-input v-model="form.phone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="身份证信息" 
                :label-width="formLabelWidth">
                  <el-upload
                        class="avatar-uploader"
                        :action="$upLoadUrl+'/file/upload'"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess1"
                        :before-upload="beforeAvatarUpload1"
                    >
                        <img v-if="form.idAImage" :src="$upLoadUrl + '/file/view/'+form.idAImage" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </el-upload>
                    <el-upload
                        class="avatar-uploader"
                        :action="$upLoadUrl+'/file/upload'"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess2"
                        :before-upload="beforeAvatarUpload2"
                    >
                        <img v-if="form.idBImage" :src="form.idBImage" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </el-upload>
                </el-form-item>
                <el-form-item label="上级渠道" 
                prop="createUserId"
                :label-width="formLabelWidth">
                    <el-select v-model="form.createUserId" placeholder="请选择">
                        <el-option
                        v-for="item in qdList"
                        :key="item.id"
                        :label="item.userName"
                        :value="item.createUserId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收款方式" 
                prop="receiveType"
                :rules="{
                    required: true, message: '分类名称不能为空', trigger: 'change'
                }"
                :label-width="formLabelWidth">
                     <el-input v-model="form.receiveType" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="收款账号" 
                prop="receiveAccount"
                :rules="{
                    required: true, message: '收款账号不能为空', trigger: 'change'
                }"
                :label-width="formLabelWidth">
                    <el-input v-model="form.receiveAccount" autocomplete="off"></el-input>
                </el-form-item>
                 <el-form-item label="分成比例" 
                prop="receivePercent"
                :rules="{
                    required: true, message: '分类名称不能为空', trigger: 'change'
                }"
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
                :data="recordList"
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
import { mapGetters } from 'vuex'
import request from '@/utils/request'
    export default {
        ...mapGetters([
      'id',
      'type'
    ]),
        data(){
            return{
                pageNo:1,
                pageSize:10,
                pageNo1:1,
                pageSize1:10,
                total:0,
                total1:0,
                tableData: [],
                currentPage:1,
                currentPage1:1,
                value: '',
                currentPage:1,
                formLabelWidth: '120px',//labelwidth
                dialogFormVisible: false,//控制dialog显示
                dialogFormVisible1:false,
                imageUrl: '',//临时图片地址,
                searValue:'',
                date:'',
                form:{
                    idAImage:'',
                    idBImage:'',
                    loginName:'',
                    password:'',
                    receiveType:'',
                    receiveAccount:'',
                    receivePercent:'',
                    userName:'',
                    createUserId:'',
                    type:2
                },
                qdList:[],
                recordId:'',
                recordList:[]
            }
        },
        mounted(){
            this.getList()
            this.getQd()
        },
        methods:{
            getRecordList(){
                request({
                    url: '/system/cashOut/list',
                    method: 'get',
                    params:{
                        pageNo:this.pageNo1,
                        pageSize:this.pageSize1,
                        type:2//代理
                    }
                }).then((res)=>{
                    console.log(res)
                    this.recordList=res.data
                    this.dialogFormVisible1=true
                    
                })   
            },
            getQd(){
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
                    this.qdList=res.data
                    
                })
            },
            getList(){
                request({
                    url: '/system/back/list',
                    method: 'get',
                    params:{
                        pageNo:this.pageNo,
                        pageSize:this.pageSize,
                        type:2,//1渠道 2代理 0管理
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
                this.recordId=row.id
                this.getRecordList()
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
                    })
                    this.pageNo=1
                    this.getList()
                })
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
                    })
                    this.pageNo=1
                    this.getList()
                })
            },
            reset(userId){
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
                    })
                    this.pageNo=1
                    this.getList()
                })
            },
            handleClick(row,index) {
                console.log(row,index);
                if(index===1){//重置密码
                    this.$confirm('此操作将重置密码, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                          this.reset(row.id)  
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消'
                        });          
                    });
                }else if(index==0){//编辑
                    this.form={...row}
                    this.dialogFormVisible=true
                }else if(index===2){//del
                    this.$confirm('此操作将删除, 是否继续?', '提示', {
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
                }else if(index==3){//禁用
                    this.$confirm('此操作将禁用该代理, 是否继续?', '提示', {
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
                this.getRecordList()
            },
            handleCurrentChange1(val) {
                console.log(`当前页: ${val}`);
                this.pageNo1=val
                this.getRecordList()
            },
            //新增分类
            add(){
                this.dialogFormVisible=true
            },
            //提交新增分类
            submit(){
                //校验
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        request({
                            url: '/system/back/save',
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
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 上传图片
            handleAvatarSuccess1(res, file) {
            this.form.idAImage = res.data
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
            this.form.idBImage =  res.data
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
        .img{
            width:50px;
            height:50px;
        }
        .avatar-uploader{
            width:178px;
            height: 178px;
            display: inline-block;
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
        .pagination1Box{
            width:100%;
            display: flex;
            flex-direction: row-reverse;
            margin-top:20px;
        }
    }
</style>