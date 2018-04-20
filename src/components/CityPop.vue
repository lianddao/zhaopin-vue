<template>
  <div>
    <ul class="list-inline row ">
      <li class="col-3 col-sm-3 col-md-2" v-for="i in sheng" :id="'x_'+i.id">
        {{ i.name }}
        <b-popover ref="popover" :target="'x_'+i.id" :title="i.name" placement="bottomright">
          <b-form-checkbox v-for="i in DataSource.genSheng(i.id)" :key="i" :value="'value'+i">
            {{ i.name }}
          </b-form-checkbox>
        </b-popover>
      </li>
    </ul>
  </div>
</template>

<script>
  import DataSource from './DataSource'

  export default {
    data: function () {
      return {
      }
    },
    components: {
      DataSource
    },
    computed: {
    },
    props: ['sheng'],
    methods: {
      Hello: function (pid) {
        var r = DataSource.genSheng(pid)
        debugger
        return r
      }
    },
    created() {
    }
  }
</script>
