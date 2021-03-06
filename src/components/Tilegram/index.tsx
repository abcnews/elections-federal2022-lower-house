import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Allocations, Annotations, Certainties, Focuses } from '../../lib/constants';
import {
  Allocation,
  ElectorateID,
  ELECTORATES,
  Layout,
  DEFAULT_LAYOUT,
  NoYes,
  SINGLE_STATE_LAYOUTS,
  StateID,
  STATES,
  ELECTORATES_HELD_ALLOCATIONS
} from '../../lib/constants';
import {
  determineIfAllocationIsDefinitive,
  determineIfAllocationIsMade,
  determineIfAllocationShouldFlip,
  determineIfAllocationWasPreserved
} from '../../lib/utils';
import { MULTI_STATE_LAYOUT_CONFIG_ARGS, SINGLE_STATE_LAYOUT_CONFIG_ARGS, SVG_SIZE } from './constants';
import Defs from './defs';
import styles from './styles.scss';
import type { ElectoratesRenderProps, LayoutConfig, LayoutsConfigs } from './types';
import { generateComponentID, generateElementIDRecord, getLayoutConfig } from './utils';

const LAYOUTS_CONFIGS: Partial<LayoutsConfigs> = {
  [Layout.COUNTRY]: getLayoutConfig(Layout.COUNTRY, 14, [47, 2]),
  [Layout.EXPLODED]: getLayoutConfig(Layout.EXPLODED, 16.75, [20, 2]),
  [Layout.GRID]: getLayoutConfig(Layout.GRID, 20, [2, 72]),
  [Layout.ACT]: getLayoutConfig(Layout.ACT, ...SINGLE_STATE_LAYOUT_CONFIG_ARGS),
  [Layout.NSW]: getLayoutConfig(Layout.NSW, ...SINGLE_STATE_LAYOUT_CONFIG_ARGS),
  [Layout.NT]: getLayoutConfig(Layout.NT, ...SINGLE_STATE_LAYOUT_CONFIG_ARGS),
  [Layout.QLD]: getLayoutConfig(Layout.QLD, ...SINGLE_STATE_LAYOUT_CONFIG_ARGS),
  [Layout.SA]: getLayoutConfig(Layout.SA, ...SINGLE_STATE_LAYOUT_CONFIG_ARGS),
  [Layout.TAS]: getLayoutConfig(Layout.TAS, ...SINGLE_STATE_LAYOUT_CONFIG_ARGS),
  [Layout.VIC]: getLayoutConfig(Layout.VIC, ...SINGLE_STATE_LAYOUT_CONFIG_ARGS),
  [Layout.WA]: getLayoutConfig(Layout.WA, ...SINGLE_STATE_LAYOUT_CONFIG_ARGS),
  [Layout.ACT_NT]: getLayoutConfig(Layout.ACT_NT, ...MULTI_STATE_LAYOUT_CONFIG_ARGS),
  [Layout.NSW_QLD]: getLayoutConfig(Layout.NSW_QLD, ...MULTI_STATE_LAYOUT_CONFIG_ARGS),
  [Layout.NSW_VIC]: getLayoutConfig(Layout.NSW_VIC, ...MULTI_STATE_LAYOUT_CONFIG_ARGS),
  [Layout.QLD_VIC]: getLayoutConfig(Layout.QLD_VIC, ...MULTI_STATE_LAYOUT_CONFIG_ARGS),
  [Layout.QLD_WA]: getLayoutConfig(Layout.QLD_WA, ...MULTI_STATE_LAYOUT_CONFIG_ARGS),
  [Layout.QLD_NSW_VIC]: getLayoutConfig(Layout.QLD_NSW_VIC, ...MULTI_STATE_LAYOUT_CONFIG_ARGS),
  [Layout.SA_TAS_WA]: getLayoutConfig(Layout.SA_TAS_WA, ...MULTI_STATE_LAYOUT_CONFIG_ARGS)
};

export type TilegramProps = {
  layout: Layout;
  allocations?: Allocations;
  annotations?: Annotations;
  certainties?: Certainties;
  focuses?: Focuses;
  inset?: boolean;
  relative?: boolean;
  onTapElectorate?: (electorateID: string, event: React.MouseEvent<Element>) => void;
};

