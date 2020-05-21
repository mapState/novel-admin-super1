<template>
    <div class="main">
     <h3>新增用户</h3>
        <el-row :gutter="20" style="margin-bottom:20px;">
          <el-col :span="6">
            <el-card>
              <div class="card">
                <img src="https://hbimg.huabanimg.com/43fae7ad563ed61814c76bbe1cc373e7ff61000e2cd1f-DC5YBB_fw658" alt="" class="cardImg">
                <div class="cardText">
                  <span class="num">{{list.today}}</span>
                  <span class="title">今日新增</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card>
              <div class="card">
                <img src="https://hbimg.huabanimg.com/43fae7ad563ed61814c76bbe1cc373e7ff61000e2cd1f-DC5YBB_fw658" alt="" class="cardImg">
                <div class="cardText">
                  <span class="num">{{list.yesterday}}</span>
                  <span class="title">昨日新增</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card>
              <div class="card">
                <img src="https://hbimg.huabanimg.com/43fae7ad563ed61814c76bbe1cc373e7ff61000e2cd1f-DC5YBB_fw658" alt="" class="cardImg">
                <div class="cardText">
                  <span class="num">{{list.month}}</span>
                  <span class="title">本月新增</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <h3>订单金额</h3>
        <el-row :gutter="20" style="margin-bottom:20px;">
          <el-col :span="6">
            <el-card>
              <div class="card">
                <img src="https://hbimg.huabanimg.com/43fae7ad563ed61814c76bbe1cc373e7ff61000e2cd1f-DC5YBB_fw658" alt="" class="cardImg">
                <div class="cardText">
                  <span class="num">{{list.month}}</span>
                  <span class="title">今日收入</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card>
              <div class="card">
                <img src="https://hbimg.huabanimg.com/43fae7ad563ed61814c76bbe1cc373e7ff61000e2cd1f-DC5YBB_fw658" alt="" class="cardImg">
                <div class="cardText">
                  <span class="num">{{list.month}}</span>
                  <span class="title">昨日收入</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card>
              <div class="card">
                <img src="https://hbimg.huabanimg.com/43fae7ad563ed61814c76bbe1cc373e7ff61000e2cd1f-DC5YBB_fw658" alt="" class="cardImg">
                <div class="cardText">
                  <span class="num">{{list.month}}</span>
                  <span class="title">本月收入</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
    </div>
</template>
<script>
import request from '@/utils/request'
  export default {
    data() {
      return {
        list:{}
      }
    },
    mounted(){
      this.getData()
    },
    methods: {
      getData(){
        request({
          url: '/system/dayData/showData',
          method: 'get'
        }).then((res)=>{
            console.log(res)
            this.list=res.data
        })
      }
    }
  }
</script>
<style lang="scss" scoped> 
    .main{
      padding:30px;
      .card{
        width:100%;
        display: flex;
        align-items: center;
        .cardImg{
          width:80px;
          height:80px;
          border-radius: 50%;
        }
        .cardText{
          margin-left: 10px;
          flex:1;
          height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .num{
            margin-bottom:10px;
          }
        }
        
      }
    }
</style>