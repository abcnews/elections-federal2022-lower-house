import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import {
  Layout,
  ElectorateID,
  ELECTORATE_IDS,
  ELECTORATES,
  Allocation,
  Allocations,
  ALLOCATIONS,
  INITIAL_ELECTORATES_ALLOCATIONS,
  Focus,
  Focuses,
  INITIAL_ELECTORATES_FOCUSES,
  ElectionYear,
  ELECTION_YEARS,
  MIXINS,
  PRESETS,
  LAYOUT_LABELS
} from '../../constants';
import {
  alternatingCaseToGraphicProps,
  graphicPropsToAlternatingCase,
  urlQueryToGraphicProps,
  graphicPropsToUrlQuery
} from '../../utils';
import type { GraphicProps } from '../Graphic';
import Graphic, { DEFAULT_PROPS as DEFAULT_GRAPHIC_PROPS } from '../Graphic';
import graphicStyles from '../Graphic/styles.scss';
import Icon from '../Icon';
import tilegramStyles from '../Tilegram/styles.scss';
import totalsStyles from '../Totals/styles.scss';
import styles from './styles.scss';

const COMPONENTS_STYLES = {
  Graphic: graphicStyles,
  Totals: totalsStyles,
  Tilegram: tilegramStyles
};

const INITIAL_GRAPHIC_PROPS = {
  allocations: { ...INITIAL_ELECTORATES_ALLOCATIONS },
  focuses: { ...INITIAL_ELECTORATES_FOCUSES }
};

const STORY_MARKERS = [
  { h3: 'Standalone graphic', prefix: 'lhgraphic' },
  {
    h3: 'Scrollyteller opener',
    note: `If you're placing multiple scrollytellers in a single story, each must have a unique NAME.`,
    prefix: 'scrollytellerNAMEecblock'
  },
  { h3: 'Scrollyteller mark', prefix: 'mark' }
];

const SNAPSHOTS_LOCALSTORAGE_KEY = 'lheditorsnapshots';

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
  const [focuses, setFocuses] = useState<Focuses>(initialUrlParamProps.focuses);
  const [year, setYear] = useState<ElectionYear>(initialUrlParamProps.year);
  const [relative, setRelative] = useState<number | null>(initialUrlParamProps.relative);
  const [counting, setCounting] = useState(initialUrlParamProps.counting);
  const [snapshots, setSnapshots] = useState(JSON.parse(localStorage.getItem(SNAPSHOTS_LOCALSTORAGE_KEY) || '{}'));

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

  const mixinGraphicProps = (mixin: GraphicProps) => {
    setAllocations({
      ...allocations,
      ...mixin.allocations
    });
    setFocuses({
      ...focuses,
      ...mixin.focuses
    });
    setYear(mixin.year || year);
  };

  const replaceGraphicProps = (replacement: GraphicProps) => {
    setAllocations({
      ...INITIAL_ELECTORATES_ALLOCATIONS,
      ...replacement.allocations
    });
    setFocuses({
      ...INITIAL_ELECTORATES_FOCUSES,
      ...replacement.focuses
    });
    setYear(replacement.year || DEFAULT_GRAPHIC_PROPS.year);
  };

  const importMarker = (marker: string) => {
    const graphicProps = alternatingCaseToGraphicProps(marker);

    replaceGraphicProps(graphicProps);
    setRelative(graphicProps.relative || DEFAULT_GRAPHIC_PROPS.relative);
    setCounting(graphicProps.counting || DEFAULT_GRAPHIC_PROPS.counting);
  };

  const onTapElectorate = (electorateID: string) => {
    const allocationsToMixin: Allocations = {};

    const allocation = allocations[electorateID];
    const allocationIndex = ALLOCATIONS.indexOf(allocation);

    // Cycle to the next Allocation in the enum (or the first if we don't recognise it)
    allocationsToMixin[electorateID] = ALLOCATIONS[
      allocationIndex === ALLOCATIONS.length - 1 ? 0 : allocationIndex + 1
    ] as Allocation;

    mixinGraphicProps({ allocations: allocationsToMixin });
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
          [electorateID]: nextFocusedElectorateIDs.indexOf(electorateID) > -1 ? Focus.Yes : Focus.No
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
          [electorateID]: Focus.No
        }),
        {}
      )
    });

  const graphicProps = useMemo(
    () => ({
      ...initialUrlParamProps,
      layout,
      allocations,
      focuses,
      year,
      relative,
      counting
    }),
    [layout, allocations, focuses, year, relative, counting]
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
        <Graphic onTapElectorate={onTapElectorate} {...graphicProps} />
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
        <h3>
          Current year <small>(set sides)</small>
        </h3>
        <div className={styles.flexRow}>
          {ELECTION_YEARS.map(_year => (
            <span key={_year}>
              <label>
                <input
                  type="radio"
                  name="year"
                  value={_year}
                  checked={_year === year}
                  onChange={() => setYear(_year)}
                ></input>
                {_year}
              </label>
            </span>
          ))}
        </div>
        <h3>
          Relative year <small>(show holder outlines and flips)</small>
        </h3>
        <div className={styles.flexRow}>
          <span key="none">
            <label>
              <input
                type="radio"
                name="relative"
                value={'none'}
                checked={null === relative}
                onChange={() => setRelative(null)}
              ></input>
              None
            </label>
          </span>
          {Object.keys(PRESETS)
            .map(key => parseInt(key, 10))
            .filter(key => !isNaN(key))
            .reverse()
            .map(year => (
              <span key={year}>
                <label>
                  <input
                    type="radio"
                    name="relative"
                    value={year}
                    checked={year === relative}
                    onChange={() => setRelative(year)}
                  ></input>
                  {year}
                </label>
              </span>
            ))}
        </div>
        <h3>Counting</h3>
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
              Show totals
            </label>
          </span>
        </div>

        <h3>
          {`Focused Electorates `}
          <small>{`(${Object.keys(focuses).filter(key => focuses[key] === Focus.Yes).length} selected)`}</small>
          <button
            onClick={onClearFocuses}
            disabled={Object.keys(focuses).filter(key => focuses[key] === Focus.Yes).length === 0}
          >
            <Icon name="delete" />
          </button>
        </h3>
        <div className={styles.flexRow}>
          <select
            multiple
            value={Object.keys(focuses).filter(key => focuses[key] === Focus.Yes)}
            onChange={onChangeFocusedElectorates}
          >
            {ELECTORATE_IDS.map(electorateID => (
              <option key={electorateID} value={electorateID}>
                {`${electorateID} - ${ELECTORATES.find(({ id }) => id === ElectorateID[electorateID])?.name}`}
              </option>
            ))}
          </select>
        </div>
        <h3>
          Mix-ins <small>(added to the map)</small>
        </h3>
        <div className={styles.flexRow}>
          {Object.keys(MIXINS).map(key => {
            const { name, ...graphicProps } = MIXINS[key];

            return (
              <button key={key} onClick={() => mixinGraphicProps(graphicProps)}>
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
            const { name, ...graphicProps } = PRESETS[key];

            return (
              <button key={key} onClick={() => replaceGraphicProps(graphicProps)}>
                {name || key}
              </button>
            );
          })}
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
