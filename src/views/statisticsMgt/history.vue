<template>
    <div class="main">
        <div class="searchBox">
            <el-date-picker
            @change="dateChange"
                v-model="date"
                format='yyyy-MM-dd'
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
        </div>
            <el-table
            :data="tableData"
            style="width: 100%">
                <el-table-column
                    prop="createDate"
                    label="日期"
                    align="center"
                    width="400">
                </el-table-column>
                <el-table-column
                    prop="newAmount"
                    label="订单金额"
                    align="center"
                    width="300">
                </el-table-column>
                <el-table-column
                    prop="payCount"
                    label="订单数量"
                    align="center"
                    width="300">
                </el-table-column>
                 <el-table-column
                    prop="totalUser"
                    label="新增用户数"
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
            getList(){
                request({
                    url: '/system/dayData/list',
                    method: 'get',
                    // params:{
                    //     startDate:this.date?this.date[0]:'',
                    //     endDate:this.date?this.date[1]:'',
                    //     pageNo:this.pageNo,
                    //     pageSize:this.pageSize,
                    //     type:1,//1渠道 2代理
                    // }
                }).then((res)=>{
                    console.log(res)
                    this.tableData=res.data
                    this.total=res.count
                })
            },
            //确认选择时间
            dateChange(){
                console.log(this.date)
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