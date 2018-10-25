<template>
  <div class="main-admin">
    <sidebar></sidebar>
    <div class="content" v-if="hackReset">
      <setting></setting>
      <div class="info">
        <div class="info-section info-search">
          <div class="info-search-left">
            <el-input placeholder="请输入用户名/emai" v-model="searchTxt" @keyup.enter.native="searchUser" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" class="icon-search" @click="searchUser"></el-button>
            </el-input>
          </div>
          <div class="info-search-right">
            <el-button type="primary" @click="AddUser">添加接口</el-button>
          </div>
        </div>
        <div class="info-section">
          <el-table
            :data="userlist"
            style="width: 100%">
            <el-table-column
              label="用户名"
              prop="username">
            </el-table-column>
            <el-table-column
              label="用户邮箱"
              prop="email">
            </el-table-column>
            <el-table-column label="用户角色">
              <template slot-scope="scope">
                {{scope.row.role}}
                <span v-if="scope.row.role === 'admin' && scope.row.username !== 'admin'" class="cancleadmin">取消管理员</span>
                <span v-if="scope.row.role !== 'admin'" class="setadmin">设为管理员</span>
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              prop="meta.createAt">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <el-dialog
        title="注册用户信息" width="50%" center
        :visible.sync="dialog1" class="userdialog">
        <el-form :model="userCreateForm" :rules="userCreateRules" ref="userCreateForm" class="userform">
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="username1">
            <el-input v-model="userCreateForm.username1" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" :label-width="formLabelWidth" prop="password">
            <el-input type="password" v-model="userCreateForm.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户确认密码" :label-width="formLabelWidth" prop="password2">
            <el-input type="password" v-model="userCreateForm.password2" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" :label-width="formLabelWidth" prop="email1">
            <el-input v-model="userCreateForm.email1" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="cancleDialog1">取 消</el-button>
          <el-button type="primary" @click="confirmDialog1('userCreateForm')">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="修改用户信息" width="50%" center
        :visible.sync="dialog2" class="userdialog">
        <el-form :model="userUpdateForm" :rules="userUpdateRules" ref="userUpdateForm" class="userform">
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="username2">
            <el-input v-model="userUpdateForm.username2" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" :label-width="formLabelWidth" prop="email2">
            <el-input v-model="userUpdateForm.email2" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="cancleDialog2">取 消</el-button>
          <el-button type="primary" @click="confirmDialog2('userUpdateForm')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import sidebar from '../sidebar'
import setting from '../setting'

import { getUsers, register, updUser } from '@/api/views/user'

export default {
  components: { sidebar, setting },
  data () {
    var checkPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.userCreateForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      hackReset: false,
      userlist: [],
      searchTxt: '',
      userCreateForm: {
        username1: '',
        password: '',
        password2: '',
        email1: ''
      },
      userUpdateForm: {
        username2: '',
        email2: ''
      },
      formLabelWidth: '120px',
      userCreateRules: {
        username1: [ { required: true, message: '请输入用户名', trigger: 'change' } ],
        password: [
          { required: true, message: '请输入确认密码', trigger: 'change' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'change' }
        ],
        password2: [
          { required: true, message: '请输入确认密码', trigger: 'change' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'change' },
          { validator: checkPass, trigger: 'change' }
        ],
        email1: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      userUpdateRules: {
        username2: [ { message: '请输入用户名', trigger: 'change' } ],
        email2: [
          { message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      dialog1: true,
      dialog2: false
    }
  },
  computed: {
    tag () { return this.$store.state.tag },
    isMobile () { return this.$store.state.isMobile },
    isCollapse () { return this.$store.state.isCollapse }
  },
  mounted () {
    this.hackReset = true
    this.$nextTick(() => {
      let content = document.querySelector('.content')
      if (this.isCollapse) {
        if (content && !this.isMobile) content.style.width = 'calc(100% - 36px)'
      } else {
        if (content && !this.isMobile) content.style.width = 'calc(100% - 200px)'
      }

      getUsers().then(res => {
        if (res.success) {
          this.userlist = res.data.users
        } else {
          this.openError(res.message)
        }
      })
    })
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
    handleEdit (index, row) {
      console.log(row)
      this.setForm(row)
      this.dialog2 = true
    },
    handleDelete (index, row) {
      console.log(row)
    },
    searchUser () {},
    AddUser () {
      this.dialog1 = true
    },
    confirmDialog1 (formName) {
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
          let encrypted = jse.encrypt(this.userCreateForm.password)
          let encrypted2 = jse.encrypt(this.userCreateForm.password2)

          let params = {user: this.userCreateForm.username1, password: encrypted, password2: encrypted2, email: this.userCreateForm.email1}
          console.log(JSON.stringify(params))
          register(params).then(res => {
            if (res.success === true) {
              this.openSuccess('Success Register!')
            } else {
              this.openError(res.message)
            }
          })
        } else {
          this.openError('error submit!!')
          return false
        }
      })
    },
    confirmDialog2 (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updUser(this.userUpdateForm).then(res => {
            if (res.success) {
              this.openSuccess('添加成功！')
              this.Userlist.push(res.data.save)
              this.dialog1 = false
              this.clearForm()
            } else {
              this.openError(res.message)
            }
          })
        } else {
          this.openError('Error submit!!')
          return false
        }
      })
    },
    cancleDialog1 () {
      this.dialog1 = false
    },
    cancleDialog2 () {
      this.dialog2 = false
    },
    setForm (data) {
      this.userUpdateForm.username2 = data.username
      this.userUpdateForm.email2 = data.email
    },
    clearForm () {
      this.userCreateForm.username1 = ''
      this.userCreateForm.password1 = ''
      this.userCreateForm.password2 = ''
      this.userCreateForm.email1 = ''
      this.userUpdateForm.username2 = ''
      this.userUpdateForm.email2 = ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.cell .el-button+.el-button {
  margin: 10px 0 0 0;
}

.info-search-left .el-input { background-color: #fff; }
.el-input__inner  { color: #000 !important; caret-color: auto; }
.el-input-group__append, .el-input-group__prepend { border: none !important; }
.input-with-select .el-input-group__append { background-color: #fff; border-left: 1px solid #ccc !important; }

.userform .el-input__inner { height: 40px; border: 1px solid #dcdfe6; }
.userdialog .el-dialog--center .el-dialog__body { padding: 25px 25px 0; }
 </style>
