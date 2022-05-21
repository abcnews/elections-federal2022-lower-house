import React, { useEffect, useState } from 'react';
import { Electorate, ElectorateID, ELECTORATES, State, STATES } from '../../lib/constants';
import type { LiveResultsElectorate } from '../../lib/data';
import { fetchLiveResultsElectorates } from '../../lib/data';
import { Mode } from './constants';
import Candidates from './Candidates';
import PastWinners from './PastWinners';
import styles from './styles.scss';
import { formatTimeUpdated } from './utils';

interface CardProps {
  electorateID: string;
  mode?: Mode;
}

const Card: React.FC<CardProps> = props => {
  const { electorateID, mode } = props;
  const isHistoric = mode === Mode.Historic;
  const electorate: Electorate = ELECTORATES.find(({ id }) => ElectorateID[electorateID] === id) as Electorate;
  const state = STATES.find(({ id }) => electorate.state === id) as State;
  const [result, setResult] = useState<LiveResultsElectorate>();

  useEffect(() => {
    if (isHistoric) {
      return;
    }

    fetchLiveResultsElectorates().then(electorates =>
      setResult(electorates.find(electorate => electorate.code === ((electorateID as unknown) as ElectorateID)))
    );

    return () => {
      setResult(undefined);
    };
  }, [electorateID, mode]);

  if (!electorate) {
    return <div data-unrecognised-electorate={electorateID}></div>;
  }

  if (isHistoric) {
    return (
      <div className={styles.root}>
        <h4 className={styles.title}>{`${electorate.name}, ${state.abbr}`}</h4>
        <PastWinners id={electorateID} />
      </div>
    );
  }

  if (!result) {
    return <div data-loading={electorateID}></div>;
  }

  const countedStatusText = `${result.counted}% counted`;
  const updatedStatusText = `Updated ${formatTimeUpdated(new Date(result.updated))}`;

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h4 className={styles.title}>{`${electorate.name}, ${state.abbr}`}</h4>
        <div className={styles.status}>{countedStatusText}</div>
        {/* <div>{updatedStatusText}</div> */}
      </div>
      <Candidates result={result} is2PP={mode === Mode.Results2PP} />
    </div>
  );
};

export default Card;
