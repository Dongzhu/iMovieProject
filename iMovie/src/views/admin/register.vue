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
          <el-input v-model="ruleForm.user"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <span class="svg-container svg-container_login">
            <!-- <svg-icon icon-class="user" /> -->密&nbsp;&nbsp;&nbsp;&nbsp;码
          </span>
          <el-input type="password" v-model="ruleForm.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="pass2">
          <span class="svg-container svg-container_login">
            <!-- <svg-icon icon-class="user" /> -->确认密码
          </span>
          <el-input type="password" v-model="ruleForm.pass2" auto-complete="off"></el-input>
        </el-form-item>

        <el-button type="primary" @click="submitForm('ruleForm')" style="width:100%;margin:10px auto 20px;">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { register } from '@/api/views/user'
import { JSEncrypt } from 'jsencrypt'

export default {
  data () {
    var checkPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        user: 'admin',
        pass: '123456',
        pass2: '123456'
      },
      rules: {
        user: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
        ],
        pass: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'change' }
        ],
        pass2: [
          { required: true, message: '请输入确认密码', trigger: 'change' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'change' },
          { validator: checkPass, trigger: 'change' }
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
          let encrypted2 = jse.encrypt(this.ruleForm.pass2)

          let params = {user: this.ruleForm.user, password: encrypted, password2: encrypted2}
          console.log(JSON.stringify(params))
          register(params).then(res => {
            if (res.success === true) {
              this.openSuccess('Success Register!')
              let path = window.localStorage.getItem('storage')
              if (path !== '') {
                this.$router.push(path)
              } else {
                this.$router.push('/login')
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
