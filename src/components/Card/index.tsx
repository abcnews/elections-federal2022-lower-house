import React, { useEffect, useMemo, useState } from 'react';
import {
  Allocation,
  Electorate,
  ElectorateID,
  ELECTORATES,
  ELECTION_YEARS_PRIMARY_ALLIANCES,
  DEFAULT_ELECTION_YEAR,
  DEFAULT_RELATIVE_ELECTION_YEAR
} from '../../lib/constants';
import type { LiveResultsElectorate } from '../../lib/data';
import { fetchLiveResultsElectorates, getLiveResultsElectorateAllocation } from '../../lib/data';
import pastWinners from './past-winners.json';
import styles from './styles.scss';

const MONTH_SHORTNAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const isThisYear = (date: Date, todayDate = new Date()) => {
  return date.getFullYear() === todayDate.getFullYear();
};

const isToday = (date: Date, todayDate = new Date()) => {
  return (
    isThisYear(date, todayDate) && date.getMonth() === todayDate.getMonth() && date.getDate() === todayDate.getDate()
  );
};

interface HexProps {
  allocation?: Allocation;
  relativeAllocation?: Allocation;
}

const Hex: React.FC<HexProps> = ({ allocation, relativeAllocation }) => (
  <div
    className={styles.hex}
    data-allocation={allocation || undefined}
    data-relative-allocation={relativeAllocation || undefined}
  >
    <svg viewBox="0 0 51.3012701892 58">
      <g transform="translate(4 4)">
        <polygon points="0,37.5 21.65,50 43.3,37.5 43.3,12.5 21.65,0 0,12.5 0,37.5"></polygon>
      </g>
    </svg>
  </div>
);

interface CardProps {
  electorateID: string;
  hasResult?: boolean;
}

const Card: React.FC<CardProps> = ({ electorateID, hasResult }) => {
  const electorate: Electorate = ELECTORATES.find(({ id }) => ElectorateID[electorateID] === id) as Electorate;
  const [result, setResult] = useState<LiveResultsElectorate>();

  useEffect(() => {
    fetchLiveResultsElectorates().then(electorates =>
      setResult(electorates.find(electorate => electorate.code === ((electorateID as unknown) as ElectorateID)))
    );
  }, [electorateID]);

  if (!electorate) {
    return <div data-unrecognised-electorate={electorateID}></div>;
  }

  if (hasResult && !result) {
    return <div data-loading={electorateID}></div>;
  }

  const timeUpdated = result?.updated ? new Date(result.updated) : null;

  const electoratePastWinners = pastWinners[electorateID];
  const allocation = result ? undefined : undefined;
  const relativeAllocation = electoratePastWinners[DEFAULT_RELATIVE_ELECTION_YEAR]
    ? Allocation[electoratePastWinners[DEFAULT_RELATIVE_ELECTION_YEAR]]
    : undefined;

  return (
    <div className={styles.root}>
      <div className={styles.flex}>
        <h4 className={styles.title}>
          <Hex allocation={allocation} relativeAllocation={relativeAllocation} />
          {electorate.name}
        </h4>
        {hasResult ? timeUpdated && <div>{`Updated ${formatTimeUpdated(timeUpdated)}`}</div> : <div />}
      </div>
      {!hasResult && Object.keys(electoratePastWinners).length > 0 && (
        <div className={styles.pastWinners}>
          {Object.entries<Allocation>(electoratePastWinners)
            .reverse()
            .map(([year, allocation]) => (
              <div key={year} className={styles.pastWinner} title={allocation} data-allocation={Allocation[allocation]}>
                {year}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Card;

const formatTimeUpdated = (time: Date) => {
  const timeString = time.toString();
  const hours = time.getHours();

  return isToday(time)
    ? `${hours % 12 || 12}:${String(time.getMinutes()).padStart(2, '0')}${
        hours >= 12 ? 'p' : 'a'
      }m ${timeString.substring(timeString.indexOf('(')).replace(/([a-z\s]+)/g, '')}`
    : `${time.getDate()} ${MONTH_SHORTNAMES[time.getMonth()]}${isThisYear(time) ? '' : ` ${time.getFullYear()}`}`;
};
