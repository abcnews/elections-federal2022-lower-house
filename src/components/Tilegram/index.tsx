import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Allocations, Focuses, ElectionYear, Layout } from '../../constants';
import { Allocation, ElectorateID, Focus, ELECTORATES, PRESETS } from '../../constants';
import {
  determineIfAllocationIsDefinitive,
  determineIfAllocationIsMade,
  determineIfAllocationShouldFlip,
  determineIfAllocationWasPreserved
} from '../../utils';
import type { ElectoratesRenderProps } from './data';
import {
  ELECTORATES_POLYGONS,
  ELEMENT_NAMES,
  HEX_HEIGHT,
  HEX_WIDTH,
  HEXGRID_PROPS,
  STATES_POLYGONS,
  generateElementIDRecord
} from './data';
import Defs from './defs';
import styles from './styles.scss';

export enum TappableLayer {
  Electorates
}

export type TilegramProps = {
  layout?: Layout;
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
  const relativeAllocations = relative && PRESETS[relative]?.allocations;
  const hasFocuses = focuses && Object.keys(focuses).some(key => focuses[key] !== Focus.No);
  const isInteractive = !!onTapElectorate;
  const [isInspecting, setIsInspecting] = useState(false);

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

  // TODO: Make these dynamic based on upcoming layout prop
  const statesPolygons = STATES_POLYGONS;
  const electoratesPolygons = ELECTORATES_POLYGONS;
  const hexgridProps = HEXGRID_PROPS;

  const svgWidth = hexgridProps.width + 2 * hexgridProps.margin.horizontal;
  const svgHeight = hexgridProps.height + 2 * hexgridProps.margin.vertical;
  const svgViewBox = `0 0 ${svgWidth} ${svgHeight}`;
  const statesPolygonsHref = `#${componentID}_states`;
  const electoratesRenderProps = Object.values(ELECTORATES).reduce<ElectoratesRenderProps>((memo, electorate) => {
    const id = ElectorateID[electorate.id];
    const allocation = allocations ? allocations[id] : Allocation.None;
    const relativeAllocation = relativeAllocations ? relativeAllocations[id] : undefined;
    const polygon = electoratesPolygons[id];

    return {
      ...memo,
      [electorate.id]: {
        id,
        name: electorate.name,
        elementIDRecord: generateElementIDRecord(ELEMENT_NAMES, componentID, 'electorate', id),
        allocation,
        hasAllocation: allocation && determineIfAllocationIsMade(allocation),
        hasDefinitiveAllocation: allocation && determineIfAllocationIsDefinitive(allocation),
        relativeAllocation,
        hasDefinitiveRelativeAllocation: relativeAllocation && determineIfAllocationIsDefinitive(relativeAllocation),
        shouldFlip: relativeAllocation && determineIfAllocationShouldFlip(allocation, relativeAllocation),
        wasPreserved: relativeAllocation && determineIfAllocationWasPreserved(allocation, relativeAllocation),
        focus: focuses ? focuses[id] : Focus.No,
        polygon
      }
    };
  }, {});

  return (
    <div
      className={styles.root}
      style={{ paddingBottom: `${(svgHeight / svgWidth) * 100}%` }}
      data-has-focuses={hasFocuses ? '' : undefined}
      data-is-interactive={isInteractive ? '' : undefined}
      data-is-inspecting={isInspecting ? '' : undefined}
      data-tappable={tappableLayer}
    >
      <svg ref={svgRef} className={styles.svg} viewBox={svgViewBox}>
        <Defs
          componentID={componentID}
          electoratesRenderProps={electoratesRenderProps}
          statesPolygons={statesPolygons}
        />
        <g transform={`translate(${hexgridProps.margin.horizontal} ${hexgridProps.margin.vertical})`}>
          <use xlinkHref={statesPolygonsHref} className={styles.baseOuter}></use>
          <use xlinkHref={statesPolygonsHref} className={styles.baseInner}></use>
          <g className={styles.electoratesBackgrounds} onClick={onTapElectorateBackground}>
            {Object.values(electoratesRenderProps).map(
              ({ id, elementIDRecord, allocation, relativeAllocation, shouldFlip, wasPreserved, focus, polygon }) => (
                <g
                  key={id}
                  className={styles.electorateBackground}
                  clipPath={shouldFlip ? `url(#${elementIDRecord.clipPath})` : undefined}
                  data-focus={focus}
                >
                  <use
                    xlinkHref={`#${elementIDRecord.polygon}`}
                    className={styles.electorateBackgroundPolygon}
                    style={{
                      transformOrigin: `${polygon[0][0] + HEX_WIDTH / 2}px ${polygon[0][1] - HEX_HEIGHT / 4}px`
                    }}
                    data-electorate={id}
                    data-allocation={allocation}
                    data-relative-allocation={relativeAllocation || undefined}
                    data-should-flip={shouldFlip ? '' : undefined}
                    data-was-preserved={wasPreserved ? '' : undefined}
                  />
                </g>
              )
            )}
          </g>
          <g className={styles.electoratesBorders}>
            {Object.values(electoratesRenderProps).map(
              ({
                id,
                elementIDRecord,
                allocation,
                hasAllocation,
                hasDefinitiveAllocation,
                relativeAllocation,
                focus
              }) => (
                <g
                  key={id}
                  className={styles.electorateBorder}
                  clipPath={focus === Focus.Yes || relativeAllocation ? `url(#${elementIDRecord.clipPath})` : undefined}
                  data-focus={focus}
                >
                  <use
                    xlinkHref={`#${elementIDRecord.polygon}`}
                    className={styles.electorateBorderPolygon}
                    data-electorate={id}
                    data-allocation={allocation || undefined}
                    data-has-allocation={hasAllocation ? '' : undefined}
                    data-has-definitive-allocation={hasDefinitiveAllocation ? '' : undefined}
                    data-relative-allocation={relativeAllocation || undefined}
                    data-focus={focus}
                  ></use>
                </g>
              )
            )}
          </g>
          <g className={styles.electoratesPartitions}>
            {Object.values(electoratesRenderProps).map(
              ({ id, elementIDRecord, relativeAllocation, hasDefinitiveRelativeAllocation, focus }) => (
                <use
                  key={id}
                  xlinkHref={`#${elementIDRecord.polygon}`}
                  className={styles.electoratePartition}
                  data-relative-allocation={relativeAllocation || undefined}
                  data-has-definitive-allocation={hasDefinitiveRelativeAllocation ? '' : undefined}
                  data-focus={focus}
                ></use>
              )
            )}
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Tilegram;
