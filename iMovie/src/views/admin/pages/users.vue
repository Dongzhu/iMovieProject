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
            <el-button type="primary" @click="AddUser">添加用户</el-button>
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
                <span v-if="scope.row.role === 'admin' && scope.row.username !== 'admin'" class="setadmin" @click="changeRole(scope.row, 'normal')">取消管理员</span>
                <span v-if="scope.row.role !== 'admin'" class="setadmin" @click="changeRole(scope.row, 'admin')">设为管理员</span>
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
        title="注册用户信息" :width="dialogwidth" center
        :visible.sync="dialog1" class="dialog">
        <el-form :model="userCreateForm" :rules="userCreateRules" ref="userCreateForm" class="form">
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
            <el-input v-model="userCreateForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" :label-width="formLabelWidth" prop="password">
            <el-input type="password" v-model="userCreateForm.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户确认密码" :label-width="formLabelWidth" prop="password2">
            <el-input type="password" v-model="userCreateForm.password2" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="userCreateForm.email" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="cancleDialog1">取 消</el-button>
          <el-button type="primary" @click="confirmDialog1('userCreateForm')">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="修改用户信息" :width="dialogwidth" center
        :visible.sync="dialog2" class="dialog">
        <el-form :model="userUpdateForm" :rules="userUpdateRules" ref="userUpdateForm" class="form">
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
            <el-input v-model="userUpdateForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="userUpdateForm.email" auto-complete="off"></el-input>
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

import { getUsers, register, updUser, delUser } from '@/api/views/user'
import { JSEncrypt } from 'jsencrypt'

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
        username: '',
        password: '',
        password2: '',
        email: ''
        // username: 'Jack2',
        // password: '123456',
        // password2: '123456',
        // email: '1234562@gmail.com'
      },
      userUpdateForm: {
        _id: '',
        username: '',
        email: ''
      },
      formLabelWidth: '120px',
      userCreateRules: {
        username: { required: true, message: '请输入用户名', trigger: 'change' },
        password: [
          { required: true, message: '请输入确认密码', trigger: 'change' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'change' }
        ],
        password2: [
          { required: true, message: '请输入确认密码', trigger: 'change' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'change' },
          { validator: checkPass, trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      userUpdateRules: {
        username: { message: '请输入用户名', trigger: 'change' },
        email: [
          { message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      dialog1: false,
      dialog2: false
    }
  },
  computed: {
    tag () { return this.$store.state.tag },
    isMobile () { return this.$store.state.isMobile },
    isCollapse () { return this.$store.state.isCollapse },
    dialogwidth () {
      if (this.$store.state.isMobile) {
        return '90%'
      } else {
        return '50%'
      }
    }
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

      getUsers({}).then(res => {
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
      // console.log(row)
      this.setForm(row)
      this.dialog2 = true
    },
    handleDelete (index, row) {
      // console.log(row)
      this.$confirm('确认是否删除该用户信息？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(() => {
        delUser({id: row._id}).then(res => {
          if (res.success) {
            this.openSuccess('删除成功！')
            this.userlist.forEach(item => {
              if (item._id === row._id) {
                this.userlist.splice(this.userlist.indexOf(item), 1)
              }
            })
          } else {
            this.openError(res.message)
          }
        })
      }).catch(error => {
        console.log(error)
      })
    },
    searchUser () {
      if (this.searchTxt === '') return this.openError('请输入关键字再进行搜索！')
      getUsers({keywords: this.searchTxt}).then(res => {
        if (res.success) {
          this.userlist = res.data.users
        }
      })
    },
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

          let params = {user: this.userCreateForm.username, password: encrypted, password2: encrypted2, email: this.userCreateForm.email}
          // console.log(JSON.stringify(params))
          register(params).then(res => {
            if (res.success === true) {
              this.openSuccess('Success Register!')
              if (res.data.save) this.userlist.push(res.data.save)
              this.dialog1 = false
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
          const params = {
            '_id': this.userUpdateForm._id,
            'username': this.userUpdateForm.username,
            'email': this.userUpdateForm.email
          }
          // console.log(params)
          updUser(params).then(res => {
            if (res.success) {
              this.openSuccess('更改成功！')
              this.userlist.forEach(item => {
                if (item._id === this.userUpdateForm._id) {
                  this.userlist.splice(this.userlist.indexOf(item), 1)
                  this.userlist.push(res.data.save)
                }
              })
              this.dialog2 = false
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
    changeRole (row, role) {
      this.$confirm('确认是否更改该用户角色信息？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认更改',
        cancelButtonText: '取消'
      }).then(() => {
        updUser({_id: row._id, role: role}).then(res => {
          if (res.success) {
            this.openSuccess('更改成功！')
            this.userlist.forEach(item => {
              if (item._id === row._id) {
                if (res.data.save) {
                  item.role = res.data.save.role
                  item.meta = res.data.save.meta
                }
              }
            })
          } else {
            this.openError(res.message)
          }
        })
      }).catch(error => {
        console.log(error)
      })
    },
    setForm (data) {
      this.userUpdateForm._id = data._id
      this.userUpdateForm.username = data.username
      this.userUpdateForm.email = data.email
    },
    clearForm () {
      this.userCreateForm.username = ''
      this.userCreateForm.password1 = ''
      this.userCreateForm.password2 = ''
      this.userCreateForm.email = ''
      this.userUpdateForm.username = ''
      this.userUpdateForm.email = ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cell .el-button+.el-button { margin: 10px 0 0 0; }
</style>
