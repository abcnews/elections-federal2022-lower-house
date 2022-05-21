/// <reference types="maplibre-gl" />

declare var maplibregl: typeof import('maplibre-gl');

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

// GeoJSON prefers numeric IDs. This will convert a letter-based electorate code to an integer.
// Our electorate codes are 4 letter long but this code can safely handle up to 11 letters, because Math.pow(26, 11) < Number.MAX_SAFE_INTEGER
export const electorateIdToNumber = (electorateId: string): number => {
  electorateId = electorateId.toLowerCase().replace(/[^a-z]+/g, '');

  let number = 0;

  for (let i = 0; i < electorateId.length; i++) {
    number += (electorateId.charCodeAt(i) - 97) * Math.pow(26, electorateId.length - i); // 97 is the character code for the letter 'a'
  }

  return number;
};
