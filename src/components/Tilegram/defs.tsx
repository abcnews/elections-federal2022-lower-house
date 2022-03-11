import React, { memo } from 'react';
import { GroupID, GROUPS } from '../../constants';
// import {
//   COUNTRY_PATHS,
//   GROUPS_DELEGATES_PATHS,
//   GROUPS_DELEGATES_POINTS,
//   GROUPS_LABELS,
//   STATES_PATHS,
//   STATES_POINTS
// } from './data';
import { GROUPS_DELEGATES_PATHS, GROUPS_DELEGATES_POINTS } from './data';

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
  // const countryPathsKey = componentID + '_country';

  return (
    <defs>
      {/* <g key={countryPathsKey} id={countryPathsKey}>
        {COUNTRY_PATHS.map((d, index) => (
          <path key={index} d={d}></path>
        ))}
      </g> */}
      {Object.keys(GROUPS_DELEGATES_PATHS).reduce<JSX.Element[]>((memo, groupID) => {
        const keys = generatePolyKeys(componentID, 'group', groupID);
        const path = GROUPS_DELEGATES_PATHS[groupID][0];
        const points = GROUPS_DELEGATES_POINTS[groupID][0];

        return [
          ...memo,
          <path key={keys['path']} id={keys['path']} d={path}></path>,
          <clipPath key={keys['clip']} id={keys['clip']}>
            <use xlinkHref={`#${keys['path']}`} />
          </clipPath>,
          <polygon key={keys['target']} id={keys['target']} points={points.join(' ')}>
            <title>{GROUPS.find(({ id }) => id === GroupID[groupID])?.name}</title>
          </polygon>
        ];
      }, [])}
      {/* {Object.keys(STATES_PATHS).reduce<JSX.Element[]>((memo, stateID) => {
        return memo.concat(
          STATES_PATHS[stateID].reduce<JSX.Element[]>((memo, path, index) => {
            const keys = generatePolyKeys(componentID, 'state', stateID, index);
            const points = STATES_POINTS[stateID][index];

            return memo.concat([
              <path key={keys['path']} id={keys['path']} d={path}></path>,
              <clipPath key={keys['clip']} id={keys['clip']}>
                <use xlinkHref={`#${keys['path']}`} />
              </clipPath>,
              <polygon key={keys['target']} id={keys['target']} points={points.join(' ')}>
                <title>{GROUPS.find(({ id }) => id === GroupID[stateID])?.name}</title>
              </polygon>
            ]);
          }, [])
        );
      }, [])} */}
      {/* {Object.keys(GROUPS_LABELS).map(groupID => {
        const [x, y] = GROUPS_LABELS[groupID];
        const key = generateKey(componentID, 'label', groupID);

        return (
          <text key={key} id={key} data-group={groupID} x={x} y={y + 4}>
            {groupID}
          </text>
        );
      })} */}
    </defs>
  );
};

export default memo(Defs);
