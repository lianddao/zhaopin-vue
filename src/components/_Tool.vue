<template>

</template>

<script>
const HtmlFormat = {
  // 找出当前页的行数据
  findListData: function(dom) {
    var r = []
    dom.find('#newlist_list_div .newlist:not(:eq(0))').each(function(i, n) {
      var x = {}
      $(n)
        .find('td')
        .each(function(j, m) {
          switch (j) {
            case 0:
              var a = $(m).find('a')
              x.职位链接 = a.attr('href')
              x.职位名称 = a.text()
              break
            case 2:
              var a = $(m).find('a')
              x.公司链接 = a.attr('href')
              x.公司名称 = a.text()
              break
            case 3:
              x.职位月薪 = $(m).text()
              break
            case 4:
              x.工作地点 = $(m).text()
              break
            case 6:
              x.详情 = $(m).html()
              break
          }
        })
      r.push(x)
    })
    return r
  },

  // 找出结果总数量,不接受字符串值
  findRecordCount: function(dom) {
    return parseInt(dom.find('.search_yx_tj em').text())
  },

  /* 
  找到qid,即分页的sg参数.
  同时初始化第一页的原生链接地址
  (http://sou.zhaopin.com/jobs/searchresult.ashx?isadv=1&sg=e5e545a5a0b1429f83c0c9d1db59346d&p=1) */
  findDefaultUrl: function(dom) {
    var qid = dom.find('#qid').val()
    return (
      'http://sou.zhaopin.com/jobs/searchresult.ashx?isadv=1&sg=' + qid + '&p=1'
    )
  }
}
export default {
  HtmlFormat
}
</script>
