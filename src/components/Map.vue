<template>
  <div id="map" />
</template>

<script>
export default {
  name: 'Map',
  props: ['google'],
  mounted() {
    const google = this.google;
    const defaultCoords = { lat: 0.0, lng: 0.0 };
    this.map = new google.maps.Map(this.$el, {
      center: defaultCoords,
      zoom: 8,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.BOTTOM_CENTER,
      },
      fullscreenControl: false,
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        this.map.setCenter(pos);
      });
    }

    this.$emit('ready', this.map);
  },
  created() {
    const component = this.$mount();
    document.querySelector('body').appendChild(component.$el);
  },
};
</script>

<style>
#map {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
}
</style>
