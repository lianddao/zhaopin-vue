<template>
  <div class="container">
    <h2>{{ h2 }}</h2>
    <h6>{{ h6 }}</h6>
    <div class="row">
      <div class="col-sm-6 col-md-4"><span>职位月薪：</span><strong>8001-10000元/月&nbsp;</strong></div>
      <div class="col-sm-6 col-md-4"><span>工作地点：</span><strong><a target="_blank" href="http://www.zhaopin.com/zhengzhou/">郑州</a></strong></div>
      <div class="col-sm-6 col-md-4"><span>发布日期：</span><strong><span id="span4freshdate">最新</span></strong></div>
      <div class="col-sm-6 col-md-4"><span>工作性质：</span><strong>全职</strong></div>
      <div class="col-sm-6 col-md-4"><span>工作经验：</span><strong>3-5年</strong></div>
      <div class="col-sm-6 col-md-4"><span>最低学历：</span><strong>大专</strong></div>
      <div class="col-sm-6 col-md-4"><span>招聘人数：</span><strong>8人 </strong></div>
      <div class="col-sm-6 col-md-4"><span>职位类别：</span><strong><a target="_blank" href="//jobs.zhaopin.com/zhengzhou/sj045/">软件工程师</a></strong></div>
    </div>
    <JobInfoDetail :attr="detail" />
    <pre>{{ getUrl }}</pre>
  </div>
</template>

<script>
  import JobInfoDetail from './JobInfoDetail'

  export default {
    data() {
      return {
        url: '',
        h2: '',
        h6: '',
        detail: {
          t1: '',
          t2: ''
        }
      }
    },
    components: {
      JobInfoDetail
      //'xxxxx': {
      //  //template: '<h1>{{ title }}</h1>',
      //  render: function () {
      //    debugger
      //    return document.getElementById('card').outerHTML
      //  },
      //  data() {
      //    return {
      //      title: 'TTTTTTTTTTTTTTTTTTT'
      //    }
      //  }
      //}
    },
    methods: {
      loadPage: function () {
        let self = this
        if (this.getUrl == undefined) {  //与 updated 相呼应,如果为undefined就不执行获取,否则就控制了每次获取的都是最新的 url 的结果.
          console.log('处于前进或后退,不取数据')
        } else {
          $.get(this.getUrl, function (html) {
            var dom = $(html);
            dom.find('.see-map, #applyVacButton1').remove()
            self.h2 = dom.find('.fl h1').text()
            self.h6 = dom.find('.fl h2').text()
            dom = dom.find('.tab-cont-box')
            self.detail.t1 = dom.find('.tab-inner-cont').eq(0).html()
            self.detail.t2 = dom.find('.tab-inner-cont').eq(1).html()
          })
        }
      }
    },
    computed: {
      getUrl: function () {
        return this.$route.query.url
      }
    },
    created() {
      this.url = this.$route.query.url
    },
    mounted: function () {
      this.loadPage()
    },
    updated: function () {  //updated在第二次之后重复该页时(例如后退了再前进)都会执行,因为vue已被缓存
      this.url = this.$route.query.url  //由于页面的跳转,在这里每次都更新 data 的值
      this.loadPage()
    },
  }


  //var Vue = require('vue').default;
  ////Vue.component('test', {
  ////  template: '<div class="container"><div class="topBar">这个地方在渲染后不会被占用</div><slot></slot></div>'
  ////});

  //// 注册
  //Vue.component('my-component', {
  //  template: '<div>{{xiaoxi}}A custom component!</div>'
  //})

  //// 创建一个根实例
  //new Vue({
  //  el: '#example',
  //  data: {
  //    xiaoxi:'基于 vue 组件是缓存的工作原理,可以推出以下一组经验之谈:'
  //  }
  //})


  /*
  基于 vue 组件是缓存的工作原理,可以推出以下一组经验之谈:
  ①在 computed 中定义一个需要监控发生变化的变量 url 的方法 getUrl
  ②在 template 中使用的 getUrl 会受到 updated 的监控
  ③updated 会在变量的值发生变化(如前进后退)后执行,监控的值 url 一般变现为在 'undefined' 或 '实际值' 之间的转变.
  ④在 updated 中就可以处理 页面/组件 在 后退/前进 时的'数据不是最新值问题'
  */
</script>

<style scoped>

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
