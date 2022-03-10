import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Allocation,
  Allocations,
  Focus,
  Focuses,
  PRESETS,
  ELECTION_YEARS_ALLOCATIONS_CANDIDATES,
  DEFAULT_ELECTION_YEAR,
  ElectionYear
} from '../../constants';
import { determineIfAllocationIsDefinitive, determineIfAllocationIsMade } from '../../utils';
import { GROUPS_DELEGATES_POINTS, GROUPS_LABELS, STATES_PATHS, HEXGRID_PROPS } from './data';
import Defs, { generateKey, generatePolyKeys } from './defs';
import styles from './styles.scss';

export enum TappableLayer {
  Delegates
}

export type TilegramProps = {
  allocations?: Allocations;
  focuses?: Focuses;
  year?: ElectionYear;
  relative?: ElectionYear | null;
  tappableLayer?: TappableLayer;
  onTapGroup?: (groupID: string) => void;
};

const generateComponentID = () => (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 8);

const Tilegram: React.FC<TilegramProps> = props => {
  const svgRef = useRef<SVGSVGElement>(null);
  const componentID = useMemo(generateComponentID, []);
  const { allocations, focuses, year, relative, tappableLayer, onTapGroup } = props;
  const isInteractive = !!onTapGroup;
  const [isInspecting, setIsInspecting] = useState(false);
  const hasFocuses = focuses && Object.keys(focuses).some(key => focuses[key] !== Focus.No);
  // TODO: we need a new concept for 'held' so that we can show flips
  const [governmentAllocation, oppositionAllocation] = Object.keys(
    ELECTION_YEARS_ALLOCATIONS_CANDIDATES[year || DEFAULT_ELECTION_YEAR]
  );
  const relativeAllocations = relative && PRESETS[relative]?.allocations;

  const onTapGroupBackground = (event: React.MouseEvent<SVGElement>) => {
    if (onTapGroup && tappableLayer === TappableLayer.Delegates && event.target instanceof SVGUseElement) {
      const groupID = event.target.getAttribute('data-group');

      if (groupID) {
        onTapGroup(groupID);
      }
    }
  };

  // We need to trick svg4everyone into not nuking our <use> elements,
  // by making it think the <svg>'s nodeName isn't "svg"
  useLayoutEffect(() => {
    const svgEl = svgRef.current;

    if (!svgEl) {
      return;
    }

    Object.defineProperty(svgEl, 'nodeName', {
      value: 'savage',
      writable: false
    });
  }, []);

  useEffect(() => {
    if (!isInteractive) {
      return;
    }

    function handler(event: KeyboardEvent) {
      setIsInspecting(event.altKey);
    }

    window.addEventListener('keydown', handler, false);
    window.addEventListener('keyup', handler, false);

    return () => {
      window.removeEventListener('keydown', handler, false);
      window.removeEventListener('keyup', handler, false);
    };
  }, [isInteractive]);

  const svgWidth = HEXGRID_PROPS.width + 2 * HEXGRID_PROPS.margin;
  const svgHeight = HEXGRID_PROPS.height + 2 * HEXGRID_PROPS.margin;
  const svgViewBox = `0 0 ${svgWidth} ${svgHeight}`;
  // const countryPathsHref = `#${componentID}_country`;

  return (
    <div
      className={styles.root}
      data-has-focuses={hasFocuses ? '' : undefined}
      data-is-interactive={isInteractive ? '' : undefined}
      data-is-inspecting={isInspecting ? '' : undefined}
      data-tappable={tappableLayer}
      style={{ paddingBottom: `${(svgHeight / svgWidth) * 100}%` }}
    >
      <svg ref={svgRef} className={styles.svg} viewBox={svgViewBox}>
        <Defs componentID={componentID} />
        <g transform={`translate(${HEXGRID_PROPS.margin} ${HEXGRID_PROPS.margin})`}>
          {/* <use xlinkHref={countryPathsHref} className={styles.countryOuter}></use> */}
          {/* <use xlinkHref={countryPathsHref} className={styles.countryInner}></use> */}
          <g className={styles.groupsBackgrounds} onClick={onTapGroupBackground}>
            {Object.keys(GROUPS_DELEGATES_POINTS).reduce<JSX.Element[]>((memo, groupID) => {
              const points = GROUPS_DELEGATES_POINTS[groupID][0];
              const focus = focuses ? focuses[groupID] : Focus.No;
              const keys = generatePolyKeys(componentID, 'group', groupID, 0);
              const allocation = allocations ? allocations[groupID] : Allocation.None;
              const relativeAllocation = relativeAllocations ? relativeAllocations[groupID] : undefined;
              const isFlipping =
                (relativeAllocation === Allocation.ALP && allocation === Allocation.CLN) ||
                (relativeAllocation === Allocation.CLN && allocation === Allocation.ALP);
              const [offsetX, offsetY] = points[0];

              return [
                ...memo,
                <g
                  key={groupID}
                  className={styles.groupBackground}
                  data-flip-direction={
                    governmentAllocation === allocation
                      ? 'rtl'
                      : oppositionAllocation === allocation
                      ? 'ltr'
                      : undefined
                  }
                  data-focus={focus}
                  clipPath={isFlipping ? `url(#${keys['clip']})` : undefined}
                >
                  <use
                    xlinkHref={`#${keys['path']}`}
                    className={styles.groupBackgroundPath}
                    data-relative-allocation={relativeAllocation}
                    data-allocation={allocation}
                    style={{ transformOrigin: `${offsetX + 15}px ${offsetY}px` }}
                  />
                  <use
                    xlinkHref={`#${keys['target']}`}
                    className={styles.groupBackgroundTarget}
                    data-group={groupID}
                  ></use>
                </g>
              ];
            }, [])}
          </g>
          <g className={styles.groupsBorders}>
            {Object.keys(GROUPS_DELEGATES_POINTS).reduce<JSX.Element[]>((memo, groupID) => {
              const focus = focuses ? focuses[groupID] : Focus.No;
              const allocation = allocations && allocations[groupID];
              const hasAllocation = allocation && determineIfAllocationIsMade(allocation);
              const hasDefinitiveAllocation = allocation && determineIfAllocationIsDefinitive(allocation);
              const relativeAllocation = relativeAllocations && relativeAllocations[groupID];
              const keys = generatePolyKeys(componentID, 'group', groupID, 0);

              return [
                ...memo,
                <g
                  key={groupID}
                  className={styles.groupBorder}
                  data-focus={focus}
                  clipPath={focus === Focus.Yes || relativeAllocation ? `url(#${keys['clip']})` : undefined}
                >
                  <use
                    xlinkHref={`#${keys['path']}`}
                    className={styles.groupBorderPath}
                    data-focus={focus}
                    data-has-allocation={hasAllocation ? '' : undefined}
                    data-has-definitive-allocation={hasDefinitiveAllocation ? '' : undefined}
                    data-allocation={allocation || undefined}
                    data-relative-allocation={relativeAllocation || undefined}
                  ></use>
                  <use xlinkHref={`#${keys['target']}`} className={styles.groupBorderTarget} data-group={groupID}></use>
                </g>
              ];
            }, [])}
          </g>
          <g className={styles.groupsPartitions}>
            {Object.keys(GROUPS_DELEGATES_POINTS).reduce<JSX.Element[]>((memo, groupID) => {
              const focus = focuses ? focuses[groupID] : Focus.No;
              const relativeAllocation = relativeAllocations && relativeAllocations[groupID];
              const keys = generatePolyKeys(componentID, 'group', groupID, 0);

              return [
                ...memo,
                <use
                  key={groupID}
                  xlinkHref={`#${keys['path']}`}
                  className={styles.groupPartition}
                  data-focus={focus}
                  data-relative-allocation={relativeAllocation || undefined}
                ></use>
              ];
            }, [])}
          </g>
          {/* <g className={styles.labels}>
            {Object.keys(GROUPS_LABELS).map(groupID => {
              const key = generateKey(componentID, 'label', groupID);
              const focus = focuses ? focuses[groupID] : Focus.No;
              const allocation = allocations && allocations[groupID];
              const relativeAllocation = relativeAllocations && relativeAllocations[groupID];

              return (
                <g
                  key={groupID}
                  className={styles.label}
                  data-focus={focus}
                  data-group={groupID}
                  data-allocation={allocation || undefined}
                  data-relative-allocation={relativeAllocation || undefined}
                >
                  <use xlinkHref={`#${key}`} className={styles.labelText}></use>
                </g>
              );
            })}
          </g> */}
        </g>
      </svg>
    </div>
  );
};

export default Tilegram;
