<template>
  <div> 
    {{ selected }}
    <b-btn v-b-toggle.collapse1>热门城市</b-btn>
    <b-collapse id="collapse1" class="mt-2">
      <table class="table">
        <tr class="row">
          <td v-for="i in hotCity" :key="i.id" class="col-4 col-sm-4 col-md-2">
            <b-form-checkbox :value="i.id" v-model="selected" :disabled="selected.length>4 && selected.indexOf(i.id) === -1">
              {{ i.name }}
            </b-form-checkbox>
          </td>
        </tr>
      </table>
    </b-collapse>

    <table class="table">
      <tr>
        <th>其他省市</th>
      </tr>

      <!-- 尝试使用事件阻止的能力做新的代码改进 -->

      <tr class="row">
        <td v-for="i in sheng" :key="i.id" class="col-6 col-sm-6 col-md-3">
          <b-form-group>

            <b-input-group>
              <b-input-group-prepend is-text>
                <b-form-checkbox slot="prepdend" v-model="selected" :value="i.id" :disabled="selected.length>4 && selected.indexOf(i.id)===-1" :indeterminate="indeterminate" @change="onChange">
                  {{i.id + ',' + i.name}}
                </b-form-checkbox>
              </b-input-group-prepend>
              <b-btn variant="info" slot="append" :id="'selector' + i.id">≡</b-btn>
            </b-input-group>

            <!-- <div class="input-group mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">
                  <b-form-checkbox v-model="selected" :value="i.id" :disabled="selected.length>4 && selected.indexOf(i.id)===-1" :indeterminate="indeterminate" @change="onChange">
                    {{i.id + ',' + i.name}}
                  </b-form-checkbox>
                </div>
              </div>
              <input type="text" class="form-control link-popover" readonly value="≡" :id="'selector' + i.id">
            </div> -->

            <b-popover ref="popover" :target="'selector' + i.id" placement="rightbottom|bottom">

              <b-form-checkbox-group stacked v-model="selected">
                <table class="table">
                  <tr class="row">
                    <td v-for="j in getChildren(i.id)" class="col-6 col-sm-6 col-md-4" :key="j.id">
                      <b-form-checkbox :value="j.value" :key="j.value" v-model="selected" :disabled="selected.length>4 && selected.indexOf(j.id) === -1">
                        {{ j.value + ','+ j.text }}
                      </b-form-checkbox>
                    </td>
                  </tr>
                </table>
              </b-form-checkbox-group>

            </b-popover>

          </b-form-group>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import DataSource from '../_DataSource'

export default {
  data: function() {
    return {
      hotCity: DataSource.City.getHotCity(),
      sheng: DataSource.City.getSheng(489),
      selected: [],
      allSelected: false,
      indeterminate: false,
      items: []
    }
  },
  computed: {},
  methods: {
    getChildren(pid) {
      var r = []
      var arr = DataSource.City.getSheng(pid)
      for (var i = 0; i < arr.length; i++) {
        r.push({ text: arr[i].name, value: arr[i].id }) //②经验证,必须使用 {text,value} 格式的数据,'具有 indeterminate 特性的多选框组'才会正常生效
      }
      return r
    },
    onChange(v) {
      console.log(v)
      event.preventDefault()
      event.stopPropagation()
    }
  },
  components: {
    DataSource
  },
  watch: {
    // selected(newVal, oldVal) {
    //   //与绑定的资料名称相同,它监听某个资料的变化.这里为selected
    //   if (newVal.length === 0) {
    //     this.indeterminate = false
    //     this.allSelected = false
    //   } else if (newVal.length === this.dataset.length) {
    //     this.indeterminate = false
    //     this.allSelected = true
    //   } else {
    //     this.indeterminate = true
    //     this.allSelected = false
    //   }
    // }
  }
}
</script>

<style>
* {
  font-size: 12px;
}
</style>
