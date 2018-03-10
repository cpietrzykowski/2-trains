<template>
  <div id="api-config">
    <form v-on:submit.prevent>
      <div>A <a href="https://developers.google.com/maps/documentation/javascript/get-api-key">Google Maps Javascript API Key</a> is required. Ensure that the following libraries are authorised: <code>{{ libraries.join(',') }}</code></div>
      <label>API Key:
          <input v-model="key" name="key" type="text" />
      </label>
      <button v-on:click="boot" v-bind:disabled="key.length == 0">Boot</button>
    </form>
  </div>
</template>

<script>
import load from '../google-maps';

export default {
  name: 'ApiConfig',
  data() {
    return {
      disabled: false,
      key: this.defaultKey,
    };
  },
  props: {
    defaultKey: { type: String, default: '' },
    libraries: {
      type: Array,
      default() {
        return ['places'];
      },
    },
  },
  methods: {
    boot() {
      const key = this.key.trim();

      if (key) {
        this.disabled = true;

        load(key, this.libraries).then((google) => {
          // google maps api is loaded
          this.$emit('ready', google);
        });
      }
    },
  },
};
</script>

<style>
#api-config {
}
</style>
