<template>
  <div class="row">
    <div class="col-12 label">
      <label :for="type">{{ labels[type][lang] }}</label>
    </div>
  </div>
  <div class="row">
    <div class="col-12 select">
      <select :name="type" :id="type">
        <option
          v-for="(selection, index) in selectionKeys"
          :value="selection"
          :key="index"
        >
          <span v-if="type === 'arrangement' && selection === 'firstName'"
            >{{ labels.none[lang] }}</span
          >
          <span v-else>{{ selections[selection][lang] }}</span>
        </option>
      </select>
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
    },
  },
};
</script>

<style scoped>
.label {
  font-size: 1.1rem;
  font-weight: bold;
}
select {
  width: 100%;
  border-radius: 4px;
  padding: 8px;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  background: #e9e9e9;
}
</style>
