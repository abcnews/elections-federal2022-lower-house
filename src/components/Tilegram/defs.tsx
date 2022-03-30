import React, { memo } from 'react';
import type { Hex, PolygonRecord } from './types';

export type DefsProps = {
  elementsIDs: Record<string, string>;
  hex: Hex;
  statesPolygons: PolygonRecord;
};

const Defs: React.FC<DefsProps> = ({ elementsIDs, hex, statesPolygons }) => (
  <defs>
    <polygon id={elementsIDs.hexPolygon} points={hex.polygon.join(' ')}></polygon>
    <clipPath id={elementsIDs.hexClipPath}>
      <use xlinkHref={`#${elementsIDs.hexPolygon}`} />
    </clipPath>
    <g id={elementsIDs.statesPolygons}>
      {Object.keys(statesPolygons).map(stateID => (
        <polygon key={stateID} points={statesPolygons[stateID].join(' ')} />
      ))}
    </g>
  </defs>
);

export default memo(Defs);
