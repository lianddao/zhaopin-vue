// 学历要求
<template>
    <div>
        <b-list-group>
            <b-list-group-item v-for="i in dataset" :key="i.id">
                <b-form-checkbox :disabled="selected.length > 4 && selected.indexOf(i.id) === -1" :value="i.id" v-model="selected">
                    {{i.id +','+ i.name }}
                </b-form-checkbox>
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
import DataSource from '../DataSource'

export default {
  data: function() {
    return {
      dataset: DataSource.XueLi.getXueLi(),
      selected: [],
      getName: function(id) {
        return DataSource.XueLi.getName(id)
      }
    }
  },
  components: {
    DataSource
  },
  watch: {
    selected: function(newVal) {
      var name = ''
      for (var i = 0; i < newVal.length; i++) {
        name += this.getName(newVal[i]) + '+'
      }
      if (name.length == 0) {
        this.$emit('选择学历要求', { id: null, name: '不限' })
      } else {
        this.$emit('选择学历要求', { id: newVal, name: name.slice(0, -1) })
      }
    }
  }
}
</script>

<style>

</style>
