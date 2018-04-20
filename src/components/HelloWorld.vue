<template>
  <div>
    <b-form-group>
      <template slot="label">
        <b>Choose your flavours:</b>
        <br>
        <b-form-checkbox v-model="allSelected"
                         :indeterminate="indeterminate"
                         aria-describedby="flavours"
                         aria-controls="flavours"
                         @change="toggleAll">
          {{ allSelected ? 'Un-select All' : 'Select All' }}
        </b-form-checkbox>
      </template>
      <b-form-checkbox-group id="flavors"
                             stacked
                             v-model="selected"
                             name="flavs"
                             :options="flavours"
                             class="ml-4"
                             aria-label="Individual flavours"></b-form-checkbox-group>
    </b-form-group>


    <b-form-group>
      <template slot="label">
        <b>Choose your flavours:</b>
        <br>
        <b-form-checkbox v-model="zzz"
                         :indeterminate="asdf"
                         aria-describedby="flavours"
                         aria-controls="flavours"
                         @change="ttt">
          {{ allSelected ? 'Un-select All' : 'Select All' }}
        </b-form-checkbox>
      </template>
      <b-form-checkbox-group stacked
                             v-model="yyy"
                             name="flavs"
                             :options="xxx"
                             class="ml-4"
                             aria-label="Individual flavours"></b-form-checkbox-group>
    </b-form-group>


    <p>
      Selected: <strong>{{ selected }}</strong><br>
      All Selected: <strong>{{ allSelected }}</strong><br>
      Indeterminate: <strong>{{ indeterminate }}</strong><br>
    </p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        flavours: ['Orange', 'Grape', 'Apple', 'Lime', 'Very Berry'],
        xxx: ['1', '2', '3', '4', '5'],
        selected: [],
        yyy: [],
        allSelected: false,
        zzz: false,
        indeterminate: false,
        asdf: false
      }
    },
    methods: {
      toggleAll(checked) {
        this.selected = checked ? this.flavours.slice() : []
      },
      ttt(checked) {
        this.yyy = checked ? this.xxx.slice() : []
      }
    },
    watch: {
      selected(newVal, oldVal) {
        // Handle changes in individual flavour checkboxes
        if (newVal.length === 0) {
          this.indeterminate = false
          this.allSelected = false
        } else if (newVal.length === this.flavours.length) {
          this.indeterminate = false
          this.allSelected = true
        } else {
          this.indeterminate = true
          this.allSelected = false
        }
      },
      yyy(newVal, oldVal) {
        // Handle changes in individual flavour checkboxes
        if (newVal.length === 0) {
          this.asdf = false
          this.zzz = false
        } else if (newVal.length === this.flavours.length) {
          this.asdf = false
          this.zzz = true
        } else {
          this.asdf = true
          this.zzz = false
        }
      }
    }
  }
</script>

<!-- form-checkbox-indeterminate-2.vue -->
