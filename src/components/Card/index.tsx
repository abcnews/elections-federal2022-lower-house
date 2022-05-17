import React, { useEffect, useState } from 'react';
import { Allocation, Electorate, ElectorateID, ELECTORATES, NoYes } from '../../lib/constants';
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
  certainty?: NoYes;
}

const Hex: React.FC<HexProps> = ({ allocation, certainty }) => (
  <div className={styles.hex} data-allocation={allocation || undefined} data-certainty={certainty || undefined}>
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
    if (!hasResult) {
      return;
    }

    fetchLiveResultsElectorates().then(electorates =>
      setResult(electorates.find(electorate => electorate.code === ((electorateID as unknown) as ElectorateID)))
    );

    return () => {
      setResult(undefined);
    };
  }, [electorateID, hasResult]);

  if (!electorate) {
    return <div data-unrecognised-electorate={electorateID}></div>;
  }

  if (hasResult && !result) {
    return <div data-loading={electorateID}></div>;
  }

  const timeUpdated = result?.updated ? new Date(result.updated) : null;

  const electoratePastWinners = pastWinners[electorateID];
  // TODO: determine allocation / certainty on result if available
  const allocation = Allocation.Any;
  const certainty = NoYes.No;

  return (
    <div className={styles.root}>
      <div className={styles.flex}>
        <h4 className={styles.title}>
          <Hex allocation={allocation} certainty={certainty} />
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
