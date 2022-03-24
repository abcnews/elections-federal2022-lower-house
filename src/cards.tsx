import 'regenerator-runtime/runtime';
import { whenDOMReady } from '@abcnews/env-utils';
import { selectMounts } from '@abcnews/mount-utils';
import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import type { Allocations, ElectorateID } from './lib/constants';
import { Allocation, ELECTORATE_IDS, INITIAL_ELECTORATES_ALLOCATIONS } from './lib/constants';
import { fetchLiveResultsElectorates, getLiveResultsElectorateAllocation } from './lib/data';
import './lib/theme.scss';
import Card from './components/Card';
import cardStyles from './components/Card/styles.scss';
import type { GraphicProps } from './components/Graphic';
import Graphic, { DEFAULT_PROPS as DEFAULT_GRAPHIC_PROPS } from './components/Graphic';
import MarkerCopyButton from './components/MarkerCopyButton';

const Article = () => {
  const [isResults, setIsResults] = useState(false);
  const [graphicProps, setGraphicProps] = useState<GraphicProps>(DEFAULT_GRAPHIC_PROPS as GraphicProps);

  useEffect(() => {
    fetchLiveResultsElectorates().then(electorates => {
      console.log(electorates);
      setGraphicProps({
        ...(DEFAULT_GRAPHIC_PROPS as GraphicProps),
        allocations: electorates.reduce<Allocations>(
          (memo, electorate) => {
            const allocation = getLiveResultsElectorateAllocation(electorate);

            if (allocation !== Allocation.None) {
              memo[electorate.code] = allocation;
            }

            return memo;
          },
          { ...INITIAL_ELECTORATES_ALLOCATIONS }
        )
      });
    });
  }, []);

  function jumpToElectorate(electorateID: string) {
    window.location.hash = `#${electorateID}`;
  }

  return (
    <article style={{ fontFamily: 'ABCSans' }}>
      <style>
        {`
.graphic {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  width: 100%;
}
.graphic > * {
  margin: auto;
  width: 100%;
  max-width: 24rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
}
@media (min-width: 48rem) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 72rem) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (min-width: 96rem) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
article .${cardStyles.root} {
  margin: 0 !important;
}
/*
[data-loading]::after {
  content: attr(data-loading) ' not reporting yet';
  display: inline-block;
  padding: 0 0 3.125rem;
  width: 100%;
}
*/
button {
  margin-top: 0.5rem;
}
      `}
      </style>
      <h1>
        Electorate Cards <button onClick={() => setIsResults(!isResults)}>Toggle Results</button>
      </h1>
      {/* TODO: Live toggle */}
      {/* <div className="graphic">
        <Graphic onTapElectorate={jumpToElectorate} {...graphicProps} />
      </div> */}
      <div className="grid">
        {ELECTORATE_IDS.map(electorateID => (
          <div key={electorateID} id={electorateID}>
            <Card electorateID={electorateID} hasResult={isResults} />
            <MarkerCopyButton text={`#lhcardELECTORATE${electorateID.toLowerCase()}${isResults ? 'RESULT' : ''}`} />
          </div>
        ))}
      </div>
    </article>
  );
};

whenDOMReady.then(() => render(<Article />, selectMounts('lhallcards')[0]));
