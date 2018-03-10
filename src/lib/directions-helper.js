/**
 *
 * @param {Number} distance in meters
 * @param {Array} route list of LatLng objects
 */
export function computeRoutePosition(distance, route = []) {
  const geometry = google.maps.geometry;
  let trip = 0;

  for (let i = 0; i < route.length - 1; i += 1) {
    const start = route[i];
    const finish = route[i + 1];
    const legdist = geometry.spherical.computeDistanceBetween(start, finish);
    trip += legdist;

    if (trip > distance) {
      const heading = geometry.spherical.computeHeading(start, finish);
      return geometry.spherical.computeOffset(start, trip - distance, heading);
    }
  }

  return null;
}

export function routerMarkers() {

}
