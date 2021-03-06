import React from 'react';
import { Alliance, Allocation, Allocations, Certainties } from '../../lib/constants';
import { ALLIANCES, PRIMARY_ALLIANCES, ELECTORATES } from '../../lib/constants';
import { usePrevious } from '../../lib/hooks';
import { determineIfAllocationIsDefinitive, getAllocationsCounts } from '../../lib/utils';
import styles from './styles.scss';

const MAX_COUNT = ELECTORATES.length;
const WIN_COUNT = Math.ceil((MAX_COUNT + 1) / 2);
const DEFAULT_EXTENT_VOTES = WIN_COUNT + 8;

export type TotalsProps = {
  allocations?: Allocations;
  certainties?: Certainties;
};

type Group = {
  name: string;
  shortName: string;
  count: number;
  certainCount: number;
  majorAllocation: Allocation;
};

const Totals: React.FC<TotalsProps> = props => {
  const { allocations, certainties } = props;
  const allocationsCounts = getAllocationsCounts(allocations || {});
  const allocationsCertainCounts = getAllocationsCounts(allocations || {}, certainties);
  const primaryAlliances = PRIMARY_ALLIANCES.map(allianceID => ALLIANCES.find(({ id }) => id === allianceID)) as [
    Alliance,
    Alliance
  ];
  const [governmentAlliance, oppositionAlliance] = primaryAlliances;
  const previousGovernmentAlliance = usePrevious<Alliance>(governmentAlliance);
  const isConsistentGovernment = previousGovernmentAlliance && primaryAlliances[0].id === previousGovernmentAlliance.id;
  const groups = Object.keys(allocationsCounts)
    .filter(allocation => determineIfAllocationIsDefinitive(allocation as Allocation))
    .reduce(
      (memo, allocation) => {
        const groupIndex =
          governmentAlliance.allocations.indexOf(allocation as Allocation) !== -1
            ? 0
            : oppositionAlliance.allocations.indexOf(allocation as Allocation) !== -1
            ? 1
            : 2;

        memo[groupIndex].count += allocationsCounts[allocation];
        memo[groupIndex].certainCount += allocationsCertainCounts[allocation];

        return memo;
      },
      [
        {
          name: governmentAlliance.name,
          shortName: governmentAlliance.shortName,
          majorAllocation: governmentAlliance.majorAllocation,
          count: 0,
          certainCount: 0
        },
        {
          name: oppositionAlliance.name,
          shortName: oppositionAlliance.shortName,
          majorAllocation: oppositionAlliance.majorAllocation,
          count: 0,
          certainCount: 0
        },
        {
          name: 'Other',
          shortName: 'OTHER',
          majorAllocation: Allocation.OTH,
          count: 0,
          certainCount: 0
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
        {groups.map(({ name, shortName, majorAllocation, count, certainCount }) => (
          <div key={shortName} className={styles.count} title={`${name}: ${certainCount}`}>
            <div className={styles.track}>
              <div
                className={styles.bar}
                style={{ transform: `translate(${getTransformXPercent(count)}%, 0)` }}
                data-allocation={majorAllocation}
                data-is-uncertain
              ></div>
              <div
                className={styles.bar}
                style={{ transform: `translate(${getTransformXPercent(certainCount)}%, 0)` }}
                data-allocation={majorAllocation}
                data-is-single-digit-count={count < 10 ? '' : undefined}
              >
                <div className={styles.value}>{certainCount}</div>
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
