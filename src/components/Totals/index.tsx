import React, { useEffect, useMemo, useRef } from 'react';
import type { Allocations, ElectionYear } from '../../constants';
import { Allocation, DEFAULT_ELECTION_YEAR, ELECTION_YEARS_ALLOCATIONS_CANDIDATES, ELECTORATES } from '../../constants';
import { getVoteCountsForAllocations } from '../../utils';
import styles from './styles.scss';

const MAX_VOTES = ELECTORATES.length;
const WIN_VOTES = Math.ceil((MAX_VOTES + 1) / 2);

function usePrevious(value) {
  const ref = useRef();
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
  const voteCounts = useMemo(() => getVoteCountsForAllocations(allocations || {}), [allocations]);
  const sides = useMemo(() => ELECTION_YEARS_ALLOCATIONS_CANDIDATES[year || DEFAULT_ELECTION_YEAR], [year]);
  const incumbent = useMemo(() => Object.keys(sides)[0], [sides]);
  const previousIncumbent = usePrevious(incumbent);

  const tX = (votes: number, side: Allocation) =>
    side === incumbent ? (votes / MAX_VOTES) * 100 - 100 : (votes / MAX_VOTES) * -100 + 100;

  return (
    <div
      className={styles.root}
      data-incumbent={incumbent}
      data-consistent-incumbent={incumbent === previousIncumbent ? '' : undefined}
    >
      <div className={styles.text}>
        {Object.keys(sides).map(allocation => (
          <div key={allocation} className={styles.side} data-allocation={allocation}>
            <span className={styles.label}>{sides[allocation]}</span>
            <span className={styles.value}>{voteCounts[allocation]}</span>
          </div>
        ))}
      </div>
      <div className={styles.track}>
        <div
          className={styles.bar}
          title={`Likely CLN: ${voteCounts[Allocation.LikelyCLN]}`}
          data-allocation={Allocation.LikelyCLN}
          style={{
            transform: `translate(${tX(
              voteCounts[Allocation.CLN] + voteCounts[Allocation.LikelyCLN],
              Allocation.CLN
            )}%, 0)`
          }}
        ></div>
        <div
          className={styles.bar}
          title={`Likely ALP: ${voteCounts[Allocation.LikelyALP]}`}
          data-allocation={Allocation.LikelyALP}
          style={{
            transform: `translate(${tX(
              voteCounts[Allocation.ALP] + voteCounts[Allocation.LikelyALP],
              Allocation.ALP
            )}%, 0)`
          }}
        ></div>
        <div
          className={styles.bar}
          title={`CLN: ${voteCounts[Allocation.CLN]}`}
          data-allocation={Allocation.CLN}
          style={{ transform: `translate(${tX(voteCounts[Allocation.CLN], Allocation.CLN)}%, 0)` }}
        ></div>
        <div
          className={styles.bar}
          title={`ALP: ${voteCounts[Allocation.ALP]}`}
          data-allocation={Allocation.ALP}
          style={{ transform: `translate(${tX(voteCounts[Allocation.ALP], Allocation.ALP)}%, 0)` }}
        ></div>
        <div className={styles.midpoint}>
          <div className={styles.midpointLabel}>{`${WIN_VOTES} to win`}</div>
        </div>
      </div>
    </div>
  );
};

export default Totals;
