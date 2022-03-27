import React, { useEffect, useRef } from 'react';
import { Alliance, Allocation, Allocations, ElectionYear } from '../../lib/constants';
import { ALLIANCES, DEFAULT_ELECTION_YEAR, ELECTION_YEARS_PRIMARY_ALLIANCES, ELECTORATES } from '../../lib/constants';
import { getAllocationsCounts } from '../../lib/utils';
import styles from './styles.scss';

const MAX_COUNT = ELECTORATES.length;
const WIN_COUNT = Math.ceil((MAX_COUNT + 1) / 2);
const DEFAULT_EXTENT_VOTES = WIN_COUNT + 8;

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

type Group = {
  name: string;
  shortName: string;
  count: number;
  majorAllocation: Allocation;
};

const Totals: React.FC<TotalsProps> = props => {
  const { allocations, year } = props;
  const allocationsCounts = getAllocationsCounts(allocations || {});
  const primaryAlliances = ELECTION_YEARS_PRIMARY_ALLIANCES[year || DEFAULT_ELECTION_YEAR].map(allianceID =>
    ALLIANCES.find(({ id }) => id === allianceID)
  ) as [Alliance, Alliance];
  const [governmentAlliance, oppositionAlliance] = primaryAlliances;
  const previousGovernmentAlliance = usePrevious<Alliance>(governmentAlliance);
  const isConsistentGovernment = previousGovernmentAlliance && primaryAlliances[0].id === previousGovernmentAlliance.id;
  const groups = Object.keys(allocationsCounts)
    .filter(allocation => allocation !== Allocation.None)
    .reduce(
      (memo, allocation) => {
        const groupIndex =
          governmentAlliance.allocations.indexOf(allocation as Allocation) !== -1
            ? 0
            : oppositionAlliance.allocations.indexOf(allocation as Allocation) !== -1
            ? 1
            : 2;

        memo[groupIndex].count += allocationsCounts[allocation];

        return memo;
      },
      [
        {
          name: governmentAlliance.name,
          shortName: governmentAlliance.shortName,
          majorAllocation: governmentAlliance.majorAllocation,
          count: 0
        },
        {
          name: oppositionAlliance.name,
          shortName: oppositionAlliance.shortName,
          majorAllocation: oppositionAlliance.majorAllocation,
          count: 0
        },
        {
          name: 'Other',
          shortName: 'OTHER',
          majorAllocation: Allocation.OTH,
          count: 0
        }
      ] as Group[]
    );
  const extentCount = groups.reduce((memo, group) => Math.max(memo, group.count), DEFAULT_EXTENT_VOTES);
  const previousExtentCount = usePrevious<number>(extentCount);
  const isConsistentExtentCount = extentCount === previousExtentCount;
  const getTransformXPercent = (count: number) => (count / extentCount) * 100 - 100;

  return (
    <div
      className={styles.root}
      data-should-transition={isConsistentGovernment && isConsistentExtentCount ? '' : undefined}
    >
      <div className={styles.labels} role="none">
        {groups.map(({ shortName }) => (
          <div key={shortName} className={styles.label}>
            {shortName}
          </div>
        ))}
      </div>
      <div className={styles.counts}>
        {groups.map(({ name, shortName, majorAllocation, count }) => (
          <div key={shortName} className={styles.count} title={`${name}: ${count}`}>
            <div className={styles.track}>
              <div
                className={styles.bar}
                style={{ transform: `translate(${getTransformXPercent(count)}%, 0)` }}
                data-allocation={majorAllocation}
                data-is-single-digit-count={count < 10 ? '' : undefined}
              >
                <div className={styles.value}>{count}</div>
              </div>
            </div>
          </div>
        ))}
        <div key="win-line" className={styles.win}>
          <div className={styles.winLine} style={{ left: `${getTransformXPercent(WIN_COUNT)}%` }}>
            <div className={styles.winLabel}>{`${WIN_COUNT} to win`}</div>
          </div>
        </div>
      </div>
      {/* <div className={styles.maxLabel}>{`${MAX_COUNT} seats total`}</div> */}
    </div>
  );
};

export default Totals;
