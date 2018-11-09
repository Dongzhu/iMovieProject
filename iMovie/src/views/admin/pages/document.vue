<template>
  <div class="main-admin">
    <sidebar></sidebar>
    <div class="content" v-if="hackReset">
      <setting></setting>
      <div class="info">
        <div class="info-section info-search">
          <div class="info-search-left">
            <el-input placeholder="请输入接口名称/URL/ID" v-model="searchTxt" @keyup.enter.native="searchDocument" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" class="icon-search" @click="searchDocument"></el-button>
            </el-input>
          </div>
          <div class="info-search-right">
            <el-button type="primary" @click="addDocument">添加接口</el-button>
          </div>
        </div>
        <div class="clearfix"></div>
        <div class="info-section">
          <el-table
            :data="documentlist"
            style="width: 100%" class="table">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="接口ID">
                    <span>{{ props.row.id }}</span>
                  </el-form-item>
                  <el-form-item label="接口名称">
                    <span>{{ props.row.name }}</span>
                  </el-form-item>
                  <el-form-item label="接口地址">
                    <span>{{ props.row.url }}</span>
                  </el-form-item>
                  <el-form-item label="请求方式">
                    <span>{{ props.row.method }}</span>
                  </el-form-item>
                  <el-form-item label="接口描述">
                    <span>{{ props.row.desc }}</span>
                  </el-form-item>
                  <el-form-item label="创建时间">
                    <span>{{ props.row.meta.createAt }}</span>
                  </el-form-item>
                  <el-form-item label="请求参数">
                    <span>{{ props.row.request }}</span>
                  </el-form-item>
                  <el-form-item label="返回结果">
                    <span>{{ props.row.response }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              label="接口ID"
              prop="id">
            </el-table-column>
            <el-table-column
              label="接口名称"
              prop="name">
            </el-table-column>
            <el-table-column
              label="接口地址"
              prop="url">
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
        title="添加接口信息" :width="dialogwidth" center
        :visible.sync="dialog1" class="dialog" v-if="hackReset">
        <el-form :model="docCreateForm" :rules="docCreateRules" ref="docCreateForm" class="form">
          <el-form-item label="接口名称1" :label-width="formLabelWidth" prop="name">
            <el-input v-model="docCreateForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="接口地址" :label-width="formLabelWidth" prop="url">
            <el-input v-model="docCreateForm.url" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="请求方式" :label-width="formLabelWidth" prop="method">
            <el-input v-model="docCreateForm.method" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="接口描述" :label-width="formLabelWidth" prop="desc">
            <el-input v-model="docCreateForm.desc" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="请求参数" :label-width="formLabelWidth" prop="request">
            <el-input v-model="docCreateForm.request" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="返回结果" :label-width="formLabelWidth" prop="response">
            <el-input v-model="docCreateForm.response" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="cancleDialog1">取 消</el-button>
          <el-button type="primary" @click="confirmDialog1('docCreateForm')">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="修改接口信息" :width="dialogwidth" center
        :visible.sync="dialog2" class="dialog" v-if="hackReset">
        <el-form :model="docUpdateForm" :rules="docUpdateRules" ref="docUpdateForm" class="form">
          <el-form-item label="接口名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="docUpdateForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="接口地址" :label-width="formLabelWidth" prop="url">
            <el-input v-model="docUpdateForm.url" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="请求方式" :label-width="formLabelWidth" prop="method">
            <el-input v-model="docUpdateForm.method" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="接口描述" :label-width="formLabelWidth" prop="desc">
            <el-input v-model="docUpdateForm.desc" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="请求参数" :label-width="formLabelWidth" prop="request">
            <el-input v-model="docUpdateForm.request" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="返回结果" :label-width="formLabelWidth" prop="response">
            <el-input v-model="docUpdateForm.response" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="cancleDialog2">取 消</el-button>
          <el-button type="primary" @click="confirmDialog2('docUpdateForm')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import sidebar from '../sidebar'
import setting from '../setting'

import { getDocuments, AddDocument, UpdDocument, DelDocument } from '@/api/views/documents'

export default {
  components: { sidebar, setting },
  data () {
    var isJSON = (rule, str, callback) => {
      setTimeout(() => {
        if (typeof str === 'string') {
          try {
            JSON.parse(str)
            if (str.indexOf('{') < 0) {
              callback(new Error('请输入正确的JSON格式，如 { "name": "admin" }'))
            } else {
              callback()
            }
          } catch (e) {
            callback(new Error('请输入正确的JSON格式，如 { "name": "admin" }'))
          }
        }
      }, 1000)
    }
    return {
      hackReset: false,
      documentlist: [],
      searchTxt: '',
      // Dialog
      dialog1: false,
      dialog2: false,
      docCreateForm: {
        name: '',
        url: '',
        method: '',
        desc: '',
        request: '',
        response1: ''

        // name: '用户注册',
        // url: '/api/user/register',
        // method: 'POST',
        // desc: '用户注册接口',
        // request: '{ "username": "admin", "password": "123456", "password2": "123456" }',
        // response: '{ "success": true, "message": "注册成功", "rescode": 10010, "data": {"username": "admin", "password": "123456", "role":"normal"} }'

        // name: '用户登录',
        // url: '/api/user/login',
        // method: 'POST',
        // desc: '用户登录接口',
        // request: '{ "username": "admin", "password": "123456" }',
        // response: '{ "success": true, "message": "登录成功", "rescode": 10020, "data": { "username":"admin", "superrole": true } }'
      },
      docUpdateForm: {
        id: '',
        name: '',
        url: '',
        method: '',
        desc: '',
        request: '',
        response: ''
      },
      formLabelWidth: '120px',
      docCreateRules: {
        name: [ { required: true, message: '请输入接口名称', trigger: 'change' } ],
        url: [ { required: true, message: '请输入接口地址', trigger: 'change' } ],
        method: [ { required: true, message: '请输入接口方式', trigger: 'change' } ],
        desc: [ { required: true, message: '请输入接口描述', trigger: 'change' } ],
        request: [
          { required: true, message: '请输入请求参数', trigger: 'change' },
          { validator: isJSON, trigger: 'change' }
        ],
        response: [
          { required: true, message: '请输入请求参数', trigger: 'change' },
          { validator: isJSON, trigger: 'change' }
        ]
      },
      docUpdateRules: {
        request: { validator: isJSON, trigger: 'change' },
        response: { validator: isJSON, trigger: 'change' }
      }
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
      this.setContent()

      getDocuments({}).then(res => {
        if (res.success) {
          this.documentlist = res.data.documents
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
    hack () {
      // console.log('hack it!')
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
    },
    setContent () {
      let content = document.querySelector('.content')
      if (this.isCollapse) {
        if (content && !this.isMobile) content.style.width = 'calc(100% - 36px)'
      } else {
        if (content && !this.isMobile) content.style.width = 'calc(100% - 200px)'
      }
    },
    searchDocument () {
      // if (this.searchTxt === '') return this.openError('请输入关键字再进行搜索哦！')
      getDocuments({keywords: this.searchTxt}).then(res => {
        if (res.success) {
          this.documentlist = res.data.documents
        } else {
          this.openError(res.message)
        }
      })
    },
    addDocument () {
      // this.clearForm()
      this.dialog1 = true
    },
    confirmDialog1 (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          AddDocument(this.docCreateForm).then(res => {
            if (res.success) {
              this.openSuccess('添加成功！')
              this.documentlist.push(res.data.save)
              this.dialog1 = false
              this.hack()
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
      this.clearForm()
      this.dialog1 = false
    },
    confirmDialog2 (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          UpdDocument(this.docUpdateForm).then(res => {
            if (res.success) {
              this.openSuccess('更改成功！')
              this.documentlist.forEach(item => {
                if (item._id === this.docUpdateForm.id) {
                  this.documentlist.splice(this.documentlist.indexOf(item), 1)
                  this.documentlist.push(res.data.save)
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
    cancleDialog2 () {
      this.clearForm()
      this.dialog2 = false
    },
    setForm (data) {
      this.docUpdateForm.id = data._id
      this.docUpdateForm.name = data.name
      this.docUpdateForm.url = data.url
      this.docUpdateForm.method = data.method
      this.docUpdateForm.desc = data.desc
      this.docUpdateForm.request = data.request
      this.docUpdateForm.response = data.response
    },
    clearForm () {
      this.docCreateForm.name = ''
      this.docCreateForm.url = ''
      this.docCreateForm.method = ''
      this.docCreateForm.desc = ''
      this.docCreateForm.request = ''
      this.docCreateForm.response = ''
      this.docUpdateForm.id = ''
      this.docUpdateForm.name = ''
      this.docUpdateForm.url = ''
      this.docUpdateForm.method = ''
      this.docUpdateForm.desc = ''
      this.docUpdateForm.request = ''
      this.docUpdateForm.response = ''
    },
    handleEdit (index, row) {
      // console.log(row)
      this.setForm(row)
      this.dialog2 = true
    },
    handleDelete (index, row) {
      // console.log(row)
      this.$confirm('确认是否删除该接口信息？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(() => {
        DelDocument({id: row._id}).then(res => {
          if (res.success) {
            this.openSuccess('删除成功！')
            this.documentlist.forEach(item => {
              if (item._id === row._id) {
                this.documentlist.splice(this.documentlist.indexOf(item), 1)
              }
            })
          } else {
            this.openError(res.message)
          }
        })
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
