<template>
    <div class="main">
     <h3>数据展示</h3>
        <el-row :gutter="20" style="margin-bottom:20px;">
          <el-col :span="6">
            <el-card>
              <div class="card">
                <img src="https://hbimg.huabanimg.com/43fae7ad563ed61814c76bbe1cc373e7ff61000e2cd1f-DC5YBB_fw658" alt="" class="cardImg">
                <div class="cardText">
                  <span class="num">{{list.today}}</span>
                  <span class="title">今日充值</span>
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
                  <span class="title">昨日充值</span>
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
                  <span class="title">本月充值</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card>
              <div class="card">
                <img src="https://hbimg.huabanimg.com/43fae7ad563ed61814c76bbe1cc373e7ff61000e2cd1f-DC5YBB_fw658" alt="" class="cardImg">
                <div class="cardText">
                  <span class="num">{{list.lastMonth}}</span>
                  <span class="title">上月充值</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom:20px;">
          <el-col :span="6">
            <el-card>
              <div class="card">
                <img src="https://hbimg.huabanimg.com/43fae7ad563ed61814c76bbe1cc373e7ff61000e2cd1f-DC5YBB_fw658" alt="" class="cardImg">
                <div class="cardText">
                  <span class="num">{{list.channel}}</span>
                  <span class="title">渠道余额</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card>
              <div class="card">
                <img src="https://hbimg.huabanimg.com/43fae7ad563ed61814c76bbe1cc373e7ff61000e2cd1f-DC5YBB_fw658" alt="" class="cardImg">
                <div class="cardText">
                  <span class="num">{{list.agent}}</span>
                  <span class="title">代理余额</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card>
              <div class="card">
                <img src="https://hbimg.huabanimg.com/43fae7ad563ed61814c76bbe1cc373e7ff61000e2cd1f-DC5YBB_fw658" alt="" class="cardImg">
                <div class="cardText">
                  <span class="num">{{list.cashOut}}</span>
                  <span class="title">已提现总额</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <h3>历史统计</h3>
        <el-row :gutter="20" style="margin-bottom:20px;">
          <el-col :span="6">
            <el-card>
              <div class="card">
                <img src="https://hbimg.huabanimg.com/43fae7ad563ed61814c76bbe1cc373e7ff61000e2cd1f-DC5YBB_fw658" alt="" class="cardImg">
                <div class="cardText">
                  <span class="num">{{list.user}}</span>
                  <span class="title">累计用户数</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card>
              <div class="card">
                <img src="https://hbimg.huabanimg.com/43fae7ad563ed61814c76bbe1cc373e7ff61000e2cd1f-DC5YBB_fw658" alt="" class="cardImg">
                <div class="cardText">
                  <span class="num">{{list.money}}</span>
                  <span class="title">累计金额</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card>
              <div class="card">
                <img src="https://hbimg.huabanimg.com/43fae7ad563ed61814c76bbe1cc373e7ff61000e2cd1f-DC5YBB_fw658" alt="" class="cardImg">
                <div class="cardText">
                  <span class="num">{{list.order}}</span>
                  <span class="title">累计订单数</span>
                </div>
              </div>
            </el-card>
          </el-col>
           <el-col :span="6">
            <el-card>
              <div class="card">
                <img src="https://hbimg.huabanimg.com/43fae7ad563ed61814c76bbe1cc373e7ff61000e2cd1f-DC5YBB_fw658" alt="" class="cardImg">
                <div class="cardText">
                  <span class="num">{{list.people}}</span>
                  <span class="title">累计付款人数</span>
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
        list:{
          
        }
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
      },
      
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