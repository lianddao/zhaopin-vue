<template>
  <div v-if="show">
    <h1>搜索结果:(第{{ current }}页)</h1>
    <ul class="pagination">
      <li v-for="p in pages">
        <a v-if="p.disabled" class="active">{{ p.text }}</a>
        <a v-else @click="loadPage(p.index)" :title="p.href">{{ p.text }}</a>
      </li>
    </ul>
    <div class="table-responsive">
      <!--需要搭配表格文字内容不换行 white-space: nowrap-->
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">≡</th>
            <th scope="col">职位名称</th>
            <th scope="col">公司名称</th>
            <th scope="col">职位月薪</th>
            <th scope="col">工作地点</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataSource" v-on:click="nav(item.链接)">
            <th scope="row">≡</th>
            <td>{{ item.名称 }}</td>
            <td>{{ item.地址 }}</td>
            <td>{{ item.工资 }}</td>
            <td>{{ item.地点 }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <ul class="pagination">
      <li v-for="p in pages">
        <a v-if="p.disabled" class="active">{{ p.text }}</a>
        <a v-else @click="loadPage(p.index)" :title="p.href">{{ p.text }}</a>
      </li>
    </ul>
    <pre>{{ url }}</pre>
    <pre style="margin-top:50px; height:500px">{{ dataSource }}</pre>
  </div>
</template>

<script>
export default {
  name: 'job',
  data() {
    return {
      show: true,
      url: '',
      current: -1,
      dataSource: null,
      pages: [
        {
          index: -1,
          text: '',
          href: '',
          disabled: false
        }
      ] //这样写的目的是在定义的时候显式描述pages的结构,它可以省略为 pages:[]
    }
  },
  props: ['queryUrl', 'html'],
  watch: {
    queryUrl: function(newVal, oldVal) {
      console.log('Prop changed: ', newVal, ' | was: ', oldVal)
      this.loadPage((this.current = 1))
    }
  },
  methods: {
    loadPage: function(n) {
      if (this.queryUrl != undefined && this.queryUrl.length > 0) {
        var href = this.queryUrl + '&p=' + n
        this.show = true
      } else {
        var href =
          'http://sou.zhaopin.com/jobs/searchresult.ashx?sj=45&jl=489&sg=6d0b192c710d46a2a39a9f139c5f805d&p=' +
          n
        console.log('不加载默认数据')
        this.show = false
        return
      }

      this.url = href
      $.get(href, html => {
        console.log('获取网页' + href)
        let self = this
        var dom = $(html)

        //② 取得所有行数据，加入rows中
        var rows = []
        dom
          .find('#newlist_list_content_table .newlist:not(:first)')
          .each(function() {
            //① 取得1行数据，加入cols中
            var cols = []
            $(this)
              .find('td')
              .not('.gxsj, .fk_lv')
              .each(function(i) {
                var j = '',
                  v = $.trim($(this).text())
                switch (i) {
                  case 0:
                    j = '"名称":"' + v + '"'
                    j +=
                      ',"链接":"' +
                      $(this)
                        .find('a:first')
                        .attr('href') +
                      '"'
                    break
                  case 1:
                    j = '"地址":"' + v + '"'
                    break
                  case 2:
                    j = '"工资":"' + v + '"'
                    break
                  case 3:
                    j = '"地点":"' + v + '"'
                    break
                  case 4:
                    j = '"描述":"' + v + '"'
                    break
                }
                cols.push(j)
              })
            //①

            var temp1 = '{' + cols.toString() + '}' //这是string，采用它
            temp1 = replaceUnknown(temp1) //处理未知字符

            rows.push(temp1)
          })
        //②

        var _json1 = '[' + rows.toString() + ']' //这是string，不具有格式化显示
        var _json2 = JSON.parse(_json1) //这是object，具有格式化显示，采用它
        self.dataSource = _json2

        self.current = parseInt(n)

        //③ 取分页值
        self.pages.length = 0
        dom.find(".pagesDown a:not('.nopress, .nopress2')").each(function(i) {
          //过滤掉第一页和最后一页时的'上一页'和'下一页'按钮
          var item = $(this)
          var index,
            disabled = false
          if (item.is('.current')) {
            disabled = true
          }
          if (item.is('.pagesmore')) {
            index = item.attr('href').split('&p=')[1] //取出...的实际页码
          } else if (item.is('.next-page')) {
            index = self.current + 1
          } else if (item.is('.pre-page')) {
            index = self.current - 1
          } else {
            index = item.text()
          }
          self.pages.push({
            index: index,
            text: item.text(),
            href: item.attr('href'),
            disabled: disabled
          })
        })
        //③
      })
    },
    nav: function(url) {
      this.$router.push({ name: '职位详情', query: { url: url } })
    }
  },
  mounted() {
    this.loadPage((this.current = 1))
  }
}

//递归处理JSON中未知的字符，附带将反斜杠\转换为使用 uubd 打出的反斜杠＼
function replaceUnknown(json) {
  //必须首先替换反斜杠\，否则下面的 JSON.parse(temp) 的 catch 中捕获的的 errorChar 竟是紧接反斜杠后面的那个字符
  if (json.indexOf('\\') != -1) {
    //json = json.replace(/\\/g, String.fromCharCode(30)) 不能识别
    json = json.replace(/\\/g, '＼') //我使用 uubd 打出的反斜杠替换之
  }

  var temp = json
  var ok = true
  try {
    temp = JSON.parse(temp)
  } catch (ex) {
    ok = false
    //console.log(ex.message)
    var n = ex.message.search(/Unexpected token .* in JSON at position \d+/) //如果发生的错误匹配这种格式
    if (n == 0) {
      var arr = ex.message.split(' ')
      if (temp.charAt(arr[7] - 1) === '"') {
        //处理双引号非成对出现,格式例如 Unexpected token 字 in JSON at position 999
        var i = arr[7]
        var j = temp.substring(0, i).lastIndexOf('"')
        var a = temp.substring(0, j)
        var b = temp.substring(j + 1)
        json = a + b
      } else {
        var errorChar = arr[2]
        //console.log('出错：\n' + temp + '\n' + '出错字符为：' + errorChar)
        var re = new RegExp(errorChar, 'g')
        json = temp.replace(re, ' ') //把其他未知字符替换为空格(常见,已收集出现的有①空白字符 ②特殊字符),格式例如 Unexpected token \ in JSON at position 999
      }
    }
  } finally {
    if (!ok) {
      replaceUnknown(json)
    }
  }
  return json
}
</script>

<style>
/*表格*/

.table th,
.table td {
  text-align: left;
  /*box-shadow: 2px 2px 8px #ddd;*/
  /*white-space: nowrap 注释以取消响应式表格*/
}
</style>

<style>
/*分页*/
ul.pagination {
  display: inline-block;
  padding: 0;
  margin: 20px 0;
}

ul.pagination li {
  display: inline;
}

ul.pagination li a {
  color: black;
  float: left;
  padding: 8px 16px;
  text-decoration: none;
  transition: background-color 0.3s;
  border: 1px solid #ddd;
  cursor: pointer;
}

.pagination li:first-child a {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

.pagination li:last-child a {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

ul.pagination li a.active {
  background-color: #4caf50;
  color: white;
  border: 1px solid #4caf50;
  cursor: not-allowed;
}

ul.pagination li a:hover:not(.active) {
  background-color: #ddd;
}
</style>
