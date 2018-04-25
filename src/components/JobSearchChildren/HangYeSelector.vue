// 行业选择
<template>
  <div>
    <b-card no-body v-for="i in types" :header="'<b>'+i.name+'</b>'" :key="i.id">
      <b-list-group flush>
        <b-list-group-item v-for="j in childrens(i.id)" :key="j.id">
          <b-form-checkbox :disabled="selected.length > 9 && selected.indexOf(j.id) === -1" :value="j.id" v-model="selected">
            {{j.id +','+ j.name }}
          </b-form-checkbox>
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </div>
</template>

<script>
import DataSource from '../_DataSource'

export default {
  data: function() {
    return {
      selected: [],
      types: DataSource.HangYe.getTypes(),
      childrens: function(id) {
        return DataSource.HangYe.getChildrens(id)
      },
      getChildrenName: function(id) {
        return DataSource.HangYe.getChildrenName(id)
      }
    }
  },

  computed: {
    /* b-form-checkbox的disabled属性的值必须是一个布尔值,不接受函数的方式,所以在methods中使用 off 无效
    而在 computed 里定义的,它最终表现为一个值,这是值得注意的要点
    off: function() {
    } */
  },
  components: { DataSource },
  watch: {
    selected: function(newVal, oldVal) {
      var name = ''
      for (var i = 0; i < newVal.length; i++) {
        name += this.getChildrenName(newVal[i]) + '+'
      }
      this.$emit('选择行业', { id: newVal, name: name.slice(0, -1) })
    }
  }
}
</script>

<style scpoed>
.card {
  margin-bottom: 15px;
}
</style>
