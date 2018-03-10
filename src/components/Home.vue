<template>
  <div id="home">
    <template v-if="google == null">
      <api-config v-on:ready="onGoogleReady" />
    </template>

    <template v-else>
      <template v-if="apiError">
        <div>{{ apiError.toString() }}</div>
        <code>Refresh the page to try continue.</code>
      </template>

      <template v-else>
        <google-map v-bind:google="google" v-on:ready="onMapReady" />
        <template v-if="map">
          <div id="train-input">
            <div>
              <train-input v-bind:google="google" v-bind:map="map"
                v-on:placeChanged="onAPlaceChanged"
                v-on:speedChanged="onASpeedChanged" title="A" />
              <div>
                  <form id="go">
                      <button v-on:click="calc">Go</button>
                  </form>
              </div>
              <train-input v-bind:google="google" v-bind:map="map"
                v-on:placeChanged="onBPlaceChanged"
                v-on:speedChanged="onBSpeedChanged" title="B" />
            </div>
          </div>
        </template>
      </template>
    </template>
  </div>
</template>

<script>
import ApiConfig from './ApiConfig';
import Map from './Map';
import TrainInput from './TrainInput';
import { computeRoutePosition } from '../lib/directions-helper';

export default {
  name: 'Home',
  components: {
    'api-config': ApiConfig,
    'google-map': Map,
    'train-input': TrainInput,
  },
  data() {
    return {
      apiError: null,
      google: null,
      map: null,
      originA: null,
      speedA: 0,
      originB: null,
      speedB: 0,
    };
  },
  mounted() {
    // key/auth failures happen *after* the api has been loaded
    window.gm_authFailure = () => {
      this.apiError = Error('Google Authentication Error');
    };
  },
  methods: {
    onGoogleReady(google) {
      this.google = google;
      const maps = this.google.maps;
      this.directionsService = new maps.DirectionsService();
      this.directionsRenderer = new maps.DirectionsRenderer({
        suppressMarkers: true,
      });
    },
    onMapReady(map) {
      this.markers = {};
      this.map = map;
      this.directionsRenderer.setMap(this.map);
    },
    onAPlaceChanged(autocomplete) {
      const place = autocomplete.getPlace();
      this.originA = place;
      this.setMarker('a', this.originA.geometry.location);
    },
    onASpeedChanged(speed) {
      this.speedA = parseFloat(speed);
    },
    onBPlaceChanged(autocomplete) {
      const place = autocomplete.getPlace();
      this.originB = place;
      this.setMarker('b', this.originB.geometry.location);
    },
    onBSpeedChanged(speed) {
      this.speedB = parseFloat(speed);
    },
    setMarker(id, position) {
      const maps = this.google.maps;
      const marker = this.markers[id];
      if (marker != null) {
        marker.setMap(null);
      }

      const newmarker = new this.google.maps.Marker({
        position,
        map: this.map,
        animation: maps.Animation.DROP,
        label: id.toUpperCase(),
      });

      this.map.setCenter(newmarker.getPosition());
      this.markers[id] = newmarker;
    },
    calc() {
      const maps = this.google.maps;
      const mode = 'DRIVING';
      const request = {
        origin: this.originA.geometry.location,
        destination: this.originB.geometry.location,
        travelMode: mode,
      };

      this.directionsService.route(request, (result, status) => {
        if (status === maps.DirectionsStatus.OK) {
          this.directionsRenderer.setDirections(result);
          const routes = result.routes;
          const firstRoute = routes[0];

          // build the route path
          // -- overview_path is sometimes wildly inaccurate
          let routeDistance = 0;
          const route = firstRoute.legs.reduce((memo, leg) => {
            leg.steps.forEach((step) => {
              routeDistance += step.distance.value || 0;
              step.path.forEach((path) => {
                memo.push(path);
              });
            });

            return memo;
          }, []);

          const timeToIntersect = routeDistance / (this.speedA + this.speedB);

          // find the marker x distance along the path
          const position = computeRoutePosition(timeToIntersect * this.speedA, route);
          this.setMarker('x', position);
        }
      });
    },
  },
};
</script>

<style>
#home {
}
</style>
