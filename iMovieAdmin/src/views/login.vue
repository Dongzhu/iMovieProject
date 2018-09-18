<template>
  <div class="box">
    <div class="login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="medium" auto-complete="on" label-position="left" >
        <div class="title">
          <h3>后台登录</h3>
        </div>
        <el-form-item prop="user">
          <span class="svg-container svg-container_login">
            <!-- <svg-icon icon-class="user" /> -->用户名
          </span>
          <el-input type="password" v-model="ruleForm.user" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <span class="svg-container svg-container_login">
            <!-- <svg-icon icon-class="user" /> -->密&nbsp;&nbsp;&nbsp;&nbsp;码
          </span>
          <el-input type="password" v-model="ruleForm.pass" auto-complete="off"></el-input>
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
export default {
  data () {
    var validateUser = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        if (this.ruleForm.checkUser !== '') {
          this.$refs.ruleForm.validateField('checkUser')
        }
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '' || value.length < 6) {
        callback(new Error('请输入不少于6位密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    return {
      ruleForm: {
        user: '',
        pass: ''
      },
      rules: {
        user: [ { validator: validateUser, trigger: 'blur' } ],
        pass: [ { validator: validatePass, trigger: 'blur' } ]
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login .el-form-item {
    background: rgba(0,0,0,.1);
    border: 1px solid hsla(0,0%,100%,.1);
    border-radius: 5px;
    color: #454545;
}
.svg-container.svg-container_login {
  color: #889aa4;
  display: inline-block;
  padding: 6px 5px 6px 15px;
  vertical-align: middle;
  width: 50px;
}
.login .el-input {
    display: inline-block;
    height: 37px;
    width: 85%;
}
.login .title h3 {
  color: #eee;
  font-size: 26px;
  font-weight: 700;
  margin: 0 auto 40px;
  text-align: center;
}
.login .tips {
  color: #fff;
}
.login .tips p { margin-bottom: 10px; }
.login .tips p span.left { float: left; }
.login .tips p span.right { float: right; }
.login .tips p span.right a { color: #fff; }
.login .tips p span.right a:hover { color: #37a; }
</style>
