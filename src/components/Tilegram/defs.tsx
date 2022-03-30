import React, { memo } from 'react';
import type { ElectoratesRenderProps, PolygonRecord } from './types';

export type DefsProps = {
  componentID: string;
  electoratesRenderProps: ElectoratesRenderProps;
  statesPolygons: PolygonRecord;
};

const Defs: React.FC<DefsProps> = ({ componentID, electoratesRenderProps, statesPolygons }) => {
  return (
    <defs>
      <g id={`${componentID}_states`}>
        {Object.keys(statesPolygons).map(stateID => (
          <polygon key={stateID} points={statesPolygons[stateID].join(' ')} />
        ))}
      </g>
      {Object.values(electoratesRenderProps).reduce<JSX.Element[]>(
        (memo, { elementIDRecord, name, polygon }) => [
          ...memo,
          <polygon key={elementIDRecord.polygon} id={elementIDRecord.polygon} points={polygon.join(' ')}>
            <title>{name}</title>
          </polygon>,
          <clipPath key={elementIDRecord.clipPath} id={elementIDRecord.clipPath}>
            <use xlinkHref={`#${elementIDRecord.polygon}`} />
          </clipPath>
        ],
        []
      )}
    </defs>
  );
};

export default memo(Defs);
