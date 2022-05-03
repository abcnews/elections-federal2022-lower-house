import React from 'react';
import type { Hex, PolygonRecord } from './types';
import { getHex } from './utils';

declare global {
  interface Window {
    chrome: unknown;
  }
}

export type DefsProps = {
  elementsIDs: Record<string, string>;
  hex: Hex;
  statesPolygons: PolygonRecord;
};

const Defs: React.FC<DefsProps> = ({ elementsIDs, hex, statesPolygons }) => (
  <defs data-is-chrome={!!window.chrome ? '' : undefined}>
    <polygon id={elementsIDs.hexPolygon} points={hex.polygon.join(' ')}></polygon>
    <clipPath id={elementsIDs.hexClipPath}>
      <polygon
        stroke="black"
        strokeWidth="9"
        points={getHex(0.5, hex.width - Math.sqrt(3)).polygon.join(' ')}
      ></polygon>
    </clipPath>
    <g id={elementsIDs.statesPolygons}>
      {Object.keys(statesPolygons).map(stateID => (
        <polygon key={stateID} points={statesPolygons[stateID].join(' ')} />
      ))}
    </g>
  </defs>
);

export default Defs;
