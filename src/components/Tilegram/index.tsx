import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Allocations, Focuses, ElectionYear } from '../../constants';
import { Allocation, Focus, PRESETS } from '../../constants';
import {
  determineIfAllocationIsDefinitive,
  determineIfAllocationIsMade,
  determineIfAllocationShouldFlip,
  determineIfAllocationWasPreserved
} from '../../utils';
import { ELECTORATES_POLYGONS, HEX_HEIGHT, HEX_WIDTH, HEXGRID_PROPS } from './data';
import Defs, { generatePolyKeys } from './defs';
import styles from './styles.scss';

export enum TappableLayer {
  Electorates
}

export type TilegramProps = {
  allocations?: Allocations;
  focuses?: Focuses;
  year?: ElectionYear;
  relative?: ElectionYear | null;
  tappableLayer?: TappableLayer;
  onTapElectorate?: (elecctorateID: string) => void;
};

const generateComponentID = () => (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 8);

const Tilegram: React.FC<TilegramProps> = props => {
  const svgRef = useRef<SVGSVGElement>(null);
  const componentID = useMemo(generateComponentID, []);
  const { allocations, focuses, year, relative, tappableLayer, onTapElectorate } = props;
  // TODO: Use year with candidate lists (once we get them) to provide chenge options
  // (or maybe just pass year and electorate ID to onTapElectorate for it to be handled outside)
  const isInteractive = !!onTapElectorate;
  const [isInspecting, setIsInspecting] = useState(false);
  const hasFocuses = focuses && Object.keys(focuses).some(key => focuses[key] !== Focus.No);
  const relativeAllocations = relative && PRESETS[relative]?.allocations;

  const onTapElectorateBackground = (event: React.MouseEvent<SVGElement>) => {
    if (onTapElectorate && tappableLayer === TappableLayer.Electorates && event.target instanceof SVGUseElement) {
      const electorateID = event.target.getAttribute('data-electorate');

      if (electorateID) {
        onTapElectorate(electorateID);
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

  const svgWidth = HEXGRID_PROPS.width + 2 * HEXGRID_PROPS.margin.horizontal;
  const svgHeight = HEXGRID_PROPS.height + 2 * HEXGRID_PROPS.margin.vertical;
  const svgViewBox = `0 0 ${svgWidth} ${svgHeight}`;
  // const countryPathHref = `#${componentID}_country`;
  const statesPathsHref = `#${componentID}_states`;

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
        <g transform={`translate(${HEXGRID_PROPS.margin.horizontal} ${HEXGRID_PROPS.margin.vertical})`}>
          {/* <use xlinkHref={countryPathHref} className={styles.baseOuter}></use> */}
          {/* <use xlinkHref={countryPathHref} className={styles.baseInner}></use> */}
          <use xlinkHref={statesPathsHref} className={styles.baseOuter}></use>
          <use xlinkHref={statesPathsHref} className={styles.baseInner}></use>
          <g className={styles.electoratesBackgrounds} onClick={onTapElectorateBackground}>
            {Object.keys(ELECTORATES_POLYGONS).reduce<JSX.Element[]>((memo, electorateID) => {
              const keys = generatePolyKeys(componentID, 'electorate', electorateID);
              const allocation = allocations ? allocations[electorateID] : Allocation.None;
              const relativeAllocation = relativeAllocations ? relativeAllocations[electorateID] : undefined;
              const shouldFlip = relativeAllocation && determineIfAllocationShouldFlip(allocation, relativeAllocation);
              const wasPreserved =
                relativeAllocation && determineIfAllocationWasPreserved(allocation, relativeAllocation);
              const focus = focuses ? focuses[electorateID] : Focus.No;
              const [offsetX, offsetY] = ELECTORATES_POLYGONS[electorateID][0];

              return [
                ...memo,
                <g
                  key={electorateID}
                  className={styles.electorateBackground}
                  data-focus={focus}
                  clipPath={shouldFlip ? `url(#${keys['clip']})` : undefined}
                >
                  <use
                    xlinkHref={`#${keys['path']}`}
                    className={styles.electorateBackgroundPath}
                    data-allocation={allocation}
                    data-relative-allocation={relativeAllocation}
                    data-should-flip={shouldFlip ? '' : undefined}
                    data-was-preserved={wasPreserved ? '' : undefined}
                    style={{ transformOrigin: `${offsetX + HEX_WIDTH / 2}px ${offsetY - HEX_HEIGHT / 4}px` }}
                  />
                  <use
                    xlinkHref={`#${keys['target']}`}
                    className={styles.electorateBackgroundTarget}
                    data-electorate={electorateID}
                  ></use>
                </g>
              ];
            }, [])}
          </g>
          <g className={styles.electoratesBorders}>
            {Object.keys(ELECTORATES_POLYGONS).reduce<JSX.Element[]>((memo, electorateID) => {
              const keys = generatePolyKeys(componentID, 'electorate', electorateID);
              const focus = focuses ? focuses[electorateID] : Focus.No;
              const allocation = allocations && allocations[electorateID];
              const hasAllocation = allocation && determineIfAllocationIsMade(allocation);
              const hasDefinitiveAllocation = allocation && determineIfAllocationIsDefinitive(allocation);
              const relativeAllocation = relativeAllocations && relativeAllocations[electorateID];

              return [
                ...memo,
                <g
                  key={electorateID}
                  className={styles.electorateBorder}
                  data-focus={focus}
                  clipPath={focus === Focus.Yes || relativeAllocation ? `url(#${keys['clip']})` : undefined}
                >
                  <use
                    xlinkHref={`#${keys['path']}`}
                    className={styles.electorateBorderPath}
                    data-focus={focus}
                    data-has-allocation={hasAllocation ? '' : undefined}
                    data-has-definitive-allocation={hasDefinitiveAllocation ? '' : undefined}
                    data-allocation={allocation || undefined}
                    data-relative-allocation={relativeAllocation || undefined}
                  ></use>
                  <use
                    xlinkHref={`#${keys['target']}`}
                    className={styles.electorateBorderTarget}
                    data-electorate={electorateID}
                  ></use>
                </g>
              ];
            }, [])}
          </g>
          <g className={styles.electoratesPartitions}>
            {Object.keys(ELECTORATES_POLYGONS).reduce<JSX.Element[]>((memo, electorateID) => {
              const keys = generatePolyKeys(componentID, 'electorate', electorateID);
              const focus = focuses ? focuses[electorateID] : Focus.No;
              const relativeAllocation = relativeAllocations && relativeAllocations[electorateID];
              const hasDefinitiveRelativeAllocation =
                relativeAllocation && determineIfAllocationIsDefinitive(relativeAllocation);

              return [
                ...memo,
                <use
                  key={electorateID}
                  xlinkHref={`#${keys['path']}`}
                  className={styles.electoratePartition}
                  data-focus={focus}
                  data-relative-allocation={relativeAllocation || undefined}
                  data-has-definitive-allocation={hasDefinitiveRelativeAllocation ? '' : undefined}
                ></use>
              ];
            }, [])}
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Tilegram;
