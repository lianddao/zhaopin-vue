<template>

  <div class="container">
    <b-form class="search">
      <!-- 输入关键字 -->
      <b-input-group class="mb-3">
        <b-dropdown :text="sou1" variant="outline-secondary" slot="prepend">
          <b-dropdown-item @click="fun1('请输入关键词,例如:JAVA,销售代表,行政助理等')">职位</b-dropdown-item>
          <b-dropdown-item @click="fun1('请输入公司名称或关键词,例如:联想,华为等')">公司</b-dropdown-item>
        </b-dropdown>
        <b-form-input required :placeholder="placeholder" v-model="query.kw"></b-form-input>
      </b-input-group>

      <!-- 工作地点 -->
      <b-input-group class="mb-3">
        <b-input-group-prepend>
          <b-btn class="btn1" variant="outline-info" v-b-modal.modal-city>全国</b-btn>
        </b-input-group-prepend>
        <b-form-input v-model="cityName"></b-form-input>
      </b-input-group>

      <!-- 职位类别 -->
      <b-input-group class="mb-3">
        <b-input-group-prepend>
          <b-btn class="btn1" variant="outline-info" v-b-modal.modal-zhiwei>职位类别</b-btn>
        </b-input-group-prepend>
        <b-form-input v-model="zhiWei.name" disabled></b-form-input>
      </b-input-group>

      <!-- 行业类别 -->
      <b-input-group class="mb-3">
        <b-input-group-prepend>
          <b-btn class="btn1" variant="outline-info" v-b-modal.modal-hangye>行业类别</b-btn>
        </b-input-group-prepend>
        <b-form-input v-model="hangYe.name" disabled></b-form-input>
      </b-input-group>

      <!-- 工作经验 -->
      <b-input-group class="mb-3">
        <b-input-group-prepend>
          <b-btn class="btn1" variant="outline-info" v-b-modal.modal-jingyan>工作经验</b-btn>
        </b-input-group-prepend>
        <b-form-input v-model="jingYan.name" disabled></b-form-input>
      </b-input-group>

      <!-- 学历要求 -->
      <b-input-group class="mb-3">
        <b-input-group-prepend>
          <b-btn class="btn1" variant="outline-info" v-b-modal.modal-xueli>学历要求</b-btn>
        </b-input-group-prepend>
        <b-form-input v-model="xueLi.name" disabled></b-form-input>
      </b-input-group>

      <b-button type="button" variant="primary" @click="onSubmit">搜索工作</b-button>
    </b-form>

    <!-- 选择城市Modal -->
    <b-modal id="modal-city" centered size="lg" title="选择地区" hide-footer>
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
    <b-modal id="modal-zhiwei" centered size="lg" title="选择职位" hide-footer>
      <zhi-wei v-on:输出值="onZhiWeiSelected"></zhi-wei>
    </b-modal>

    <!-- 选择行业Modal -->
    <b-modal id="modal-hangye" centered title="选择行业" hide-footer>
      <hang-ye v-on:选择行业="onHangYeSelected"></hang-ye>
    </b-modal>

    <!-- 选择工作经验Modal -->
    <b-modal id="modal-jingyan" centered title="选择工作经验" hide-footer>
      <jing-yan v-on:选择工作经验="onJingYanSelected"></jing-yan>
    </b-modal>

    <!-- 选择学历要求Modal -->
    <b-modal id="modal-xueli" centered title="选择学历要求" hide-footer>
      <xue-li v-on:选择学历要求="onXueLiSelected"></xue-li>
    </b-modal>

    <!--  搜索结果 -->
    <search-result :SearchUrl="default_ur" style="margin-top:25px"></search-result>

  </div>
</template>

<script>
import DataSource from './_DataSource'
import ZhiWei from './JobSearchChildren/ZhiWeiSelector'
import HangYe from './JobSearchChildren/HangYeSelector'
import JingYan from './JobSearchChildren/JingYanSelector'
import XueLi from './JobSearchChildren/XueLiSelector'
import SearchResult from './JobSearchChildren/SearchResult'
import Tool from './_Tool'

