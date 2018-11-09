<template>
  <div class="main-admin">
    <sidebar></sidebar>
    <div class="content" v-if="hackReset">
      <setting></setting>
      <div class="info">
        <div class="info-section info-search">
          <div class="info-search-left">
            <el-input placeholder="请输入电影名称/主演/剧情简介" v-model="searchTxt" @keyup.enter.native="searchMovie" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" class="icon-search" @click="searchMovie"></el-button>
            </el-input>
          </div>
          <div class="info-search-right">
            <el-button type="primary" @click="addMovie">添加电影</el-button>
          </div>
        </div>
        <div class="clearfix"></div>
        <div class="info-section">
          <div class="card card-admin" v-for="(item,index) in movielist" :key="index" v-if="movielist.length !== 0">
            <div class="card-bg" :title="item.title+' '+item.rate">
              <a :href="'/detail/'+item.id"><img v-lazy="item.poster" :alt="item.title" width="100%" height="100%" class="image"></a>
              <span class="card-rate">{{ item.rate }}</span>
            </div>
            <!-- <div class="video">
              <video
                src="http://120.132.18.193:8080/vod/2018/6/29/1530263522730512.mp4"
                width="100%" height="100%"
                onMouseOver="this.play()" onMouseOut="this.pause()" :poster="item.url">
                您的浏览器不支持video标签
              </video>
            </div> -->
            <div class="card-info">
              <p class="over"><a :href="'/detail/'+item.id">{{item.title}}</a></p>
              <p class="bottom clearfix">
                <time class="time"><a :href="'/detail/'+item.id">{{ item.year }}</a></time>
              </p>
              <p>
                <el-button type="text" class="button">推荐</el-button>
                <el-button type="text" class="button" @click="editMovie(item)">编辑</el-button>
                <el-button type="text" class="button">删除</el-button>
              </p>
            </div>
          </div>
          <div class="" v-if="movielist.length === 0">
            <p style="padding: 100px 0; text-align: center">暂无数据</p>
          </div>
        </div>
      </div>

      <el-dialog
        title="添加电影信息" width="50%" center
        :visible.sync="dialog1" class="dialog moviedialog" v-if="hackReset">
        <el-form :model="movieCreateForm" :rules="movieCreateRules" ref="movieCreateForm" class="form">
          <el-form-item label="电影名称" :label-width="formLabelWidth" prop="title">
            <el-input v-model="movieCreateForm.title" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="导演" :label-width="formLabelWidth" prop="director">
            <el-input v-model="movieCreateForm.director" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="主演" :label-width="formLabelWidth" prop="cast">
            <el-input v-model="movieCreateForm.cast" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="语言" :label-width="formLabelWidth" prop="language">
            <el-input v-model="movieCreateForm.language" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电影时长" :label-width="formLabelWidth" prop="movie_duration">
            <el-input v-model.number="movieCreateForm.movie_duration" onkeyup="value=value.replace(/[^\d]/g,'')" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="类型" :label-width="formLabelWidth" prop="movie_type">
            <el-input v-model="movieCreateForm.movie_type" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="地区" :label-width="formLabelWidth" prop="country">
            <el-input v-model="movieCreateForm.country" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="上映日期" :label-width="formLabelWidth" prop="pubdate">
            <el-input v-model="movieCreateForm.pubdate" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="年份" :label-width="formLabelWidth" prop="year">
            <el-input v-model.number="movieCreateForm.year" onkeyup="value=value.replace(/[^\d]/g,'')" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="评分" :label-width="formLabelWidth" prop="rate">
            <el-input v-model.number="movieCreateForm.rate" onkeyup="value=value.replace(/[^\d]/g,'')" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="剧情简介" :label-width="formLabelWidth" prop="summary">
            <el-input v-model="movieCreateForm.summary" type="textarea" :rows="4" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="cancleDialog1">取 消</el-button>
          <el-button type="primary" @click="confirmDialog1('movieCreateForm')">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="编辑电影信息" width="50%" center
        :visible.sync="dialog2" class="dialog moviedialog" v-if="hackReset">
        <el-form :model="movieUpdateForm" :rules="movieUpdateRules" ref="movieCreateForm" class="form">
          <el-form-item label="电影名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="movieUpdateForm.title" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="导演" :label-width="formLabelWidth" prop="url">
            <el-input v-model="movieUpdateForm.director" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="主演" :label-width="formLabelWidth" prop="method">
            <el-input v-model="movieUpdateForm.cast" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="语言" :label-width="formLabelWidth" prop="method">
            <el-input v-model="movieUpdateForm.language" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电影时长" :label-width="formLabelWidth" prop="response">
            <el-input v-model="movieUpdateForm.movie_duration" onkeyup="value=value.replace(/[^\d]/g,'')" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="类型" :label-width="formLabelWidth" prop="response">
            <el-input v-model="movieUpdateForm.movie_type" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="地区" :label-width="formLabelWidth" prop="desc">
            <el-input v-model="movieUpdateForm.country" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="上映日期" :label-width="formLabelWidth" prop="request">
            <el-input v-model="movieUpdateForm.pubdate" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="年份" :label-width="formLabelWidth" prop="request">
            <el-input v-model="movieUpdateForm.year" onkeyup="value=value.replace(/[^\d]/g,'')" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="评分" :label-width="formLabelWidth" prop="response">
            <el-input v-model="movieUpdateForm.rate" onkeyup="value=value.replace(/[^\d]/g,'')" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="剧情简介" :label-width="formLabelWidth" prop="request">
            <el-input v-model="movieUpdateForm.summary" type="textarea" :rows="4" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="cancleDialog2">取 消</el-button>
          <el-button type="primary" @click="confirmDialog2('movieUpdateForm')">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        :title="movie.title" width="60%" center
        :visible.sync="dialog3" class="dialog moviedialog" v-if="hackReset">
        <div class="section-info">
          <div class="section-info1">
            <img :src="movie.poster || ''" :alt="movie.title || ''" width="100%">
          </div>
          <div class="section-info2">
            <p>导演：<span v-for="(item,index) in movie.director || ''" :key="index">{{item}} </span></p>
            <p>主演：<span v-for="(item,index) in movie.cast || ''" :key="index"><span v-if="index !== 0"> / </span>{{item}}</span></p>
            <p>语言：<span v-for="(item,index) in movie.language || ''" :key="index">{{item}} </span></p>
            <p>时长：<span v-for="(item,index) in movie.movie_duration || ''" :key="index">{{item}} </span></p>
            <p>类型：<span v-for="(item,index) in movie.movie_type || ''" :key="index">{{item}} </span></p>
            <p>地区：<span v-for="(item,index) in movie.country || ''" :key="index">{{item}} </span></p>
            <p>上映日期：<span v-for="(item,index) in movie.pubdate || ''" :key="index">{{item}} </span></p>
            <p>年份：{{movie.year || ''}}</p>
            <p>评分：
              <el-rate
                v-model="movie.rate"
                disabled
                text-color="#ff9900">
              </el-rate>
              <span>{{movie.rate*2}}</span>
            </p>
            <p>剧情简介：{{movie.summary || 0 }}</p>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancleDialog3">关闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import sidebar from '../sidebar'
