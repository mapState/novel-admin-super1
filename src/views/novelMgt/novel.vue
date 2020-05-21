<template>
    <div class="main">
        <div class="btnBox">
            <el-button type="primary" class="add" @click="addNovel">新增小说</el-button>
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
                    prop="id"
                    label="编号"
                    align="center"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="bookName"
                    label="书名"
                    align="center"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="bookImage"
                    label="封面图"
                    align="center"
                    width="100">
                    <template slot-scope="scope">
                        <a :href="$upLoadUrl+'/file/view/'+scope.row.bookImage" target="_blank">
                            <img :src="$upLoadUrl+'/file/view/'+scope.row.bookImage" alt="" class="img"/>
                        </a>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="bookAuthor"
                    label="作者"
                    align="center"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="bookIntroduce"
                    label="简介"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="freeRead"
                    label="章节"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="类型"
                    align="center"
                    width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.type==1?'完结':'连载'}}</span>
                    </template>
                </el-table-column>  
                <el-table-column
                    label="分类"
                    align="center"
                    width="100">
                    <template slot-scope="scope">
                       <span v-for="item in scope.row.list" :key="item.id">
                           <span v-if="item.type===1">{{item.name}}</span>
                       </span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="频道"
                    align="center"
                    width="100">
                    <template slot-scope="scope">
                       <span v-for="item in scope.row.list" :key="item.id">
                           <span v-if="item.type===2">{{item.name}}</span>
                       </span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="bookAmount"
                    label="价格"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="freeRead"
                    label="试读章节"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="setTop"
                    label="首页置顶"
                    align="center"
                    width="120">
                    <template slot-scope="scope">
                        <el-radio-group v-model="scope.row.setTop" size="small" @change="setTopChange(scope.row.id,$event)">
                            <el-radio-button :label="1">是</el-radio-button>
                            <el-radio-button :label="0">否</el-radio-button>
                        </el-radio-group>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="amwaySex"
                    label="性别推荐"
                    align="center"
                    width="100">
                    <template slot-scope="scope">
                       <span>{{scope.row.amwaySex==1?'男':'女'}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    align="center"
                    width="180"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row,3)" type="text" size="medium">新增章节</el-button>
                        <el-button @click="handleClick(scope.row,0)" type="text" size="medium">删除</el-button>
                        <el-button type="text" size="medium" @click="handleClick(scope.row,1)">编辑</el-button>
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
        <el-dialog title="新增书籍" :visible.sync="dialogFormVisible" @close="diaClose">
            <el-form :model="form" ref="addForm" label-suffix=":">
                <el-form-item label="书名" 
                prop="bookName"
                :label-width="formLabelWidth">
                     <el-input v-model="form.bookName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="封面图" 
                prop="bookImage"
                :label-width="formLabelWidth">
                     <el-upload
                        class="avatar-uploader"
                        :action="$upLoadUrl+'/file/upload'"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                    >
                        <img v-if="form.bookImage" :src="$upLoadUrl+'/file/view/'+form.bookImage" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </el-upload>
                </el-form-item>
                <el-form-item label="作者" 
                prop="bookAuthor"
                :label-width="formLabelWidth">
                    <el-input v-model="form.bookAuthor" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型" 
                prop="type"
                :label-width="formLabelWidth">
                    <el-radio-group v-model="form.type">
                        <el-radio-button :label="1">完结</el-radio-button>
                        <el-radio-button :label="2">连载</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="分类" 
                prop="dictIds"
                :label-width="formLabelWidth">
                    <el-checkbox-group v-model="dictIds1">
                        <el-checkbox-button v-for="city in classList" :label="city.id" :key="city.id">{{city.name}}</el-checkbox-button>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="频道" 
                prop="dictIds"
                :label-width="formLabelWidth">
                    <el-checkbox-group v-model="dictIds2">
                        <el-checkbox-button v-for="city in pdList" :label="city.id" :key="city.id">{{city.name}}</el-checkbox-button>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="价格" 
                prop="bookAmount"
                :label-width="formLabelWidth">
                     <el-input v-model.number="form.bookAmount" autocomplete="off">
                         <!-- <template slot="append">元</template> -->
                     </el-input>
                </el-form-item>
                <el-form-item label="试读章节" 
                prop="freeRead"
                :label-width="formLabelWidth">
                     前 <el-input-number v-model="form.freeRead" :min="1"></el-input-number> 章
                </el-form-item>
                <el-form-item label="性别推荐" 
                prop="amwaySex"
                :label-width="formLabelWidth">
                    <el-radio-group v-model="form.amwaySex">
                        <el-radio-button :label="0">女</el-radio-button>
                        <el-radio-button :label="1">男</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="首页置顶" 
                prop="setTop"
                :label-width="formLabelWidth">
                    <el-radio-group v-model="form.setTop">
                        <el-radio-button :label="0">否</el-radio-button>
                        <el-radio-button :label="1">是</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="简介" 
                prop="bookIntroduce"
                :label-width="formLabelWidth">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入简介"
                        v-model="form.bookIntroduce">
                        </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import request from '@/utils/request'
    export default {
        data(){
            return{
                total:0,
                tableData: [],
                currentPage:1,
                formLabelWidth: '120px',//labelwidth
                dialogFormVisible: false,//控制dialog显示
                dialogFormVisible1:false,
                setTopRadio:'是',
                fileList:[],
                dialogImageUrl: '',
                dialogVisible: false,
                pdList:[],//频道列表
                classList:[],//分类列表
                form:{
                    bookName:'',
                    bookImage:'',
                    bookAuthor:'',
                    type:1,
                    freeRead:1,
                    amwaySex:0,
                    setTop:0,
                    bookIntroduce:'',
                    dictIds:'',
                    bookAmount:''
                },
                dictIds1:[],
                dictIds2:[],
            }
        },
        mounted(){
            this.getList()
            this.getClass()
            this.getPd()
        },
        methods:{
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
                    this.dialogFormVisible1=false
                })
            },
            setTopChange(id,e){
                console.log(e)
                 request({
                    url: '/system/book/save',
                    method: 'post',
                    data: {
                        id,
                        setTop:e
                    }
                }).then((res) => {
                    console.log(res)
                    this.$message({
                    type: 'success',
                    message: res.message
                    })
                })
            },
            getClass(){
                request({
                    url: '/system/dict/list',
                    method: 'get',
                    params:{
                        pageNo:this.pageNo,
                        pageSize:this.pageSize,
                        type:1
                    }
                    }).then((res)=>{
                       this.classList=res.data
                       console.log(res)
                })
            },
            getPd(){
                request({
                    url: '/system/dict/list',
                    method: 'get',
                    params:{
                        pageNo:this.pageNo,
                        pageSize:this.pageSize,
                        type:2
                    }
                    }).then((res)=>{
                         this.pdList=res.data
                          console.log(res)
                })
            },
             getList(){
                request({
                    url: '/system/book/list',
                    method: 'get',
                    params:{
                        pageNo:this.pageNo,
                        pageSize:this.pageSize
                    }
                    }).then((res)=>{
                        this.total=res.count
                        this.tableData=res.data
                        console.log(res.data)
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
            diaClose(){
                this.form={
                    bookName:'',
                    bookImage:'',
                    bookAuthor:'',
                    type:1,
                    freeRead:1,
                    amwaySex:0,
                    setTop:0,
                    bookIntroduce:'',
                    dictIds:''
                }
                this.$refs['addForm'].resetFields()
            },
            diaClose1(){
                this.charterForm={
                    orderNum:'',
                    chapterName:'',
                    isFree:0,
                    chapterUrl:'',
                    id:''
                }
                this.$refs['charterForm'].resetFields()
            },
            //row
            handleClick(row,index) {
                console.log(row,index);
                if(index===0){//删除
                    this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
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
                }else if(index==1){//编辑
                    this.form={...row}
                    if(this.form.list&&this.form.list.length>0){
                        this.form.list.forEach(item => {
                            if(item.type==1){
                                this.dictIds1.push(item.id)
                            }else if(item.type==2){
                                this.dictIds2.push(item.id)
                            }
                        });
                    }
                    delete this.form.list
                    this.dialogFormVisible=true
                }else{//新增章节
                   this.$router.push({path:'/novelMgt/chapterList',query:{bookId:row.id}});
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
            //新增小说
            addNovel(){
                this.dialogFormVisible=true
            },
            import1(){
                
            },
            save(){
                 request({
                    url: '/system/book/save',
                    method: 'post',
                    data: this.form
                }).then((res) => {
                    console.log(res)
                    this.$message({
                    type: 'success',
                    message: res.message
                    })
                    this.dialogFormVisible=false
                    this.pageNo = 1
                    this.getList()
                })
            },
            //提交新增分类
            submit(){
                //校验
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.form.dictIds=[...this.dictIds1,...this.dictIds2].join(',')                   
                        this.save()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //批量上传
            handleChange1(file, fileList) {
                this.fileList = fileList;
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleAvatarSuccess(res, file) {
                this.form.bookImage = res.data
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
            },
             handleAvatarSuccess1(res, file) {
                let zipUrl = res.data
                let zipName=file.name.split('.')[0]
                let type=1
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
            margin-right: 30px;
        }
        .pagination{
            float:right;
            margin-top:30px;
        }
        .btnBox{
            display: flex;
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
    }
</style>