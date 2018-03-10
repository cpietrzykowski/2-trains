<template>
  <div class="train-input">
    <fieldset>
      <legend>Train {{ title }}</legend>
      <form>
        <div>
          <label for="for">Origin:</label>
          <input name="from" type="text" ref="origin" />
        </div>
        <div>
          <label for="speed">Speed:</label>
          <input name="speed" type="text"
            v-on:input="$emit('speedChanged', $event.target.value)" />
        </div>

        <button type="reset">Reset</button>
      </form>
    </fieldset>
  </div>
</template>

<script>
export default {
  name: 'TrainInput',
  props: ['title', 'google', 'map', 'initialSpeed'],
  mounted() {
    const google = this.google;
    const map = this.map;
    const origin = this.$refs.origin;
    this.autocomplete = new google.maps.places.Autocomplete(origin);

    this.autocomplete.addListener('place_changed', () => this.$emit('placeChanged', this.autocomplete));
    this.autocomplete.bindTo('bounds', map);
  },
};
</script>

<style>
.train-input {
}


#train-input > div {
  display: flex;
  justify-content: center;
}

#train-input > div > div {
  display: flex;
  align-items: center;
  border-radius: 2px;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.25);
  box-shadow: 4px 4px 4px -2px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(0, 0, 0, 0.5);
}
</style>