export const DEFAULT_PROPS: TilegramProps = {
  layout: DEFAULT_LAYOUT,
  inset: false,
  relative: false
};

const Tilegram: React.FC<TilegramProps> = props => {
  const [isInspecting, setIsInspecting] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const componentID = useMemo(generateComponentID, []);
  const elementsIDs = generateElementIDRecord(['hexClipPath', 'hexPolygon', 'statesPolygons'], componentID);
  const { allocations, annotations, certainties, focuses, inset, layout, onTapElectorate, relative } = {
    ...DEFAULT_PROPS,
    ...props
  };
  const isSingleStateLayout = SINGLE_STATE_LAYOUTS.indexOf(layout) !== -1;
  const relativeAllocations = relative && ELECTORATES_HELD_ALLOCATIONS;
  const hasFocuses = focuses && Object.keys(focuses).some(key => focuses[key] !== NoYes.No);
  const hasInsetStateLabels = typeof inset === 'boolean' && inset;
  const isInteractive = !!onTapElectorate;
  const { electoratesPositions, statesPolygons, statesLabelsPositions, hex } = useMemo(
    () => LAYOUTS_CONFIGS[layout] as LayoutConfig,
    [layout]
  );
  const electoratesRenderProps = useMemo(
    () =>
      Object.values(ELECTORATES).reduce<ElectoratesRenderProps>((memo, electorate) => {
        const id = ElectorateID[electorate.id];
        const allocation = allocations ? allocations[id] : Allocation.None;
        const relativeAllocation = relativeAllocations ? relativeAllocations[id] : undefined;
        const certainty = certainties ? certainties[id] : NoYes.Yes;
        const label = electorate[isSingleStateLayout ? 'name' : 'abbr'];
        const hasLongLabel = label.length > 9 || (label.length > 8 && (label.match(/w|m/gi) || []).length > 1);
        const multiLineLabel =
          isSingleStateLayout && hasLongLabel && label.match(/[-\s]/) ? label.match(/\w+\b-?/g) : null;

        return {
          ...memo,
          [electorate.id]: {
            id,
            label,
            hasLongLabel,
            multiLineLabel,
            allocation,
            hasAllocation: allocation && determineIfAllocationIsMade(allocation),
            hasDefinitiveAllocation: allocation && determineIfAllocationIsDefinitive(allocation),
            relativeAllocation,
            wasAllocationPreserved:
              relativeAllocation && determineIfAllocationWasPreserved(allocation, relativeAllocation),
            annotation: annotations ? annotations[id] : NoYes.No,
            certainty,
            focus: focuses ? focuses[id] : NoYes.No,
            shouldFlip:
              relativeAllocation && determineIfAllocationShouldFlip(allocation, relativeAllocation, certainty),
            gTransform: `translate(${electoratesPositions[id][0]} ${electoratesPositions[id][1]})`
          }
        };
      }, {}),
    [allocations, annotations, certainties, electoratesPositions, focuses, relativeAllocations]
  );

  // Tapping an electorate background calls the onTapElectorate function prop
  // (if it's defined) with the element's respective electorate ID
  const onTapElectorateHex = (event: React.MouseEvent<SVGUseElement>) => {
    if (onTapElectorate && event.target instanceof SVGUseElement) {
      const electorateID = event.target.getAttribute('data-electorate');

      if (electorateID) {
        onTapElectorate(electorateID, event);
      }
    }
  };

  // We need to trick svg4everyone (a PL-included polyfill) into not nuking
  // our <use> elements, by making it think the <svg>'s nodeName isn't "svg"
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

  // We need to manually manage data-attributes to trigger flips for every
  // allocation change that warrants one, because React would only add it
  // once and trigger one flip, when we want subsequent ones. Used along
  // with the polygon element's onAnimationEnd event to perform the reset.
  useLayoutEffect(() => {
    const svgEl = svgRef.current;

    if (!relativeAllocations || !svgEl) {
      return;
    }

    Object.values(electoratesRenderProps).forEach(({ id, allocation, shouldFlip }) => {
      const electorateHex = svgEl.querySelector(`[class="${styles.electorateHex}"][data-electorate="${id}"]`);

      if (!electorateHex) {
        return;
      }

      if (!shouldFlip) {
        electorateHex.removeAttribute('data-last-flipped-allocation');
        return;
      }

      const previousAllocation = electorateHex.getAttribute('data-last-flipped-allocation');

      if (!previousAllocation || previousAllocation !== allocation) {
        electorateHex.setAttribute('data-last-flipped-allocation', allocation);
        electorateHex.setAttribute('data-should-flip', '');
      }
    });
  }, [svgRef.current, allocations, relativeAllocations]);

  // <see useLayoutEffect above>
  const onFlipFinished = (event: React.AnimationEvent<SVGUseElement>) =>
    event.currentTarget.removeAttribute('data-should-flip');

  // While the alt key is held down on an interactive graphic, we enable
  // 'inspecting' mode. Currentnly, this displays labels on each electorate to
  // help with authoring graphics in the editor.
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

  const defs = useMemo(() => <Defs elementsIDs={elementsIDs} hex={hex} statesPolygons={statesPolygons} />, [layout]);

  return (
    <div
      className={styles.root}
      data-layout={layout}
      data-is-single-state-layout={isSingleStateLayout ? '' : undefined}
      data-has-focuses={hasFocuses ? '' : undefined}
      data-has-inset-state-labels={hasInsetStateLabels ? '' : undefined}
      data-is-interactive={isInteractive ? '' : undefined}
      data-is-inspecting={isInspecting ? '' : undefined}
    >
      <svg ref={svgRef} className={styles.svg} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}>
        {defs}
        <g>
          <g className={styles.base}>
            <use xlinkHref={`#${elementsIDs.statesPolygons}`} className={styles.baseOuter} />
            <use xlinkHref={`#${elementsIDs.statesPolygons}`} className={styles.baseInner} />
          </g>
          <g className={styles.electorates} onClick={onTapElectorateHex}>
            {Object.values(electoratesRenderProps).map(
              ({
                id,
                label,
                hasLongLabel,
                multiLineLabel,
                allocation,
                hasAllocation,
                hasDefinitiveAllocation,
                relativeAllocation,
                wasAllocationPreserved,
                annotation,
                certainty,
                focus,
                gTransform
              }) => (
                <g
                  key={id}
                  className={styles.electorate}
                  transform={gTransform}
                  data-has-long-label={hasLongLabel ? '' : undefined}
                  data-has-multi-line-label={multiLineLabel ? '' : undefined}
                  data-allocation={allocation}
                  data-has-allocation={hasAllocation ? '' : undefined}
                  data-has-definitive-allocation={hasDefinitiveAllocation ? '' : undefined}
                  data-relative-allocation={relativeAllocation || undefined}
                  data-was-allocation-preserved={wasAllocationPreserved ? '' : undefined}
                  data-annotation={annotation}
                  data-certainty={certainty}
                  data-focus={focus}
                >
                  <g clipPath={`url(#${elementsIDs.hexClipPath})`}>
                    <use
                      xlinkHref={`#${elementsIDs.hexPolygon}`}
                      className={styles.electorateHex}
                      onAnimationEnd={onFlipFinished}
                      data-electorate={id}
                    />
                  </g>
                  <use xlinkHref={`#${elementsIDs.hexPolygon}`} className={styles.electorateHexOutline} />
                  {(isInspecting || annotation === NoYes.Yes) && (
                    <text className={styles.electorateLabel}>
                      {multiLineLabel
                        ? multiLineLabel.map((line, index) => (
                            <tspan key={index} x="0" y="-0.6em" dy={`${index * 1.2}em`}>
                              {line}
                            </tspan>
                          ))
                        : label}
                    </text>
                  )}
                </g>
              )
            )}
          </g>
          <use xlinkHref={`#${elementsIDs.statesPolygons}`} className={styles.statesBorders} />
          <g className={styles.statesLabels}>
            {Object.keys(statesLabelsPositions).map(stateID => {
              const label = STATES.find(({ id }) => id === StateID[stateID])?.caps;
              const position = statesLabelsPositions[stateID];

              return (
                <React.Fragment key={stateID}>
                  <text
                    className={styles.stateLabel}
                    x={position[0]}
                    y={position[1]}
                    data-state={stateID}
                    data-is-outline
                  >
                    {label}
                  </text>
                  <text className={styles.stateLabel} x={position[0]} y={position[1]} data-state={stateID}>
                    {label}
                  </text>
                </React.Fragment>
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Tilegram;
