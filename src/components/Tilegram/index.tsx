import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Allocations, ElectionYear, Electorate, Focuses, Layer, Layout } from '../../lib/constants';
import {
  DEFAULT_LAYER,
  DEFAULT_LAYOUT,
  SINGLE_STATE_LAYOUTS,
  Allocation,
  ElectorateID,
  ELECTORATES,
  Focus,
  StateID,
  STATES,
  PRESETS
} from '../../lib/constants';
import {
  determineIfAllocationIsDefinitive,
  determineIfAllocationIsMade,
  determineIfAllocationShouldFlip,
  determineIfAllocationWasPreserved
} from '../../lib/utils';
import type { ElectoratesRenderProps, LayoutConfig } from './data';
import { ELEMENT_NAMES, LAYOUTS_CONFIGS, SVG_SIZE, generateElementIDRecord } from './data';
import Defs from './defs';
import styles from './styles.scss';

export type TilegramProps = {
  layout: Layout;
  layer: Layer;
  allocations?: Allocations;
  focuses?: Focuses;
  year?: ElectionYear;
  relative?: ElectionYear | null;
  onTapElectorate?: (electorateID: string, event: React.MouseEvent<SVGElement>) => void;
};

export const DEFAULT_PROPS: TilegramProps = {
  layout: DEFAULT_LAYOUT,
  layer: DEFAULT_LAYER
};

const generateComponentID = () => (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 8);

const Tilegram: React.FC<TilegramProps> = props => {
  const [isInspecting, setIsInspecting] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const componentID = useMemo(generateComponentID, []);
  const { allocations, focuses, layer, layout, year, relative, onTapElectorate } = props;
  const isSingleStateLayout = SINGLE_STATE_LAYOUTS.indexOf(layout) !== -1;
  const relativeAllocations = relative && PRESETS[relative]?.allocations;
  const hasFocuses = focuses && Object.keys(focuses).some(key => focuses[key] !== Focus.No);
  const isInteractive = !!onTapElectorate;
  const { electoratesPolygons, statesPolygons, statesLabelsPositions, hexDimensions } = useMemo(
    () => LAYOUTS_CONFIGS[layout] as LayoutConfig,
    [layout]
  );
  const statesPolygonsHref = `#${componentID}_states`;
  const electoratesRenderProps = useMemo(
    () =>
      Object.values(ELECTORATES).reduce<ElectoratesRenderProps>((memo, electorate) => {
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
            hasDefinitiveRelativeAllocation:
              relativeAllocation && determineIfAllocationIsDefinitive(relativeAllocation),
            shouldFlip: relativeAllocation && determineIfAllocationShouldFlip(allocation, relativeAllocation),
            wasPreserved: relativeAllocation && determineIfAllocationWasPreserved(allocation, relativeAllocation),
            focus: focuses ? focuses[id] : Focus.No,
            polygon
          }
        };
      }, {}),
    [allocations, relativeAllocations, electoratesPolygons, componentID, focuses]
  );

  const onTapElectorateBackground = (event: React.MouseEvent<SVGElement>) => {
    if (onTapElectorate && event.target instanceof SVGUseElement) {
      const electorateID = event.target.getAttribute('data-electorate');

      if (electorateID) {
        onTapElectorate(electorateID, event);
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

  useLayoutEffect(() => {
    const svgEl = svgRef.current;

    if (!relativeAllocations || !svgEl) {
      return;
    }

    Object.values(electoratesRenderProps).forEach(({ id, allocation, shouldFlip }) => {
      const electorateBackgroundPolygon =
        shouldFlip && svgEl.querySelector(`.${styles.electorateBackgroundPolygon}[data-electorate=${id}]`);

      if (!electorateBackgroundPolygon) {
        return;
      }

      const previousAllocation = electorateBackgroundPolygon.getAttribute('data-last-flipped-allocation');

      if (!previousAllocation || previousAllocation !== allocation) {
        electorateBackgroundPolygon.setAttribute('data-last-flipped-allocation', allocation);
        electorateBackgroundPolygon.setAttribute('data-should-flip', '');
      }
    });
  }, [svgRef.current, allocations, relativeAllocations]);

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

  return (
    <div
      className={styles.root}
      data-layer={layer}
      data-layout={layout}
      data-has-focuses={hasFocuses ? '' : undefined}
      data-is-single-state-layout={isSingleStateLayout ? '' : undefined}
      data-is-interactive={isInteractive ? '' : undefined}
      data-is-inspecting={isInspecting ? '' : undefined}
    >
      <svg ref={svgRef} className={styles.svg} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}>
        <Defs
          componentID={componentID}
          electoratesRenderProps={electoratesRenderProps}
          statesPolygons={statesPolygons}
        />
        <g>
          <use xlinkHref={statesPolygonsHref} className={styles.baseOuter} />
          <use xlinkHref={statesPolygonsHref} className={styles.baseInner} />
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
                      transformOrigin: `${polygon[0][0] + hexDimensions.width / 2}px ${
                        polygon[0][1] - hexDimensions.height / 4
                      }px`
                    }}
                    data-electorate={id}
                    data-allocation={allocation}
                    data-relative-allocation={relativeAllocation || undefined}
                    data-was-preserved={wasPreserved ? '' : undefined}
                    onAnimationEnd={e => e.currentTarget.removeAttribute('data-should-flip')}
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
                  />
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
                />
              )
            )}
          </g>
          {isInspecting && layer === Layer.ELECTORATES && (
            <g className={styles.electoratesLabels}>
              {Object.values(electoratesRenderProps).map(({ id: electorateID, hasAllocation, polygon }) => {
                const position = polygon[0];
                const [x, y] = [position[0] + hexDimensions.width / 2, position[1] - hexDimensions.height / 4];
                const electorate = ELECTORATES.find(
                  ({ id }) => ((id as unknown) as string) === ElectorateID[electorateID]
                ) as Electorate;
                const label = electorate[isSingleStateLayout ? 'name' : 'abbr'];
                const hasLongLabel = label.length > 9 || (label.length > 8 && (label.match(/w|m/gi) || []).length > 1);

                return (
                  <text
                    key={electorateID}
                    className={styles.electorateLabel}
                    style={{
                      transformOrigin: `${x}px ${y}px`
                    }}
                    x={x}
                    y={y}
                    data-electorate={electorateID}
                    data-has-allocation={hasAllocation ? '' : undefined}
                    data-has-long-label={hasLongLabel ? '' : undefined}
                  >
                    {label}
                  </text>
                );
              })}
            </g>
          )}
          <use xlinkHref={statesPolygonsHref} className={styles.statesBackgrounds} />
          <use xlinkHref={statesPolygonsHref} className={styles.statesBorders} />
          <g className={styles.statesLabels}>
            {Object.keys(statesLabelsPositions).map(stateID => {
              const label = STATES.find(({ id }) => id === StateID[stateID])?.caps;
              const position = statesLabelsPositions[stateID];

              return (
                <text key={stateID} className={styles.stateLabel} x={position[0]} y={position[1]} data-state={stateID}>
                  {label}
                </text>
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Tilegram;
