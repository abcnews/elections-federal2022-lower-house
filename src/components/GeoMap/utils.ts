import loadScript from 'load-script';

export const ensureMaplibre = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const js = 'https://unpkg.com/maplibre-gl@2.1.7/dist/maplibre-gl.js';
    const css = 'https://unpkg.com/maplibre-gl@2.1.7/dist/maplibre-gl.css';

    if (!document.head.querySelector(`link[href^="${css}"]`)) {
      let stylesheet = document.createElement('link');
      stylesheet.href = css;
      stylesheet.rel = 'stylesheet';
      document.head.appendChild(stylesheet);
    }

    if (window.maplibregl) {
      resolve();
      return;
    }

    loadScript(js, err => {
      if (err) {
        reject(err);
        return;
      }

      if (window.maplibregl) {
        resolve();
        return;
      }

      reject(new Error('window.maplibre is undefined'));
    });
  });
};
