import type { ElectorateID } from './constants';
import { Allocation, NoYes } from './constants';

const LIVE_RESULTS_URL_PREFIX =
  'https://www.abc.net.au/news-web/api/loader/channelrefetch?name=ElectionElectorateList&props=';

const FEDERAL_2019_LIVE_RESULTS_PROPS = {
  meta: {
    year: '2019',
    state: 'federal',
    remoteContentPath: 'https:%2F%2Fwww.abc.net.au%2Fdat%2Fnews%2Felections%2Ffederal%2F2019'
  }
};

const FEDERAL_2022_LIVE_RESULTS_PROPS = {
  meta: {
    year: '2022',
    state: 'federal',
    useV3: true
  }
};

// TODO: update to 2022 when available
const LIVE_RESULTS_PROPS = FEDERAL_2022_LIVE_RESULTS_PROPS;

export interface LiveResultsElectorate {
  code: ElectorateID;
  counted: string;
  isDoubtful: boolean;
  leadingCandidate?: {
    party: {
      code: Allocation;
    };
  };
  predicted?: {
    predictionString?: string;
  };
  updated: string;
}

const liveResultsElectoratesPromises: {
  [key: string]: Promise<LiveResultsElectorate[]>;
} = {};

export const fetchLiveResultsElectorates = async () => {
  // const url = `${LIVE_RESULTS_URL_PREFIX}${JSON.stringify(LIVE_RESULTS_PROPS)}`;
  const url = `${__webpack_public_path__}example-data/2019-aurora.json`;
  // const url = `${__webpack_public_path__}example-data/2019-erads.json`;

  if (!liveResultsElectoratesPromises[url]) {
    liveResultsElectoratesPromises[url] = fetch(url)
      .then(response => response.json())
      .then(({ results }) => results.electorates as LiveResultsElectorate[]);
  }

  return liveResultsElectoratesPromises[url];
};

export const getLiveResultsElectorateAllocation = (electorate: LiveResultsElectorate): Allocation => {
  const hasCountingBegan = electorate.counted !== '0.0';
  const { leadingCandidate } = electorate;
  const allocation = leadingCandidate?.party.code;

  return hasCountingBegan && leadingCandidate
    ? allocation
      ? Allocation[allocation]
      : Allocation.Any
    : Allocation.None;
};

export const getLiveResultsElectorateCertainty = (electorate: LiveResultsElectorate): NoYes =>
  electorate.isDoubtful ? NoYes.No : NoYes.Yes;
