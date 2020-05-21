<template>
    <div class="main">
        <el-button type="primary" class="add" @click="addClass">新增分类</el-button>
            <el-table
            :data="tableData"
            style="width: 100%">
                <el-table-column
                    prop="name"
                    label="分类名称"
                    align="center"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="orderNum"
                    label="编号"
                    align="center"
                    width="500">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
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
        <el-dialog title="新增/编辑分类" :visible.sync="dialogFormVisible" @close="closeForm">
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
                prop="orderNum"
                :rules="{
                    required: true, message: '编号不能为空', trigger: 'change'
                }"
                :label-width="formLabelWidth">
                    <el-input v-model="form.orderNum" autocomplete="off"></el-input>
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
                tableData: [],
                total:0,
                currentPage:1,
                formLabelWidth: '120px',//labelwidth
                dialogFormVisible: false,//控制dialog显示
                form:{name:'',orderNum:'',type:1}
            }
        },
        mounted(){
            this.getList()
        },
        methods:{
             getList(){
                request({
                    url: '/system/dict/list',
                    method: 'get',
                    params:{
                        pageNo:this.pageNo,
                        pageSize:this.pageSize,
                        type:1
                    }
                    }).then((res)=>{
                        this.total=res.count
                        this.tableData=res.data
                        console.log(res.data)
                })
            },
            delItem(ids){
                request({
                    url: '/system/dict/delete',
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
                }else{//编辑
                    this.form={...row}
                    this.dialogFormVisible=true
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
                this.dialogFormVisible=true
            },
            closeForm(){
                this.form={name:'',orderNum:'',type:1}
                this.$refs['addForm'].resetFields()
            },
            //提交新增分类
            submit(){
                //校验
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        request({
                            url: '/system/dict/save',
                            method: 'post',
                            data:this.form
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
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
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
    }
</style>