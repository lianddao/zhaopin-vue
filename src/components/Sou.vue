<template>

  <div class="container">
    <b-form>
      <!-- 输入关键字 -->
      <!-- 这里是中国字,上传后会乱码吗? -->
      <b-input-group class="mb-3">
        <b-dropdown :text="sou1" variant="outline-secondary" slot="prepend">
          <b-dropdown-item @click="fun1('请输入关键词,例如:JAVA,销售代表,行政助理等')">职位</b-dropdown-item>
          <b-dropdown-item @click="fun1('请输入公司名称或关键词,例如:联想,华为等')">公司</b-dropdown-item>
        </b-dropdown>
        <b-form-input required :placeholder="placeholder" v-model="query.kw"></b-form-input>
      </b-input-group>

      <!-- 选择城市 -->
      <b-input-group class="mb-3">
        <b-input-group-prepend>
          <b-btn id="btn1" variant="outline-info" v-b-modal.modal-center>全国</b-btn>
        </b-input-group-prepend>
        <b-form-input v-model="getDiDian"></b-form-input>
      </b-input-group>

      <!-- 选择职位 -->
      <b-input-group class="mb-3">
        <b-input-group-prepend>
          <b-btn id="btn1" variant="outline-info" v-b-modal.modal-job-type>职位类别</b-btn>
        </b-input-group-prepend>
        <b-form-input v-model="getDiDian"></b-form-input>
      </b-input-group>
      <b-button type="button" variant="primary" @click="onSubmit">搜索工作</b-button>
    </b-form>

    <!-- 选择地区Modal -->
    <b-modal id="modal-center" centered size="lg" title="选择地区" hide-footer>
      <b-form-group class="row" label="主要城市">
        <b-form-checkbox-group id="checkboxes2" name="flavour2" v-model="selected">
          <b-form-checkbox v-for="i in city" :value="i.value" :key="i.value" class="col-5 col-sm-3 col-md-2">{{ i.text }}</b-form-checkbox>
        </b-form-checkbox-group>
      </b-form-group>

      <ul class="list-inline row">
        <!-- 有城市 -->
        <li v-for="i in sheng" v-if="citysDialog(i.id).length > 0" :id="'x_'+i.id" :key="i.id" class="col-6 col-md-4">
          {{ i.name }}
          <b-popover ref="popover" :target="'x_'+i.id" :title="i.name" placement="bottomright">
            <b-form-checkbox v-for="j in citysDialog(i.id,123)" :value="j.id" :key="j.id" v-model="selected">
              {{ j.name }}
            </b-form-checkbox>
          </b-popover>
        </li>

        <!--无城市-->
        <b-form-checkbox v-else>{{ i.name }}</b-form-checkbox>
      </ul>
    </b-modal>

    <!-- 选择职位Modal -->
    <b-modal id="modal-job-type" centered size="lg" title="选择职位" hide-footer>
      <job-type v-on:输出值="jobTypesListener"></job-type>
    </b-modal>
    <pre>输出值:{{ job_type_selected }}</pre>

    <hr />

    <h1>热门职位</h1>
    <ul class="list-inline row">
      <li class="col-xs-6 col-sm-6 col-md-3" v-for="i in hot" :key="i.id">{{ i.name }}</li>
    </ul>
    <result :queryUrl="url"></result>

  </div>
</template>

<script>
import DataSource from './DataSource'
import CityPop from './CityPop'
import Result from './Job'
import JobType from './JobType'

