<template>
    <div class="main">
        <el-table
        :data="tableData"
        style="width: 100%">
            <el-table-column
                label="时间"
                align="center"
                prop="createDate"
                width="180">
                </el-table-column>
            <el-table-column
                align="center"
                prop="dayAmount"
                label="充值金额"
                width="180">
            </el-table-column>
            <el-table-column
                align="center"
                prop="dayCount"
                label="付费人数">
            </el-table-column>
            <el-table-column
                align="center"
                prop="payCount"
                label="付费笔数">
            </el-table-column>
            <el-table-column
                align="center"
                prop="newUser"
                label="新增用户数">
            </el-table-column>
            <el-table-column
                align="center"
                prop="newAmount"
                label="新用户充值金额">
            </el-table-column>
            <el-table-column
                align="center"
                prop="totalUser"
                label="累计用户数">
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
                pageSize:10,
                pageNo:1
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
                    params:{
                        pageNo:this.pageNo,
                        pageSize:this.pageSize
                    }
                    }).then((res)=>{
                        this.count=res.count
                        this.tableData=res.data
                        console.log(res.data)
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