import { genRandomKey, loadScript } from './util';

/**
 * @param {String} key
 * @param {Array} libs
 * @return {Promise}
 */
export default function load(key, libs = []) {
  const apiUrl = 'https://maps.googleapis.com/maps/api/js';

  return new Promise((resolve, reject) => {
    const cbname = genRandomKey(window, 'google');

    // the callback is called regardless if the key was valid
    window[cbname] = () => {
      delete window[cbname];
      // eslint-disable-next-line no-undef
      const g = google;
      if (g && g.maps) {
        return resolve(g);
      }

      return reject(Error('Google Api Error'));
    };

    loadScript(document.head, apiUrl, {
      key,
      libraries: libs.join(','),
      callback: cbname,
    }).catch(reason => reject(reason));
  });
}
