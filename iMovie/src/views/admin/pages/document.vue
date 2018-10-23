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
            <el-button type="primary">添加接口</el-button>
          </div>
        </div>
        <div class="clearfix"></div>
        <div class="info-section">
          <el-table
            :data="documentlist"
            style="width: 100%">
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
    </div>
  </div>
</template>

<script>
import sidebar from '../sidebar'
import setting from '../setting'

import { getDocuments } from '@/api/views/documents'

export default {
  components: { sidebar, setting },
  data () {
    return {
      hackReset: false,
      documentlist: [],
      searchTxt: ''
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
      console.log(this.searchTxt)
      getDocuments({keywords: this.searchTxt}).then(res => {
        if (res.success) {
          this.documentlist = res.data.documents
        } else {
          this.openError(res.message)
        }
      })
    },
    handleEdit (index, row) {
      console.log(row)
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

.el-input { background-color: #fff; }
.el-input__inner  { color: #000 !important; caret-color: auto; }
.el-input-group__append, .el-input-group__prepend { border: none !important; }
.input-with-select .el-input-group__append { background-color: #fff; border-left: 1px solid #ccc !important; }
</style>
