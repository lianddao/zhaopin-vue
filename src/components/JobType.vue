<template>
  <div>
    <!--<pre>已选择 {{ selected_1 }} , {{ selected_2 }}</pre>-->
    <table id="table-job" class="table" v-for="i in labels">
      <tr>
        <th>{{ i.name }}</th>
      </tr>
      <tr class="row">
        <td v-for="j in types(i.id)" class="col-12 col-sm-6 col-md-4 col-lg-3">
          <selector :data="j" ref="jobselector"
                    v-on:切换="onSwitch"
                    v-on:弹出框控制="showOnlyOne"
                    v-on:选择孩子项="onChildSelected"></selector>
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
        types: function (id) {
          return DataSource.JobType.getJobTypes(id)
        },
        getSubTypes: function (pid) {
          return DataSource.JobType.getSubJobTypes(pid)
        },
        selected_1: [],   //②当 selected_2 为全选时,只需要保留 selected_1 的值,不关注 selected_2 的值
        selected_2: [],   //②当 selected_2 不为全选时,不关注 selected_1 的值
        newActiveId: '',
      }
    },
    props: ['out'],
    computed: {
    },
    created: function () {
    },
    methods: {
      onSwitch(id, checked) {
        console.log('父组件听到切换', this.data)
        //清空之前选择的组

        debugger
        if (checked) {
          var oldId = this.selected_1.shift()
          this.selected_1.push(id)
          this.$emit('输出值', this.selected_1)  //向父组件输出 this.selected_1
          if (oldId != undefined && this.selected_2.length == 0) {
            var oldComponent = this.$refs.jobselector.find(child => { //查找指定的子组件后更新状态
              return child.$props.data.id == oldId
            })
            oldComponent.clear()
          }
          else {
            debugger
          }
        }
        else {
          this.selected_1 = []
          this.selected_2 = []
          this.$emit('输出值', [])  //向父组件输出,此时为全不选
        }
      },  //监听子组件的全选切换操作

      showOnlyOne(id) {
        if ($('.popover:visible').length == 1) {
          if (id === this.newActiveId) {
            this.popoverActived = false //点击同一个选择条
          } else {
            this.$root.$emit('bv::hide::popover')
            this.newActiveId = id
            this.popoverActived = true  //点击不同的选择条,控制只显示一个Popover
          }
        } else {
          this.newActiveId = id
          this.popoverActived = true    //第一次或之后点开一个Popover
        }
      },  //监听子组件,以控制只弹出一个Popover

      onChildSelected(arg) {
        if (arg.selected.length == 0) {
          console.log('c')
          this.selected_2 = []
        } else {
          if (arg.allSelected) {
            this.selected_1.push(arg.id)      //②
            this.selected_2 = []              //②
            this.$emit('输出值', this.selected_1)
            console.log('a')
          } else {
            if (this.selected_1.length == 1 && arg.selected.length > 0) {
              //console.log('当前选取 = ' + this.selected_1)
              //console.log(arg)

              //if (this.selected_1[0] == arg.id) {
              //  var i = this.$refs.jobselector.find(child => {
              //    return child.$props.data.id == this.selected_1[0]
              //  })
              //  debugger
              //  var j = i.find(child => {
              //    console.log(child)
              //    debugger
              //    return true
              //  })
              //  oldComponent.clear()
              //}
              //else {
              //  debugger
              //}
            }
            this.selected_1 = []              //②
            this.selected_2 = arg.selected    //②
            this.$emit('输出值', arg)
          }
        }
      } //选择孩子项,同步最终的选择值
    },
    components: { DataSource, Selector }
  }

</script>

<style>
</style>
