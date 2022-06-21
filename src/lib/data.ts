import type { ElectorateID } from './constants';
import { Allocation, NoYes } from './constants';

const BASE_URL =
  String(window.location.hostname).indexOf('githubpreview.dev') > -1
    ? `${String(window.location.origin)}/`
    : __webpack_public_path__;

// const LIVE_RESULTS_URL = 'https://www.abc.net.au/news-web/api/syndicate/storylab/elections/federal/2022';
const LIVE_RESULTS_URL = `${BASE_URL}data/federal2022.json`;

interface VoteCount {
  votes: number;
  pct: string;
  swing: string;
}

export interface Candidate {
  party: {
    code: Allocation;
  };
  predicted?: VoteCount;
  predicted2CP?: VoteCount;
  simple: VoteCount;
  simple2CP?: VoteCount;
}

export interface LiveResultsElectorate {
  updated: string;
  code: ElectorateID;
  counted: string;
  isDoubtful: boolean;
  runners: Candidate[];
  leadingCandidate?: Candidate;
  trailingCandidate?: Candidate;
}

const liveResultsElectoratesPromises: {
  [key: string]: Promise<LiveResultsElectorate[]>;
} = {};

export const fetchLiveResultsElectorates = async () => {
  const url = LIVE_RESULTS_URL;

  if (!liveResultsElectoratesPromises[url]) {
    liveResultsElectoratesPromises[url] = fetch(url)
      .then(response => response.json())
      .then(({ data }) => data.electorates as LiveResultsElectorate[]);
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
