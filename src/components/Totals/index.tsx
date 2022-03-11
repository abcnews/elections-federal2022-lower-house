import React, { useEffect, useRef } from 'react';
import type { Alliance, Allocations, ElectionYear } from '../../constants';
import { ALLIANCES, DEFAULT_ELECTION_YEAR, ELECTION_YEARS_PRIMARY_ALLIANCES, ELECTORATES } from '../../constants';
import { getAllocationsCounts } from '../../utils';
import styles from './styles.scss';

const MAX_VOTES = ELECTORATES.length;
const WIN_VOTES = Math.ceil((MAX_VOTES + 1) / 2);

function usePrevious<T>(value: T) {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

export type TotalsProps = {
  year?: ElectionYear;
  allocations?: Allocations;
};

const Totals: React.FC<TotalsProps> = props => {
  const { allocations, year } = props;
  const primaryAlliances = ELECTION_YEARS_PRIMARY_ALLIANCES[year || DEFAULT_ELECTION_YEAR].map(allianceID =>
    ALLIANCES.find(({ id }) => id === allianceID)
  ) as [Alliance, Alliance];
  const [governmentAlliance] = primaryAlliances;
  const previousGovernmentAlliance = usePrevious<Alliance>(governmentAlliance);
  const allocationsCounts = getAllocationsCounts(allocations || {});
  const primaryAllianceCounts = primaryAlliances.map(alliance =>
    alliance.allocations.reduce((count, allocation) => count + allocationsCounts[allocation], 0)
  );

  const tX = (votes: number, alliance: Alliance) =>
    alliance === governmentAlliance ? (votes / MAX_VOTES) * 100 - 100 : (votes / MAX_VOTES) * -100 + 100;

  return (
    <div
      className={styles.root}
      data-government={primaryAlliances[0].id}
      data-consistent-government={
        previousGovernmentAlliance && primaryAlliances[0].id === previousGovernmentAlliance.id ? '' : undefined
      }
    >
      <div className={styles.text}>
        {primaryAlliances.map((alliance, index) => (
          <div key={alliance.id} className={styles.side} data-allocation={alliance.majorAllocation}>
            <span className={styles.label}>{alliance.name}</span>
            <span className={styles.value}>{primaryAllianceCounts[index]}</span>
          </div>
        ))}
      </div>
      <div className={styles.track}>
        {primaryAlliances.map((alliance, index) => (
          <div
            key={alliance.id}
            className={styles.bar}
            title={`${alliance.name}: ${primaryAllianceCounts[index]}`}
            data-allocation={alliance.majorAllocation}
            style={{ transform: `translate(${tX(primaryAllianceCounts[index], alliance)}%, 0)` }}
          ></div>
        ))}
        <div className={styles.midpoint}>
          <div className={styles.midpointLabel}>{`${WIN_VOTES} to win`}</div>
        </div>
      </div>
    </div>
  );
};

export default Totals;