export default {
  data() {
    return {
      job_type_selected: [],
      allSelected: false,
      indeterminate: false,

      url: '',
      hot: null,
      sou1: '职位',
      query: {
        jl: '', //地点
        kw: '', //关键字默认属于'职位名'
        sm: 0,
        //p: 1,     //页码
        sf: 0,
        st: 99999,
        kt: 2, //当关键字属于'公司名'
        isadv: 1 //...
      },
      placeholder: '请输入关键词,例如:JAVA,销售代表,行政助理等',
      selected: [],
      citysDialog: function(id, arg) {
        // ①在 data 中定义一个函数资料citysDialog,此资料可以使用 import 中包含的对象的方法.(在methods,computed中都使用不符合格式)
        return DataSource.City.getSheng(id, arg) //在 render ? 的时候就去取数据
      },
      city: DataSource.City.getHotCity(),
      sheng: DataSource.City.getSheng(489) //489,548,
    }
  },
  components: {
    DataSource,
    CityPop,
    Result,
    JobType
  },
  computed: {
    getDiDian: {
      get: function() {
        if (this.selected.length == 0) return ''
        var r = []
        for (var i = 0; i < this.selected.length; i++) {
          for (var j = 0; j < this.city.length; j++) {
            if (this.city[j].value == this.selected[i]) {
              r.push(this.city[j].text)
              break
            }
          }
        }
        this.query.jl = ''
        for (i = 0; i < r.length; i++) {
          this.query.jl += r[i] + '+'
        }
        if (r.length > 0) this.query.jl = this.query.jl.slice(0, -1)
        return this.query.jl
      },
      set: function() {}
    }
  },
  methods: {
    loadPage: function() {
      var href = 'http://sou.zhaopin.com/'
      this.url = href
      let self = this
      $.get(href, function(html) {
        var dom = $(html)
        self.hot = []
        dom.find('.search_topcontent_main a').each(function() {
          var i = { name: $(this).text(), href: $(this).attr('href') }
          self.hot.push(i)
        })
      })
    },
    fun1(placeholder) {
      //&p=1&kt=2&isadv=0 公司名
      //& p=1 & isadv=0	职位
      this.sou1 = event.target.text
      this.placeholder = placeholder
    },
    onSubmit() {
      //http://sou.zhaopin.com/jobs/searchresult.ashx?jl=%E5%B9%BF%E5%B7%9E&kw=asp.net&sm=0&p=1&sf=0&st=99999&isadv=1
      var params = {
        jl: this.getDiDian,
        kw: this.query.kw,
        sm: this.query.sm,
        //p: this.query.p,
        sf: this.query.sf,
        st: this.query.st,
        isadv: this.query.isadv
      }
      this.url =
        'http://sou.zhaopin.com/jobs/searchresult.ashx?' + $.param(params)
    },
    jobTypesListener: function(v) {
      this.job_type_selected = v
    }
  },
  created() {
    //this.loadPage()
  },
  mounted() {},
  updated() {}
}
</script>

<style>
.list-inline li {
  /*box-shadow: 1px 1px 5px #000;*/
  line-height: 2;
}

#btn1:after {
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 0.255em;
  vertical-align: 0.255em;
  content: '';
  border-top: 0.3em solid;
  border-right: 0.3em solid transparent;
  border-bottom: 0;
  border-left: 0.3em solid transparent;
}

.modal-body {
  overflow-y: auto;
  max-height: calc(95vh - 70px);
}

.modal-lg {
  max-width: calc(95vw);
}

#table-job td {
  padding-top: 0;
  padding-bottom: 1px;
  border: none;
}

@media screen and (orientation: landscape) {
  .popover-body {
    max-height: calc(15vw);
    overflow-y: auto;
  }
}

@media screen and (orientation: landscape) and (min-width: 500px) {
  .popover {
    max-width: calc(40vw);
  }

  .popover-body {
    overflow-y: auto;
    min-width: calc(40vw);
    overflow: hidden;
  }
}

@media screen and (orientation: landscape) and (min-width: 1000px) {
  .popover {
    max-width: calc(40vw);
  }

  .popover-body {
    overflow-y: auto;
    min-width: calc(40vw);
    overflow: hidden;
  }
}

@media screen and (orientation: landscape) and (min-width: 2000px) {
  .popover {
    max-width: calc(50vw);
  }

  .popover-body {
    overflow-y: auto;
    min-width: calc(50vw);
    overflow: hidden;
  }
}

@media screen and (orientation: portrait) and (min-height: 500px) {
  .popover-body {
    max-height: calc(50vw);
    overflow-y: auto;
  }
}

@media screen and (orientation: portrait) and (min-height: 1000px) {
  .popover-body {
    max-height: calc(60vw);
    overflow-y: auto;
    overflow-x: hidden;
  }
}

@media screen and (orientation: portrait) and (min-height: 1500px) {
  .popover-body {
    max-height: calc(80vw);
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
