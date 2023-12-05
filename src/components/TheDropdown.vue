<template>
  <div class="row">
    <div class="col-12 label">
      <label :for="type">{{ labels[type][lang] }}</label>
    </div>
  </div>
  <div class="row">
    <div class="col-12">
      <div class="select-div">
        <select :name="type" :id="type">
          <option v-for="(selection, index) in selectionKeys" :value="selection" :key="index" :selected="isSelected(selection)">
            <span v-if="type === 'arrangement' && selection === 'firstName'">{{ labels.none[lang] }}</span>
            <span v-else>{{ selections[selection][lang] }}</span>
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import labels from "../data/labels.json";
import selections from "../data/selections.json";

export default {
  props: ["type", "lang"],
  data() {
    return {
      labels: labels,
      selections: selections,
    };
  },
  computed: {
    selectionKeys() {
      return Object.keys(selections);
    }
  },
  methods: {
    isSelected(selection) {
      if (this.type === "arrangement") {
        return selection === "faction" ? true : false
      } else {
        return selection === "party" ? true : false
      }
    }
  }
};
</script>

<style scoped>
.label {
  font-size: 1.1rem;
  font-weight: bold;
}

.select-div select {
  font-size: 0.9rem;
}
</style>
