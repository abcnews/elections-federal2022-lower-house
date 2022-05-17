import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import type { ItemParams } from 'react-contexify';
import { Menu, Item, Separator, useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import {
  Allocation,
  Allocations,
  Annotations,
  Certainties,
  ElectorateID,
  ELECTORATE_IDS,
  Electorate,
  ELECTORATES,
  Focuses,
  INITIAL_ELECTORATES_ALLOCATIONS,
  INITIAL_ELECTORATES_ANNOTATIONS,
  INITIAL_ELECTORATES_CERTAINTIES,
  INITIAL_ELECTORATES_FOCUSES,
  Layout,
  LAYOUT_LABELS,
  NoYes
} from '../../lib/constants';
import { fetchLiveResultsElectorates, getLiveResultsElectorateAllocation } from '../../lib/data';
import {
  alternatingCaseToGraphicProps,
  graphicPropsToAlternatingCase,
  urlQueryToGraphicProps,
  graphicPropsToUrlQuery
} from '../../lib/utils';
import type { GraphicProps } from '../Graphic';
import Graphic, { DEFAULT_PROPS as DEFAULT_GRAPHIC_PROPS } from '../Graphic';
import graphicStyles from '../Graphic/styles.scss';
import Icon from '../Icon';
import tilegramStyles from '../Tilegram/styles.scss';
import totalsStyles from '../Totals/styles.scss';
import candidates from './candidates.json';
import { MIXINS, PRESETS } from './constants';
import styles from './styles.scss';

const COMPONENTS_STYLES = {
  Graphic: graphicStyles,
  Totals: totalsStyles,
  Tilegram: tilegramStyles
};

const INITIAL_GRAPHIC_PROPS = {
  allocations: { ...INITIAL_ELECTORATES_ALLOCATIONS },
  annotations: { ...INITIAL_ELECTORATES_ANNOTATIONS },
  certainties: { ...INITIAL_ELECTORATES_CERTAINTIES },
  focuses: { ...INITIAL_ELECTORATES_FOCUSES }
};

const STORY_MARKERS = [
  { h3: 'Standalone graphic', prefix: 'lhgraphic' },
  {
    h3: 'Scrollyteller opener',
    note: `If you're placing multiple scrollytellers in a single story, each must have a unique NAME.`,
    prefix: 'scrollytellerNAMElhblock'
  },
  { h3: 'Scrollyteller mark', prefix: 'mark' }
];

const SNAPSHOTS_LOCALSTORAGE_KEY = 'lheditorsnapshots';
const CONTEXT_MENU_ID = 'context_menu';

const Editor: React.FC = () => {
  const initialUrlParamProps = useMemo(
    () => ({
      ...INITIAL_GRAPHIC_PROPS,
      ...DEFAULT_GRAPHIC_PROPS,
      ...urlQueryToGraphicProps(String(window.location.search))
    }),
    []
  );
  const [layout, setLayout] = useState<Layout>(initialUrlParamProps.layout);
  const [allocations, setAllocations] = useState<Allocations>(initialUrlParamProps.allocations);
  const [annotations, setAnnotations] = useState<Annotations>(initialUrlParamProps.annotations);
  const [certainties, setCertainties] = useState<Certainties>(initialUrlParamProps.certainties);
  const [focuses, setFocuses] = useState<Focuses>(initialUrlParamProps.focuses);
  const [counting, setCounting] = useState<boolean>(initialUrlParamProps.counting);
  const [inset, setInset] = useState<boolean>(initialUrlParamProps.inset);
  const [relative, setRelative] = useState<boolean>(initialUrlParamProps.relative);
  const [snapshots, setSnapshots] = useState(JSON.parse(localStorage.getItem(SNAPSHOTS_LOCALSTORAGE_KEY) || '{}'));
  const [lastTappedElectorate, setLastTappedElectorate] = useState<Electorate>();
  const { show: showContextMenu } = useContextMenu({
    id: CONTEXT_MENU_ID
  });

  const createSnapshot = (name: string, urlQuery: string) => {
    const nextSnapshots = {
      [name]: urlQuery,
      ...snapshots
    };

    localStorage.setItem(SNAPSHOTS_LOCALSTORAGE_KEY, JSON.stringify(nextSnapshots));
    setSnapshots(nextSnapshots);
  };

  const deleteSnapshot = (name: string) => {
    const nextSnapshots = { ...snapshots };

    delete nextSnapshots[name];

    localStorage.setItem(SNAPSHOTS_LOCALSTORAGE_KEY, JSON.stringify(nextSnapshots));
    setSnapshots(nextSnapshots);
  };

  const mixinGraphicProps = (mixin: Partial<GraphicProps>) => {
    setAllocations({
      ...allocations,
      ...(mixin.allocations || {})
    });
    setAnnotations({
      ...annotations,
      ...(mixin.annotations || {})
    });
    setCertainties({
      ...certainties,
      ...(mixin.certainties || {})
    });
    setFocuses({
      ...focuses,
      ...(mixin.focuses || {})
    });
  };

  const replaceGraphicProps = (replacement: Partial<GraphicProps>) => {
    setAllocations({
      ...INITIAL_ELECTORATES_ALLOCATIONS,
      ...(replacement.allocations || {})
    });
    setAnnotations({
      ...INITIAL_ELECTORATES_ANNOTATIONS,
      ...(replacement.annotations || {})
    });
    setCertainties({
      ...INITIAL_ELECTORATES_CERTAINTIES,
      ...(replacement.certainties || {})
    });
    setFocuses({
      ...INITIAL_ELECTORATES_FOCUSES,
      ...(replacement.focuses || {})
    });
  };

  const replaceAllocationsWithLiveResults = async () => {
    const electorates = await fetchLiveResultsElectorates();

    setAllocations(
      electorates.reduce<Allocations>(
        (memo, electorate) => {
          const allocation = getLiveResultsElectorateAllocation(electorate);

          if (allocation !== Allocation.None) {
            memo[electorate.code] = allocation;
          }

          return memo;
        },
        { ...INITIAL_ELECTORATES_ALLOCATIONS }
      )
    );
  };

  const importMarker = (marker: string) => {
    const graphicProps = alternatingCaseToGraphicProps(marker);

    replaceGraphicProps(graphicProps);
    setCounting(graphicProps.counting || DEFAULT_GRAPHIC_PROPS.counting || false);
  };

  const onTapElectorate = (electorateID: string, event: React.MouseEvent<Element>) => {
    const electorate = ELECTORATES.find(
      ({ id }) => ((id as unknown) as string) === ElectorateID[electorateID]
    ) as Electorate;

    setLastTappedElectorate(electorate);
    showContextMenu(event);
  };

  const onTapContextMenuItem = ({
    data
  }: ItemParams<any, { allocation?: Allocation; annotation?: NoYes; certainty?: NoYes; focus?: NoYes }>) => {
    if (!data || !lastTappedElectorate) {
      return;
    }

    const electorateID = ElectorateID[lastTappedElectorate.id];
    const { allocation, annotation, certainty, focus } = data;

    if (allocation) {
      mixinGraphicProps({
        allocations: {
          [electorateID]: allocation
        }
      });
    } else if (annotation) {
      mixinGraphicProps({
        annotations: {
          [electorateID]: annotation
        }
      });
    } else if (certainty) {
      mixinGraphicProps({
        certainties: {
          [electorateID]: certainty
        }
      });
    } else if (focus) {
      mixinGraphicProps({
        focuses: {
          [electorateID]: focus
        }
      });
    }
  };

  const onChangeFocusedElectorates = (event: ChangeEvent<HTMLSelectElement>) => {
    const options = event.target.options;
    const nextFocusedElectorateIDs: string[] = [];

    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        nextFocusedElectorateIDs.push(options[i].value);
      }
    }

    mixinGraphicProps({
      focuses: ELECTORATE_IDS.reduce<Focuses>(
        (focuses, electorateID) => ({
          ...focuses,
          [electorateID]: nextFocusedElectorateIDs.indexOf(electorateID) > -1 ? NoYes.Yes : NoYes.No
        }),
        {}
      )
    });
  };

  const onClearFocuses = () =>
    mixinGraphicProps({
      focuses: ELECTORATE_IDS.reduce<Focuses>(
        (focuses, electorateID) => ({
          ...focuses,
          [electorateID]: NoYes.No
        }),
        {}
      )
    });

  const graphicProps = useMemo(
    () => ({
      ...initialUrlParamProps,
      layout,
      allocations,
      annotations,
      certainties,
      focuses,
      counting,
      inset,
      relative
    }),
    [layout, allocations, annotations, certainties, focuses, counting, inset, relative]
  );

  const graphicPropsAsAlternatingCase = useMemo(
    () => graphicPropsToAlternatingCase(graphicProps, DEFAULT_GRAPHIC_PROPS),
    [graphicProps]
  );
  const graphicPropsAsUrlQuery = useMemo(() => graphicPropsToUrlQuery(graphicProps, DEFAULT_GRAPHIC_PROPS), [
    graphicProps
  ]);

  const markersData = useMemo(
    () =>
      STORY_MARKERS.map(({ h3, note, prefix }) => ({
        h3,
        note,
        text: `#${prefix}${graphicPropsAsAlternatingCase}`
      })),
    [graphicPropsAsAlternatingCase]
  );

  const fallbackAutomationBaseURL = useMemo(
    () =>
      `https://fallback-automation.drzax.now.sh/api?url=${encodeURIComponent(
        String(document.location.href).split('?')[0] + graphicPropsAsUrlQuery
      )}&width=600&selector=.`,
    [graphicPropsAsUrlQuery]
  );

  useEffect(() => {
    history.replaceState(graphicProps, document.title, graphicPropsAsUrlQuery);
  }, [graphicPropsAsUrlQuery]);

  return (
    <div className={styles.root}>
      <div className={styles.graphic}>
        <Graphic onTapElectorate={onTapElectorate} willChange={true} {...graphicProps} />
        <Menu id={CONTEXT_MENU_ID}>
          {lastTappedElectorate && (
            <>
              <Item disabled>
                <strong>{lastTappedElectorate.name}</strong>
              </Item>
              <Separator />
              <Item
                data={{
                  focus: focuses[ElectorateID[lastTappedElectorate.id]] === NoYes.Yes ? NoYes.No : NoYes.Yes
                }}
                onClick={onTapContextMenuItem}
              >
                {`${focuses[ElectorateID[lastTappedElectorate.id]] === NoYes.Yes ? '☑︎' : '☐'} Focused`}
              </Item>
              <Item
                data={{
                  annotation: annotations[ElectorateID[lastTappedElectorate.id]] === NoYes.Yes ? NoYes.No : NoYes.Yes
                }}
                onClick={onTapContextMenuItem}
              >
                {`${annotations[ElectorateID[lastTappedElectorate.id]] === NoYes.Yes ? '☑︎' : '☐'} Labeled`}
              </Item>
              <Item
                data={{
                  certainty: certainties[ElectorateID[lastTappedElectorate.id]] === NoYes.Yes ? NoYes.No : NoYes.Yes
                }}
                onClick={onTapContextMenuItem}
              >
                {`${certainties[ElectorateID[lastTappedElectorate.id]] === NoYes.Yes ? '☑︎' : '☐'} Certain`}
              </Item>
              <Separator />
              <Item data={{ allocation: Allocation.None }} onClick={onTapContextMenuItem}>
                <div data-allocation={Allocation.None}>None</div>
              </Item>
              <Item data={{ allocation: Allocation.Any }} onClick={onTapContextMenuItem}>
                <div data-allocation={Allocation.Any}>Any</div>
              </Item>
              {[...candidates[ElectorateID[lastTappedElectorate.id]]].sort().map(candidate => (
                <Item key={candidate} data={{ allocation: Allocation[candidate] }} onClick={onTapContextMenuItem}>
                  <div data-allocation={Allocation[candidate]}>{candidate}</div>
                </Item>
              ))}
            </>
          )}
        </Menu>
      </div>
      <div className={styles.controls}>
        <h3>Layout</h3>
        <div className={styles.flexRow}>
          {Object.keys(LAYOUT_LABELS).map(key => {
            return (
              <button key={key} disabled={key === layout} onClick={() => setLayout(key as Layout)}>
                {LAYOUT_LABELS[key]}
              </button>
            );
          })}
        </div>
        <h3>Feature Toggles</h3>
        <div className={styles.flexRow}>
          <span key="none">
            <label>
              <input
                type="checkbox"
                name="counting"
                value="counting"
                checked={counting}
                onChange={() => setCounting(!counting)}
              ></input>
              Race-to-76 bars
            </label>
          </span>
        </div>
        <div className={styles.flexRow}>
          <span key="none">
            <label>
              <input
                type="checkbox"
                name="inset"
                value="inset"
                checked={inset}
                onChange={() => setInset(!inset)}
              ></input>
              Inset state labels
            </label>
          </span>
        </div>
        <div className={styles.flexRow}>
          <span key="none">
            <label>
              <input
                type="checkbox"
                name="relative"
                value="relative"
                checked={relative}
                onChange={() => setRelative(!relative)}
              ></input>
              Incumbent outlines and flips
            </label>
          </span>
        </div>
        <h3>
          {`Focused Electorates `}
          <small>{`(${Object.keys(focuses).filter(key => focuses[key] === NoYes.Yes).length} selected)`}</small>
          <button
            onClick={onClearFocuses}
            disabled={Object.keys(focuses).filter(key => focuses[key] === NoYes.Yes).length === 0}
          >
            <Icon name="delete" />
          </button>
        </h3>
        <div className={styles.flexRow}>
          <select
            multiple
            value={Object.keys(focuses).filter(key => focuses[key] === NoYes.Yes)}
            onChange={onChangeFocusedElectorates}
          >
            {ELECTORATE_IDS.map(electorateID => (
              <option key={electorateID} value={electorateID}>
                {`${electorateID} - ${ELECTORATES.find(({ id }) => id === ElectorateID[electorateID])?.name}`}
              </option>
            ))}
          </select>
        </div>
        <br></br>
        <div className={styles.flexRow}>
          {Object.keys(MIXINS)
            .filter(key => MIXINS[key].focuses)
            .map(key => {
              const { name, focuses: mixinFocuses } = MIXINS[key];

              return (
                <button
                  key={key}
                  disabled={Object.keys(mixinFocuses as Focuses).every(key => focuses[key] === NoYes.Yes) || undefined}
                  onClick={() => mixinGraphicProps({ focuses: mixinFocuses })}
                >
                  {name || key}
                </button>
              );
            })}
        </div>
        <h3>
          Mix-ins <small>(added to the map)</small>
        </h3>
        <div className={styles.flexRow}>
          {Object.keys(MIXINS).map(key => {
            const { name, allocations } = MIXINS[key];

            return (
              <button key={key} onClick={() => mixinGraphicProps({ allocations })}>
                {name || key}
              </button>
            );
          })}
        </div>
        <h3>
          Presets <small>(replace the whole map)</small>
        </h3>
        <div className={styles.flexRow}>
          <button key="empty" onClick={() => replaceGraphicProps({})}>
            Empty
          </button>
          {Object.keys(PRESETS).map(key => {
            const { name, allocations } = PRESETS[key];

            return (
              <button key={key} onClick={() => replaceGraphicProps({ allocations })}>
                {name || key}
              </button>
            );
          })}
          <button key="live" onClick={() => replaceAllocationsWithLiveResults()}>
            Live Results
          </button>
        </div>
        <h3>
          Story markers
          <button
            onClick={() => {
              const marker = prompt('Paste a marker here to import its configuration');

              if (!marker || !marker.length) {
                return alert('No marker was provided');
              }

              importMarker(marker);
            }}
          >
            <Icon name="edit" />
          </button>
        </h3>
        {markersData.map(({ h3, note, text }) => (
          <details key={h3}>
            <summary>
              {h3}
              <button onClick={() => navigator.clipboard.writeText(text)}>
                <Icon name="share" />
              </button>
            </summary>
            <pre>{text}</pre>
            {note && <small style={{ color: 'red' }}>{`Note: ${note}`}</small>}
          </details>
        ))}
        <h3>
          Snapshots
          <button
            onClick={() => {
              const name = prompt('What would you like to call this snapshot?');

              if (!name || !name.length) {
                return alert('No name was provided');
              } else if (snapshots[name]) {
                return alert(`Can't overwrite existing snapshot`);
              }

              createSnapshot(name, graphicPropsAsUrlQuery);
            }}
          >
            <Icon name="add" />
          </button>
        </h3>
        <ul>
          {Object.keys(snapshots).map(name => (
            <li key={name}>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(String(window.location.href).split('?')[0] + snapshots[name])
                }
              >
                <Icon name="share" />
              </button>
              <button onClick={() => deleteSnapshot(name)}>
                <Icon name="delete" />
              </button>{' '}
              <a
                href={snapshots[name]}
                onClick={event => {
                  event.preventDefault();
                  replaceGraphicProps(urlQueryToGraphicProps(snapshots[name]));
                }}
              >
                {name}
              </a>
            </li>
          ))}
        </ul>
        <h3>Static image downloads</h3>
        <ul>
          {Object.keys(COMPONENTS_STYLES).map(key => (
            <li key={key}>
              <a
                href={`${fallbackAutomationBaseURL}${encodeURIComponent(COMPONENTS_STYLES[key].root)}`}
                download={`fallback-${key}-${graphicPropsAsAlternatingCase}.png`}
              >
                {key}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Editor;
