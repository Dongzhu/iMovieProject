<template>
  <div class="main-admin">
    <sidebar></sidebar>
    <div class="content" v-if="hackReset">
      <setting></setting>
      <div class="info">
        <div class="info-section">
          <el-table
            :data="userlist"
            style="width: 100%">
            <el-table-column
              label="用户姓名"
              prop="username">
            </el-table-column>
            <el-table-column
              label="用户邮箱"
              prop="email">
            </el-table-column>
            <el-table-column
              label="用户角色"
              prop="role">
            </el-table-column>
            <el-table-column label="用户角色">
              <template slot-scope="scope">
                {{scope.row.role}}
                <span v-if="scope.row.role === 'admin' && scope.row.username !== 'admin'" class="cancleadmin">取消管理员</span>
                <span v-if="scope.row.role !== 'admin'" class="setadmin">设为管理员</span>
              </template>
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

import { getUsers } from '@/api/views/user'

export default {
  components: { sidebar, setting },
  data () {
    return {
      hackReset: false,
      userlist: []
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
<style scoped>
.cell .el-button+.el-button {
  margin: 10px 0 0 0;
}
</style>
