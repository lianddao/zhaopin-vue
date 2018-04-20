<template>
  <div>
    <!--<b-popover ref="popover" :target="target" placement="rightbottom|bottom">
      <b-form-checkbox-group :id="'fl_' + j.id" stacked :name="'gr' + j.id" v-model="selected_2">
        <div class="custom-control custom-checkbox" v-for="k in getSubTypes(j.id)">
          <input type="checkbox" class="custom-control-input" 
                 :value="k.id" :key="k.id" v-model="selected_2" 
                 :id="'cb_' + k.id" />
          <label class="custom-control-label" :for="'cb_' + k.id">{{ k.id + ' , ' + k.name }}</label>
        </div>
      </b-form-checkbox-group>
    </b-popover>-->
  </div>
</template>

<script>
  import DataSource from '../DataSource'

  export default {
    data: function () {
      return {

      }
    },
    Components: {
      DataSource
    },
    props: ['dataset','target']
  }
</script>