import setting from '../setting'

import { getMovies } from '@/api/views/movies'

export default {
  components: { sidebar, setting },
  data () {
    var checkNum = (rule, value, callback) => {
      console.log(value, typeof value, !value, !Number.isInteger(value))
      // if (!value) { return callback(new Error('值不能为空')) }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          callback()
        }
      }, 1000)
    }
    return {
      movielist: [],
      searchTxt: '',
      hackReset: false,
      movie: [],
      // Dialog
      dialog1: false,
      dialog2: false,
      dialog3: false,
      movieCreateForm: {
        author: '',
        title: '',
        alt_title: '',
        image: '',
        summary: '',
        language: '',
        pubdate: '',
        country: '',
        writer: '',
        director: '',
        cast: '',
        movie_duration: '',
        year: '',
        movie_type: '',
        rate: '',
        recommend: false
      },
      movieUpdateForm: {
        author: '',
        title: '',
        alt_title: '',
        image: '',
        summary: '',
        language: '',
        pubdate: '',
        country: '',
        writer: '',
        director: '',
        cast: '',
        movie_duration: '',
        year: '',
        movie_type: '',
        rate: '',
        recommend: false
      },
      formLabelWidth: '120px',
      movieCreateRules: {
        title: [ { required: true, message: '请输入电影名称', trigger: 'blur' } ],
        director: [ { required: true, message: '请输入导演，如有多个用 / 分隔', trigger: 'blur' } ],
        cast: [ { required: true, message: '请输入主演，如有多个用 / 分隔', trigger: 'blur' } ],
        language: [ { required: true, message: '请输入语言，如有多个用 / 分隔', trigger: 'blur' } ],
        movie_duration: [ { validator: checkNum, trigger: 'blur' } ],
        movie_type: [ { required: true, message: '请输入电影类型，如有多个用 / 分隔', trigger: 'blur' } ],
        country: [ { required: true, message: '请输入地区，如有多个用 / 分隔', trigger: 'blur' } ],
        pubdate: [ { required: true, message: '请输入上映日期，如有多个用 / 分隔', trigger: 'blur' } ],
        year: [ { validator: checkNum, trigger: 'blur' }, { required: true, message: '请输入年份', trigger: 'blur' } ],
        rate: [ { validator: checkNum, trigger: 'blur' }, { required: true, message: '请输入评分', trigger: 'blur' } ],
        summary: [ { required: true, message: '请输入剧情简介', trigger: 'blur' } ]
      },
      movieUpdateRules: {
        name: [ { required: true, message: '请输入接口名称', trigger: 'blur' } ]
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

      getMovies({}).then(res => {
        if (res.success) {
          this.movielist = res.data.movies
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
    searchMovie () {
      if (this.searchTxt === '') return this.openError('请输入关键字在进行搜索！')

      getMovies({keywords: this.searchTxt}).then(res => {
        if (res.success) {
          this.movielist = res.data.movies
        } else {
          return this.openError(res.message)
        }
      })
    },
    setForm (data) {
      console.log(data.tags)
      this.movieUpdateForm.title = data.title
      this.movieUpdateForm.director = data.director.join('/')
      this.movieUpdateForm.cast = data.cast.join('/')
      this.movieUpdateForm.language = data.language.join('/')
      this.movieUpdateForm.movie_duration = data.movie_duration.join('/')
      this.movieUpdateForm.movie_type = data.movie_type.join('/')
      this.movieUpdateForm.country = data.country.join('/')
      this.movieUpdateForm.pubdate = data.pubdate.join('/')
      this.movieUpdateForm.year = data.year
      this.movieUpdateForm.rate = data.rate
      this.movieUpdateForm.summary = data.summary
    },
    clearForm (data) {
      this.movieUpdateForm.title = ''
      this.movieUpdateForm.director = ''
      this.movieUpdateForm.cast = ''
      this.movieUpdateForm.summary = ''
      this.movieUpdateForm.movie_duration = ''
      this.movieUpdateForm.year = ''
    },
    addMovie () {
      this.dialog1 = true
    },
    editMovie (item) {
      this.setForm(item)
      this.dialog2 = true
    },
    confirmDialog1 (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.movieCreateForm)
          // AddDocument(this.movieCreateForm).then(res => {
          //   if (res.success) {
          //     this.openSuccess('添加成功！')
          //     this.documentlist.push(res.data.save)
          //     this.dialog1 = false
          //     this.hack()
          //     this.clearForm()
          //   } else {
          //     this.openError(res.message)
          //   }
          // })
        } else {
          this.openError('Error submit!!')
          return false
        }
      })
    },
    confirmDialog2 () {
      this.dialog2 = false
    },
    cancleDialog1 () {
      this.dialog1 = false
    },
    cancleDialog2 () {
      this.dialog2 = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.moviedialog .el-dialog.el-dialog--center {
  margin-top: 5vh !important;
}
</style>
