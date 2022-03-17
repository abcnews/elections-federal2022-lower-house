import React, { memo } from 'react';
import { ElectorateID, ELECTORATES } from '../../constants';
import { ELECTORATES_PATHS, ELECTORATES_POLYGONS, STATES_PATHS } from './data';

const POLY_KEY_NAMES = ['path', 'clip', 'target'];

export const generateKey = (componentID: string, ...rest: Array<string | number>) =>
  ([componentID] as Array<string | number>).concat(rest).join('_');

export const generatePolyKeys = (componentID: string, ...rest: Array<string | number>) =>
  POLY_KEY_NAMES.reduce((memo, key) => {
    memo[key] = generateKey(componentID, ...rest.concat([key]));

    return memo;
  }, {});

export type DefsProps = {
  componentID: string;
};

const Defs: React.FC<DefsProps> = ({ componentID }) => {
  return (
    <defs>
      <g id={`${componentID}_states`}>
        {Object.keys(STATES_PATHS).map(stateID => (
          <path key={stateID} d={STATES_PATHS[stateID]}></path>
        ))}
      </g>
      {Object.keys(ELECTORATES_POLYGONS).reduce<JSX.Element[]>((memo, electorateID) => {
        const keys = generatePolyKeys(componentID, 'electorate', electorateID);
        const path = ELECTORATES_PATHS[electorateID];
        const polygon = ELECTORATES_POLYGONS[electorateID];

        return [
          ...memo,
          <path key={keys['path']} id={keys['path']} d={path}></path>,
          <clipPath key={keys['clip']} id={keys['clip']}>
            <use xlinkHref={`#${keys['path']}`} />
          </clipPath>,
          <polygon key={keys['target']} id={keys['target']} points={polygon.join(' ')}>
            <title>{ELECTORATES.find(({ id }) => id === ElectorateID[electorateID])?.name}</title>
          </polygon>
        ];
      }, [])}
    </defs>
  );
};

export default memo(Defs);
