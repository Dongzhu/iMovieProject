<template>
  <div class="box">
    <div class="login">
      <!-- <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="medium" auto-complete="on" label-position="left" >
        <div class="title">
          <h3>后台登录</h3>
        </div> -->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <div class="title">
          <h3>后台登录</h3>
        </div>
        <el-form-item prop="user">
          <span class="svg-container svg-container_login">
            <!-- <svg-icon icon-class="user" /> -->用户名
          </span>
          <el-input v-model="ruleForm.user" autofocus @keyup.enter.native="submitForm('ruleForm')"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <span class="svg-container svg-container_login">
            <!-- <svg-icon icon-class="user" /> -->密&nbsp;&nbsp;&nbsp;&nbsp;码
          </span>
          <el-input type="password" v-model="ruleForm.pass" @keyup.enter.native="submitForm('ruleForm')" auto-complete="off"></el-input>
        </el-form-item>

        <el-button type="primary" @click="submitForm('ruleForm')" style="width:100%;margin:10px auto 20px;">登录</el-button>

        <div class="tips">
          <p>
            <span class="left">User: admin &nbsp;&nbsp; Pass: any</span>
            <span class="right">
              <a href="">忘记密码？</a>
            </span>
          </p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/views/user'
import { JSEncrypt } from 'jsencrypt'

export default {
  data () {
    return {
      ruleForm: {
        user: 'admin',
        pass: '123456'
      },
      rules: {
        user: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    openSuccess (text) {
      this.$message({
        message: text,
        type: 'success'
      })
    },
    openError (text) {
      this.$message({
        showClose: true,
        message: text,
        type: 'error'
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 实例化一个JSEncrypt对象
          let jse = new JSEncrypt()
          jse.setPublicKey(`-----BEGIN PUBLIC KEY-----
          MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8ygMKjJLSUpnfXqt8lRSAdDxA
          HWKi9GbTFkCbAjkRCR6VUakxxXLXHQUtPCizKcvNpuYqZ5bO8LEgpY7SL3JEdEI9
          OuMnZ6ToeHPfcHeS+EgN0oYmdQ49RB5wZkcBEFk80OBEAM6VhnE0IuHGkU5ko9oP
          Hq3boEQ3Ej6r3T+UhQIDAQAB
          -----END PUBLIC KEY-----`)
          // 设置需要加密的字符串
          let encrypted = jse.encrypt(this.ruleForm.pass)
          // 输出加密结果
          // console.log(encrypted)

          let params = {user: this.ruleForm.user, password: encrypted}
          login(params).then(res => {
            if (res.success) {
              this.openSuccess('Success Login!')
              let path = window.localStorage.getItem('storage')
              if (path) {
                this.$router.push(path)
              } else {
                if (res.data.superrole) {
                  this.$router.push('/admin')
                } else {
                  this.$router.push('/')
                }
              }
            } else {
              this.openError(res.message)
            }
          })
        } else {
          this.openError('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
