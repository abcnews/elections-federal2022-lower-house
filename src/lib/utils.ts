import acto from '@abcnews/alternating-case-to-object';
import { GraphicProps } from '../components/Graphic';
import type { ElectorateID } from './constants';
import {
  ELECTORATE_IDS,
  Allocation,
  Allocations,
  ALLOCATIONS,
  DEFINITIVE_ALLOCATIONS,
  Focus,
  Focuses,
  FOCUSES,
  DEFAULT_ELECTION_YEAR
} from './constants';

export const getAllocationsCounts = (allocations: Allocations): { [key: string]: number } => {
  return ALLOCATIONS.reduce(
    (memo, allocation) => ({
      ...memo,
      [allocation]: ELECTORATE_IDS.filter(id => allocations[id] === allocation).length
    }),
    {}
  );
};

export const determineIfAllocationIsMade = (allocation: Allocation) => allocation !== Allocation.None;

export const determineIfAllocationIsDefinitive = (allocation: Allocation) =>
  DEFINITIVE_ALLOCATIONS.indexOf(allocation) !== -1;

export const determineIfAllocationWasPreserved = (allocation: Allocation, relativeAllocation: Allocation) =>
  allocation === relativeAllocation &&
  determineIfAllocationIsDefinitive(allocation) &&
  determineIfAllocationIsDefinitive(relativeAllocation);

export const determineIfAllocationShouldFlip = (allocation: Allocation, relativeAllocation: Allocation) =>
  allocation !== relativeAllocation &&
  determineIfAllocationIsDefinitive(allocation) &&
  determineIfAllocationIsDefinitive(relativeAllocation);

function decode<Dict>(code: string, keys: string[], possibleValues: string[], defaultValue: string): Dict {
  code = typeof code === 'string' ? code.replace(/(\w)(\d+)/g, (_, char, repeated) => char.repeat(+repeated)) : code;
  code = code && code.length === keys.length ? code : defaultValue.repeat(keys.length);

  return keys.reduce((dict, key, index) => {
    const value = code[index];

    dict[key] = possibleValues.indexOf(value) > -1 ? value : defaultValue;

    return dict;
  }, {} as Dict);
}

function encode<Dict>(dict: Dict, keys: string[], possibleValues: string[], defaultValue: string): string {
  return keys
    .reduce((memo: [string, number][], key, index) => {
      const value = possibleValues.indexOf(dict[key]) > -1 ? dict[key] : defaultValue;

      if (index === 0 || value !== memo[memo.length - 1][0]) {
        memo.push([value, 1]);
      } else {
        memo[memo.length - 1][1]++;
      }

      return memo;
    }, [])
    .reduce((memo, [char, repeated]) => {
      return (memo += repeated === 1 ? char : char + String(repeated));
    }, '');
}

export const decodeAllocations = (code: string): Allocations =>
  decode<Allocations>(code, ELECTORATE_IDS, ALLOCATIONS, Allocation.None);

export const encodeAllocations = (allocations: Allocations): string =>
  encode<Allocations>(allocations, ELECTORATE_IDS, ALLOCATIONS, Allocation.None);

export const decodeFocuses = (code: string): Focuses => decode<Focuses>(code, ELECTORATE_IDS, FOCUSES, Focus.No);

export const encodeFocuses = (focuses: Focuses): string => encode<Focuses>(focuses, ELECTORATE_IDS, FOCUSES, Focus.No);

export const alternatingCaseToGraphicProps = (alternatingCase: string) => {
  const { allocations, focuses, ...otherGraphicProps } = acto(alternatingCase);

  const graphicProps = {
    ...otherGraphicProps
  } as Partial<GraphicProps>;

  if (typeof allocations === 'string') {
    graphicProps.allocations = decodeAllocations(allocations);
  }

  if (typeof focuses === 'string') {
    graphicProps.focuses = decodeFocuses(focuses);
  }

  return graphicProps;
};

export const graphicPropsToAlternatingCase = (graphicProps, defaultGraphicProps?): string =>
  Object.keys(graphicProps).reduce((alternatingCase, key) => {
    const value = graphicProps[key];

    // We never export defaults
    if (defaultGraphicProps && defaultGraphicProps[key] === value) {
      return alternatingCase;
    }

    alternatingCase += key.toUpperCase();

    if (key === 'allocations') {
      alternatingCase += encodeAllocations(value);
    } else if (key === 'focuses') {
      alternatingCase += encodeFocuses(value);
    } else if (typeof value === 'boolean') {
      alternatingCase += value ? 'true' : 'false';
    } else if (value === null) {
      alternatingCase += 'null';
    } else {
      alternatingCase += value;
    }

    return alternatingCase;
  }, '');

export const urlQueryToGraphicProps = (urlQuery: string) => {
  if (urlQuery.length < 2) {
    return null;
  }

  const graphicProps = JSON.parse(
    '{"' + urlQuery.substring(1).replace(/&/g, '","').replace(/=/g, '":"') + '"}',
    (key, value) => (key === '' ? value : decodeURIComponent(value))
  );

  graphicProps.allocations = decodeAllocations(graphicProps.allocations);
  graphicProps.focuses = decodeFocuses(graphicProps.focuses);

  if (typeof graphicProps.year === 'string') {
    graphicProps.year = +graphicProps.year;
  }

  if (typeof graphicProps.relative === 'string') {
    graphicProps.relative = graphicProps.relative === 'null' ? null : +graphicProps.relative;
  }

  if (typeof graphicProps.counting === 'string') {
    graphicProps.counting = graphicProps.counting === 'true';
  }

  return graphicProps;
};

export const graphicPropsToUrlQuery = (graphicProps, defaultGraphicProps?): string =>
  Object.keys(graphicProps).reduce((urlQuery, key) => {
    const value = graphicProps[key];

    // We never export defaults
    if (defaultGraphicProps && defaultGraphicProps[key] === value) {
      return urlQuery;
    }

    urlQuery += (urlQuery.length > 0 ? '&' : '?') + key + '=';

    if (key === 'allocations') {
      urlQuery += encodeAllocations(value);
    } else if (key === 'focuses') {
      urlQuery += encodeFocuses(value);
    } else if (typeof value === 'boolean') {
      urlQuery += value ? 'true' : 'false';
    } else {
      urlQuery += value;
    }

    return urlQuery;
  }, '');

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

export const fetchLiveResultsElectorates = async () => {
  const response = await fetch(`${LIVE_RESULTS_URL_PREFIX}${JSON.stringify(LIVE_RESULTS_PROPS)}`);

  return (await response.json()).results.electorates as LiveResultsElectorate[];
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
