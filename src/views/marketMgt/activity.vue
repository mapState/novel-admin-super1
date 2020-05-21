<template>
  <div class="main">
    <h3>活动设置</h3>
    <el-form ref="form" :model="form" label-width="180px">
      <el-form-item label="邀请好友奖励金额">
        <el-input v-model.number="form.a" style="width:200px;" placeholder="（书币）" />
        <el-button type="success" @click="save1">保存</el-button>
      </el-form-item>
      <el-form-item label="新用户注册赠送" label-width="180px">
        <el-input v-model.number="form.b" style="width:200px;" placeholder="（书币）" />
        <el-button type="success" @click="save2">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import request from '@/utils/request'
export default {
  data() {
    return {
      form: {
        a: '',
        b: ''
      }
    }
  },
  mounted() {
    this.getData1()
    this.getData2()
  },
  methods: {
    getData1() {
      request({
        url: '/system/config/list',
        method: 'get',
        params: {
          sysType: 2
        }
      }).then(res => {
        this.form.a = res.data[res.data.length - 1].sysValue
      })
    },
    getData2() {
      request({
        url: '/system/config/list',
        method: 'get',
        params: {
          sysType: 3
        }
      }).then(res => {
        this.form.b = res.data[res.data.length - 1].sysValue
      })
    },
    save1() {
      const data = {
        sysType: 2,
        sysValue: this.form.a
      }
      request({
        url: '/system/config/save',
        method: 'post',
        data
      }).then(res => {
        console.log(res)
        this.$message({
          type: 'success',
          message: res.message
        })
      })
    },
    save2() {
      const data = {
        sysType: 3,
        sysValue: this.form.b
      }
      request({
        url: '/system/config/save',
        method: 'post',
        data
      }).then(res => {
        console.log(res)
        this.$message({
          type: 'success',
          message: res.message
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.main {
  padding: 30px;
}
</style>
