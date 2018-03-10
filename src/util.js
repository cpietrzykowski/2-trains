// async script loading

/**
 * @param {Object} anchor
 * @param {String} url
 * @param {Object} params should be encoded before being passed
 * @param {Boolean} async
 * @param {Boolean} defer
 * @return {Promise}
 */
export function loadScript(anchor, url, params = {}, async = true, defer = true) {
  const scriptElement = document.createElement('script');
  if (async) scriptElement.setAttribute('async', '');
  if (defer) scriptElement.setAttribute('defer', '');

  return new Promise((resolve, reject) => {
    const qvals = Object.keys(params).reduce((memo, k) => {
      const v = params[k];
      if (v) {
        memo.push(`${k}=${v}`);
      }

      return memo;
    }, []);

    scriptElement.onerror = err => reject(new URIError(`unable to access: ${err.target.src}`));

    scriptElement.onload = () => {
      scriptElement.parentNode.removeChild(scriptElement);
      return resolve();
    };

    scriptElement.src = qvals.length > 0 ? `${url}?${qvals.join('&')}` : `${url}`;
    anchor.appendChild(scriptElement);
  });
}

/**
 * @param {Object} context
 * @param {*} prefix
 * @return {String}
 */
export function genRandomKey(context = window, prefix = '') {
  let fid = null;

  do {
    fid = `${prefix}${Date.now()}_${Math.floor(Math.random() * 0xff).toString(16)}`;

    if (fid in context) {
      fid = null;
    }
  } while (!fid);

  return fid;
}
