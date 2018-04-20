<template>
  <div>
    <div class="card">
      <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs">
          <li class="nav-item">
            <a class="nav-link" @click="active(0)">职位描述</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" @click="active(1)">公司介绍</a>
          </li>
        </ul>
      </div>
      <div class="card-body" v-html="attr.t1"></div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        url: this.$route.query.url
      }
    },
    props: ['attr'],
    methods: {
      active(index) {
        $(".nav-link").removeClass('active')
        $(event.target).addClass('active')
        switch (index) {
          case 0:
            $('.card-body').html(this.attr.t1)
            break
          case 1:
            $('.card-body').html(this.attr.t2)
            break
        }
      }
    },
    mounted() {
      $('.nav-link:eq(0)').addClass('active')
    },
    updated() {
      if (this.url === this.$route.query.url) {
      } else {
        console.log('前进/后退的过程中用户选择的 url 发生了改变,tab 的位置还原默认值')
        $(".nav-link").removeClass('active')
        $('.nav-link:eq(0)').addClass('active')
      }
    }
  }
</script>
<style>
</style>
