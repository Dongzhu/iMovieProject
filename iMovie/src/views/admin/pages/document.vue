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
            style="width: 100%" class="documenttable">
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
        title="修改接口信息" width="50%" center
        :visible.sync="dialog1" class="documentdialog">
        <el-form :model="form" :rules="rules" ref="form" class="documentform">
          <el-form-item label="接口名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="接口地址" :label-width="formLabelWidth" prop="url">
            <el-input v-model="form.url" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="请求方式" :label-width="formLabelWidth" prop="method">
            <el-input v-model="form.method" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="接口描述" :label-width="formLabelWidth" prop="desc">
            <el-input v-model="form.desc" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="请求参数" :label-width="formLabelWidth" prop="request">
            <el-input v-model="form.request" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="返回结果" :label-width="formLabelWidth" prop="response">
            <el-input v-model="form.response" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="cancleDialog">取 消</el-button>
          <el-button type="primary" @click="confirmDialog('form')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import sidebar from '../sidebar'
import setting from '../setting'

import { getDocuments, AddDocument } from '@/api/views/documents'

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
      dialog1: true,
      form: {
        id: '',
        // name: '',
        // url: '',
        // method: '',
        // desc: '',
        // request: '',
        // response: '',
        name: '用户登录',
        url: '/api/user/login',
        method: 'POST',
        desc: '用户登录接口',
        request: '{ "username": "admin", "password": "123456" }',
        response: '{ "success": true, "message": "登录成功", "rescode": 10020, "data": "" }'
      },
      formLabelWidth: '120px',
      rules: {
        name: [ { required: true, message: '请输入接口名称', trigger: 'change' } ],
        url: [ { required: true, message: '请输入接口地址', trigger: 'change' } ],
        method: [ { required: true, message: '请输入接口方式', trigger: 'change' } ],
        desc: [ { required: true, message: '请输入接口描述', trigger: 'change' } ],
        request: [
          // { required: true, message: '请输入请求参数', trigger: 'change' },
          // { validator: isJSON, trigger: 'change' }
        ],
        response: [
          // { required: true, message: '请输入请求参数', trigger: 'change' },
          // { validator: isJSON, trigger: 'change' }
        ]
      }
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
      this.dialog1 = true
    },
    confirmDialog (formName) {
      // this.$refs[formName].validate((valid) => {
      //   console.log(valid)
      //   console.log(2221)
      //   console.log(JSON.stringify(this.form))
      //   if (valid) {
      //   } else {
      //     this.openError('error submit!!')
      //     return false
      //   }
      console.log(2333)
      this.$refs[formName].validate((valid) => {
        console.log(2222)
        if (valid) {
          console.log(2221)
          console.log(JSON.stringify(this.form))
          console.log(this.form)
          AddDocument(this.form).then(res => {
            console.log(res)
          })
          // this.clearForm()
          // this.dialog1 = false
        } else {
          this.openError('Error submit!!')
          return false
        }
      })
    },
    cancleDialog () {
      this.clearForm()
      this.dialog1 = false
    },
    setForm (data) {
      this.form.id = data._id
      this.form.name = data.name
      this.form.url = data.url
      this.form.method = data.method
      this.form.desc = data.desc
      this.form.request = JSON.stringify(data.request)
      this.form.response = JSON.stringify(data.response)
    },
    clearForm () {
      this.form.id = ''
      this.form.name = ''
      this.form.url = ''
      this.form.method = ''
      this.form.desc = ''
      this.form.request = ''
      this.form.response = ''
    },
    handleEdit (index, row) {
      console.log(row)
      this.dialog1 = true
      this.setForm(row)
    },
    handleDelete (index, row) {
      console.log(row)
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

.info-search-left .el-input { background-color: #fff; }
.el-input__inner  { color: #000 !important; caret-color: auto; }
.el-input-group__append, .el-input-group__prepend { border: none !important; }
.input-with-select .el-input-group__append { background-color: #fff; border-left: 1px solid #ccc !important; }

.documenttable .cell .el-button+.el-button { margin: 10px 0 0 0; }
.documentform .el-input__inner { height: 40px; border: 1px solid #dcdfe6; }
.documentdialog .el-dialog--center .el-dialog__body { padding: 25px 25px 0; }
</style>
