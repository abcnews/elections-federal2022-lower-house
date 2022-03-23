import type { ElectorateID } from './constants';
import { Allocation, DEFAULT_ELECTION_YEAR } from './constants';

const LIVE_RESULTS_URL_PREFIX =
  'https://www.abc.net.au/news-web/api/loader/channelrefetch?name=ElectionElectorateList&props=';

const FEDERAL_2019_LIVE_RESULTS_PROPS = {
  meta: {
    year: '2019',
    state: 'federal',
    remoteContentPath: 'https:%2F%2Fwww.abc.net.au%2Fdat%2Fnews%2Felections%2Ffederal%2F2019'
  }
};

const SA_2022_LIVE_RESULTS_PROPS = {
  meta: {
    year: '2022',
    state: 'sa',
    useV3: true
  }
};

const FEDERAL_2022_LIVE_RESULTS_PROPS = {
  meta: {
    year: String(DEFAULT_ELECTION_YEAR),
    state: 'federal',
    useV3: true
  }
};

const LIVE_RESULTS_PROPS = FEDERAL_2019_LIVE_RESULTS_PROPS; // TODO: update to 2022 when available

interface LiveResultsElectorate {
  code: ElectorateID;
  counted: string;
  leadingCandidate?: {
    party: {
      code: Allocation;
    };
  };
  predicted?: {
    predictionString?: string;
  };
}

const liveResultsElectoratesPromises: {
  [key: string]: Promise<LiveResultsElectorate[]>;
} = {};

export const fetchLiveResultsElectorates = async () => {
  const url = `${LIVE_RESULTS_URL_PREFIX}${JSON.stringify(LIVE_RESULTS_PROPS)}`;

  if (!liveResultsElectoratesPromises[url]) {
    liveResultsElectoratesPromises[url] = fetch(url)
      .then(response => response.json())
      .then(({ results }) => results.electorates as LiveResultsElectorate[]);
  }

  return liveResultsElectoratesPromises[url];
};

export const getLiveResultsElectorateAllocation = (electorate: LiveResultsElectorate): Allocation => {
  // We only allocate predicted SAFE seats, or seats that no longer need a prediction, based on the logic PL uses for its electorate list:
  // https://stash.abc-dev.net.au/projects/PL/repos/pl/browse/applications/news-web/src/components/channel/elections/ElectorateList/Electorate.tsx
  const hasCountingBegan = electorate.counted !== '0.0';
  const allocation = electorate.leadingCandidate?.party.code;
  const prediction = electorate.predicted?.predictionString;
  const isSafe = prediction ? prediction.startsWith('SAFE') : false;

  return hasCountingBegan && allocation && (isSafe || !prediction) ? Allocation[allocation] : Allocation.None;
};
