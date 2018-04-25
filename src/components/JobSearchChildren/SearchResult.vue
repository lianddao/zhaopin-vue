// 搜索结果
<template>
  <div v-if="total_count > 0">
    <b-pagination size="md" :limit="limit" :total-rows="total_count > 5400 ? 5400 : total_count" v-model="currentPage" :per-page="pageSize" @change="onPageChange"></b-pagination>
    <b-tabs id="tabListView">
      <b-tab title="默认顺序" active>
        <b-table stacked="sm" :items="items" :fields="fields" caption-top>
          <template slot="table-caption">
            共
            <label style="color:red">{{ total_count }}</label>个职位满足条件</template>
          <template slot="show_details" slot-scope="row">
            <b-button size="sm" @click.stop="row.toggleDetails" class="mr-2">
              {{ row.detailsShowing ? '▼' : '▲'}}
            </b-button>
          </template>
          <template slot="row-details" slot-scope="row">
            <b-card v-html="row.item.详情">
            </b-card>
          </template>
        </b-table>
      </b-tab>
      <b-tab title=" 相关度 " disabled>
      </b-tab>
      <b-tab title="首发日 " disabled>
      </b-tab>
    </b-tabs>
    <b-pagination size="md" :limit="limit" :total-rows="total_count > 5400 ? 5400 : total_count" v-model="currentPage" :per-page="pageSize" @change="onPageChange"></b-pagination>
  </div>
</template>

<script>
import Tool from '../_Tool'

export default {
  data: function() {
    return {
      fields: [
        '职位名称',
        '公司名称',
        '职位月薪',
        { key: 'show_details', label: '详情' }
      ],

      limit: 11,
      pageSize: 60,
      currentPage: 1,
      items: null,
      total_count: 0
    }
  },
  components: { Tool },
  props: ['SearchUrl'],
  methods: {
    onPageChange: function(p) {
      var url =
        this.SearchUrl.slice(0, this.SearchUrl.lastIndexOf('p=')) + 'p=' + p
      $.get(url, html => {
        var dom = $(html)
        this.items = Tool.HtmlFormat.findListData(dom)
        // total_count 不改变
      })
    }
  },
  watch: {
    SearchUrl: function(newVal, oldVal) {
      $.get(this.SearchUrl, html => {
        var dom = $(html)
        this.items = Tool.HtmlFormat.findListData(dom)
        this.total_count = Tool.HtmlFormat.findRecordCount(dom)
      })
    }
  }
}
</script>

<style>
/* 详情的样式暂不处理 */
</style>
