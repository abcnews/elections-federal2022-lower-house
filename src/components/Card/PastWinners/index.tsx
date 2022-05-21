import React from 'react';
import { Allocation } from '../../../lib/constants';
import ELECTORATES_PAST_WINNERS from './past-winners.json';
import styles from './styles.scss';

interface PastWinnersProps {
  id: string;
}

const PastWinners: React.FC<PastWinnersProps> = ({ id }) => {
  const pastWinners = ELECTORATES_PAST_WINNERS[id] as Record<string, Allocation> | undefined;

  if (!pastWinners) {
    return null;
  }

  return (
    <div className={styles.root}>
      {Object.entries(pastWinners)
        .reverse()
        .map(([year, allocation]) => (
          <div key={year} className={styles.winner} title={allocation} data-allocation={Allocation[allocation]}>
            {year}
          </div>
        ))}
    </div>
  );
};

export default PastWinners;
