<template>
  <div>
    <b-form-group>

      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <div class="input-group-text">
            <b-form-checkbox v-model="allSelected" :indeterminate="indeterminate" @change="toggleAll"></b-form-checkbox>
          </div>
        </div>
        <input type="text" class="form-control link-popover" readonly :value="data.id + ','+ data.name" :id="'selector' + data.id" @click="sync_1">
      </div>

      <b-popover ref="popover" :target="'selector' + data.id" placement="rightbottom|bottom">

        <!-- 要实现 indeterminate 效果,必须使用局限性的数据格式 {text, value} .不区分顺序, {value, text} 亦可 -->
        <!-- 实现之 1 -->
        <b-form-checkbox-group stacked v-model="selected" @change="click_2">
          <table class="table">
            <tr class="row">
              <td v-for="i in dataset" class="col-6 col-sm-6 col-md-4">
                <b-form-checkbox :value="i.value" :key="i.value">
                  {{ i.value + ','+ i.text }}
                </b-form-checkbox>
              </td>
            </tr>
          </table>
        </b-form-checkbox-group>

        <!-- 实现之 2: -->
        <!--<b-form-checkbox-group stacked v-model="selected" :options="dataset" class="ml-4" @change="click_2"></b-form-checkbox-group>-->

      </b-popover>

    </b-form-group>

  </div>
</template>


<script>
  import DataSource from '../DataSource'

  export default {
    data() {
      return {
        dataset: this.childrens,       //①:dataset: this.getChildrens 无效.要在 created 中赋值.(因为: vue组件在其声明周期的 data 部分时并没有获得界面,所以没有界面的呈现)
        selected: [],
        allSelected: false,
        indeterminate: false
      }
    },
    components: {
      DataSource
    },
    props: ['data', 'chosen'],
    created: function () {
      this.dataset = this.getChildrens
    },
    computed: {
      getChildrens: function () {
        var r = []
        var arr = DataSource.JobType.getSubJobTypes(this.data.id)
        for (var i = 0; i < arr.length; i++) {
          r.push({ text: arr[i].name, value: arr[i].id }) //②经验证,必须使用 {text,value} 格式的数据,'具有 indeterminate 特性的多选框组'才会正常生效
        }
        return r
      }
    },
    methods: {
      toggleAll(checked) {
        if (checked) {
          var r = []
          for (var i = 0; i < this.dataset.length; i++) {
            r.push(this.dataset[i].value)
          }
          this.selected = r   //全选
        } else {
          this.selected = []  //全不选
        }
        this.$emit('切换', this.data.id, checked)
      },
      sync_1: function () {
        //this.$parent.showOnlyOne(this.data.id)
        this.$emit('弹出框控制', this.data.id) //向父组件输出全选时的值 this.data.id
      },
      click_2: function () {
        /* 由于 checkbox 事件和 this.selected 不同步的特殊性
         * 所以不能简单地传递 this.allSelected 和 this.selected
         * */
        var allSelected = false
        var selected = this.selected.slice()
        if (event.currentTarget.checked) {
          selected.push(event.currentTarget.value)
          if (selected.length == this.dataset.length) allSelected = true
        } else {
          allSelected = event.currentTarget.checked && this.dataset.length == this.selected.length
          if (!allSelected) {
            var p = selected.indexOf(event.currentTarget.value)
            selected.splice(p, 1)
          }
        }

        var arg = {
          id: this.data.id,
          currentTargetId: event.currentTarget.value,
          selected: selected,
          allSelected: allSelected
        }
        console.log(arg)
        this.$emit('选择孩子项', arg)  //向父组件输出孩子项的参考值
      },
      clear: function () {
        this.selected = []
        this.allSelected = false
        this.indeterminate = false
      }
    },
    watch: {
      selected(newVal, oldVal) {      //与绑定的资料名称相同,它监听某个资料的变化.这里为selected
        if (newVal.length === 0) {
          this.indeterminate = false
          this.allSelected = false
        } else if (newVal.length === this.dataset.length) {
          this.indeterminate = false
          this.allSelected = true
        } else {
          this.indeterminate = true
          this.allSelected = false
        }
      }
    }
  }

</script>
