<template>
  <div>
    <b-tabs id="tabListView">
      <b-tab title="默认顺序" active>
        <b-table stacked="sm" :items="items" :fields="fields">
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
      <b-tab title=" 相关度 ">
        <br>I'm the second tab content
      </b-tab>
      <b-tab title="首发日 ">
        <br>Disabled tab!
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      fields: [
        '职位名称',
        '公司名称',
        '职位月薪',
        '工作地点',
        { key: 'show_details', label: '详情' }
      ]
    }
  },
  props: ['items']
}
</script>

<style>

</style>
