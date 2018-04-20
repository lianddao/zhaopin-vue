<template>
  <div>
    <pre>已选择: {{ output }} </pre>
    <table id="table-job" class="table" v-for="i in labels" :key="i.id">
      <tr>
        <th>{{ i.name }}</th>
      </tr>
      <tr class="row">
        <td v-for="j in types(i.id)" class="col-12 col-sm-6 col-md-4 col-lg-3" :key="j.id">
          <selector :data="j" ref="jobselector" v-on:切换="onChangeAll" v-on:弹出框控制="showOnlyOne" v-on:选择孩子项="onChange"></selector>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import DataSource from './DataSource'
import Selector from './JobTypeChildren/JobTypeSelector'

export default {
  data() {
    return {
      labels: DataSource.JobType.getLabels(),
      types: function(id) {
        return DataSource.JobType.getJobTypes(id)
      },
      getSubTypes: function(pid) {
        return DataSource.JobType.getSubJobTypes(pid)
      },
      newActiveId: '',
      output: null,
      valueFormat: function(arg) {
        if (typeof arg == 'string') {
          var name = DataSource.JobType.getJobTypeById(id)
          return { id: arg, name: name }
        } else if (arg instanceof Array) {
          return null
        }
      }
    }
  },
  computed: {},
  created: function() {},
  methods: {
    onChangeAll(d, checked) {
      if (this.output !== null && d !== null) {
        if (this.output.id != d.id) {
          // console.log('清除前一组')
          var old = this.output
          old = this.$refs.jobselector.find(child => {
            return child.$props.data.id == old.id
          })
          old.clear()
        }
      }
      this.output = d

      this.$emit('输出值', {
        id: this.output.id,
        name: this.valueFormat(this.output.id)
      })
    }, //监听子组件的全选切换操作

    //toggleAll对A组进行全选 -> 全不选 -> toggle对B组某项进行选择:出错

    onChange(arg) {
      if (arg != null) {
        if (this.output != null && this.output.id != arg.id) {
          // console.log('组不同,清除前一组')
          var old = this.output
          old = this.$refs.jobselector.find(child => {
            return child.$props.data.id == old.id
          })
          old.clear()
        }
      }
      this.output = arg
      if (arg.isAll) {
        this.$emit('输出值', this.output.id)
      } else {
        this.$emit('输出值', this.output.selected)
      }
    }, //选择孩子项,同步最终的选择值

    valueFormat1234567(arg) {
      if (typeof arg == 'string') {
        debugger
        var arr = this.DataSource.JobType.getJobTypes(arg)

        return { value: arg, text: '' }
      } else if (arg instanceof Array) {
        debugger
      }
      return { value: [], text: '' }
    },

    showOnlyOne(id) {
      if ($('.popover:visible').length == 1) {
        if (id === this.newActiveId) {
          this.popoverActived = false //点击同一个选择条
        } else {
          this.$root.$emit('bv::hide::popover')
          this.newActiveId = id
          this.popoverActived = true //点击不同的选择条,控制只显示一个Popover
        }
      } else {
        this.newActiveId = id
        this.popoverActived = true //第一次或之后点开一个Popover
      }
    } //监听子组件,以控制只弹出一个Popover
  },
  components: { DataSource, Selector }
}
</script>

<style>

</style>
