import React, { useMemo, useRef } from 'react';
import { Allocations } from '../../lib/constants';
import { Allocation, ElectorateID, ELECTORATES, Layer } from '../../lib/constants';
import { determineIfAllocationIsDefinitive, determineIfAllocationIsMade } from '../../lib/utils';
import type { ElectoratesRenderProps } from './data';
import { ELECTORATES_PATHS } from './data';
import styles from './styles.scss';

const SVG_SIZE = 480;
const PATHS_OFFSET_X = -170;
const PATHS_OFFSET_Y = 45;

export type GeoProps = {
  allocations?: Allocations;
  layer?: Layer;
};

const Geo: React.FC<GeoProps> = props => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { allocations, layer } = props;
  const electoratesRenderProps = useMemo(
    () =>
      Object.values(ELECTORATES).reduce<ElectoratesRenderProps>((memo, electorate) => {
        const id = ElectorateID[electorate.id];
        const allocation = allocations ? allocations[id] : Allocation.None;

        return {
          ...memo,
          [electorate.id]: {
            id,
            name: electorate.name,
            allocation,
            hasAllocation: allocation && determineIfAllocationIsMade(allocation),
            hasDefinitiveAllocation: allocation && determineIfAllocationIsDefinitive(allocation),
            path: ELECTORATES_PATHS[id]
          }
        };
      }, {}),
    [allocations, layer]
  );

  return (
    <div className={styles.root} data-layer={layer}>
      <svg ref={svgRef} className={styles.svg} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}>
        <g transform={`translate(${PATHS_OFFSET_X} ${PATHS_OFFSET_Y})`}>
          <g className={styles.electorates}>
            {Object.values(electoratesRenderProps)
              // .sort((a, b) => (a.allocation !== b.allocation && b.allocation === Allocation.None ? 0 : -1))
              .map(({ id, name, allocation, hasAllocation, hasDefinitiveAllocation, path }) => (
                <path
                  key={id}
                  className={styles.electorate}
                  d={path}
                  data-electorate={id}
                  data-allocation={allocation}
                  data-has-allocation={hasAllocation ? '' : undefined}
                  data-has-definitive-allocation={hasDefinitiveAllocation ? '' : undefined}
                >
                  <title>{name}</title>
                </path>
              ))}
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Geo;
