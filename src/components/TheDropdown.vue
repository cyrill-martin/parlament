<template>
  <div class="row">
    <div class="col-12 label">
      <label :for="type">{{ labels[type][language] }}</label>
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
            >keine</span
          >
          <span v-else>{{ selections[selection][language] }}</span>
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import labels from "../data/labels.json";
import selections from "../data/selections.json";

export default {
  props: ["type", "language"],
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
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
}
.select {
  text-align: center;
}
select {
  width: 60%;
  border-radius: 4px;
  padding: 10px;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
}
</style>
