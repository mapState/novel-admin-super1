<template>
    <div class="main">
        <el-table
        :data="tableData"
        style="width: 100%">
            <el-table-column
                align="center"
                label="代理名称"
                prop="userBack.loginName"
                width="180">
                </el-table-column>
            <el-table-column
                align="center"
                prop="userBack.userName"
                label="联系人"
                width="180">
            </el-table-column>
            <el-table-column
                align="center"
               prop="userBack.userName"
                label="联系方式">
            </el-table-column>
            <el-table-column
                align="center"
                prop="outAmout"
                label="提现金额">
            </el-table-column>
            <el-table-column
                align="center"
                prop="receiveType"
                label="收款方式">
            </el-table-column>
            <el-table-column
                align="center"
                prop="receiveAccount"
                label="收款账号">
            </el-table-column>
            <el-table-column
                align="center"
                prop="createDate"
                label="提现时间">
            </el-table-column>
            <el-table-column
                v-if="type==0"
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row,0)" type="text" size="medium">通过</el-button>
                    <el-button @click="handleClick(scope.row,1)" type="text" size="medium">拒绝</el-button>
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
            :page-size="100"
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
                pageSize:10,
                type:''
            }
        },
        mounted(){
            this.type=this.$store.getters.type
            this.getList()
        },
        methods:{
             getList(){
                request({
                    url: '/system/cashOut/list',
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
                    method: 'post',
                    data:{
                        ids
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
            pass(outStatus,ids){
                request({
                    url: '/system/cashOut/sure',
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
                })
            },
            handleClick(row,index){
                if(index===0){//通过
                    this.$confirm('是否确认审核通过?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            this.pass(1,row.id)
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
                        this.delListItem(row.id)
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
        .pagination{
            float:right;
            margin-top:30px;
        }

    }
</style>