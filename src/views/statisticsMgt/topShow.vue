<template>
    <div class="main">
        <el-table
        :data="tableData"
        style="width: 100%">
            <el-table-column
                align="center"
                label="小说标题"
                prop="book.bookName"
                width="300">
                </el-table-column>
            <el-table-column
                align="center"
                prop="bbCount"
                label="消费书币"
                width="300">
            </el-table-column>
            <el-table-column
                align="center"
                label="消费人数"
                prop="id"
                width="300">
                </el-table-column>
            <el-table-column
                align="center"
                type="index"
                label="排名"
                width="400">
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
                pageSize:10
            }
        },
        mounted(){
            this.getList()
        },
        methods:{
            submit(){

            },
            handleChange(value){
                console.log(value);
            },
             getList(){
                request({
                    url: '/system/dayData/bookList',
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
            //删除提现列表
            delListItem(ids){
                request({
                    url: '/system/cashOut/delete',
                    method: 'POST',
                    data:{
                        ids
                    }
                }).then((res)=>{
                    console.log(res)
                })
            },
            handleClick(row,index){
                if(index===0){//通过
                    this.$confirm('是否确认审核通过?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                        this.$message({
                            type: 'success',
                            message: '审核通过!'
                        });
                        }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });          
                    });
                }else{//拒绝
                this.$confirm('是否拒绝该审核?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                        this.$message({
                            type: 'success',
                            message: '已拒绝!'
                        });
                        }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });          
                    });
                }
            }
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

    }
</style>