export default {
  data() {
    return {
      // 该值是智联招聘的高级搜索页地址.可从中获取'工作地点'的初始值
      default_ur: 'http://sou.zhaopin.com/jobs/searchresult.ashx?isadv=1',
      default_city: '',
      default_job_list: null,
      current_page: 1,

      xueLi: { id: null, name: '不限' },
      jingYan: { id: null, name: '不限' },
      hangYe: { id: null, name: '不限' },
      zhiWei: { id: null, name: '不限' },
      allSelected: false,
      indeterminate: false,

      hot: null,
      sou1: '职位',
      query: {
        in: '', //行业类别
        bj: '', //职位大分类
        sj: '', //职位小分类,用 ; 隔开
        jl: '广州', //地点
        kw: '', //关键字默认属于'职位名'
        sm: 0,
        p: 1, //页码
        sf: 0,
        st: 99999,
        kt: 2, //当关键字属于'公司名'
        we: '', //工作经验
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
    ZhiWei,
    HangYe,
    JingYan,
    XueLi,
    SearchResult,
    Tool
  },
  computed: {
    // 工作地点
    cityName: {
      get() {
        if (this.selected.length == 0) return this.default_city
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
      set() {}
    }
  },
  methods: {
    // 加载高级搜索页
    loadDefaultUrl: function() {
      $.get(this.default_ur, html => {
        var dom = $(html)
        this.default_ur = Tool.HtmlFormat.findDefaultUrl(dom)
        this.default_city = dom.find('#JobLocation').val()
      })
    },

    fun1(placeholder) {
      //&p=1&kt=2&isadv=0 公司名
      //& p=1 & isadv=0	职位
      this.sou1 = event.target.text
      this.placeholder = placeholder
    },

    onPagination: function() {},

    // 提交搜索
    onSubmit() {
      //http://sou.zhaopin.com/jobs/searchresult.ashx?jl=%E5%B9%BF%E5%B7%9E&kw=asp.net&sm=0&p=1&sf=0&st=99999&isadv=1
      var params = {
        in: null,
        bj: null,
        sj: null,
        jl: this.query.jl,
        sm: this.query.sm,
        kw: null,
        // p: this.query.p,
        we: null,
        el: null // 学历
      }

      // 职位类别
      if (this.zhiWei.id != null) {
        params.bj = this.zhiWei.id
        if (this.zhiWei.child != undefined)
          params.sj = this.zhiWei.child.toString().replace(/,/g, ';')
        else delete params['sj']
      } else {
        delete params['bj']
        delete params['sj']
      }

      // 行业类别
      if (this.hangYe.id != null) {
        params.in = this.hangYe.id.toString().replace(/,/g, ';')
      } else {
        delete params['in']
      }

      // 工作经验
      if (this.jingYan.id != null) {
        params.we = this.jingYan.id.toString().replace(/,/g, ';')
      } else {
        delete params['we']
      }

      // 学历要求
      if (this.xueLi.id != null) {
        params.el = this.xueLi.id.toString().replace(/,/g, ';')
      } else {
        delete params['el']
      }

      // 关键字
      if (this.query.kw.trim().length > 0) {
        params.kw = this.query.kw
      } else {
        delete params['kw']
      }

      var query = $.param(params)
      this.default_ur = 'http://sou.zhaopin.com/jobs/searchresult.ashx?' + query
      console.log(this.default_ur)
    },

    onZhiWeiSelected: function(v) {
      this.zhiWei = v
    },
    onHangYeSelected: function(v) {
      this.hangYe = v
    },
    onJingYanSelected: function(v) {
      this.jingYan = v
    },
    onXueLiSelected: function(v) {
      this.xueLi = v
    }
  },
  created() {
    // this.loadPage()
    this.loadDefaultUrl()
  },
  mounted() {},
  updated() {}
}
</script>

<style>
.list-inline li {
  line-height: 2;
}

.btn1:after {
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

input[type='text'][disabled='disabled'] {
  background-color: inherit;
}
</style>
