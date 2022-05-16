import acto from '@abcnews/alternating-case-to-object';
import type { GraphicProps } from '../components/Graphic';
import {
  ELECTORATE_IDS,
  Allocation,
  Allocations,
  ALLOCATION_VALUES,
  DEFINITIVE_ALLOCATION_VALUES,
  Annotations,
  Focuses,
  NoYes,
  NOYES_VALUES,
  Layout
} from './constants';

export const getAllocationsCounts = (allocations: Allocations): { [key: string]: number } => {
  return ALLOCATION_VALUES.reduce(
    (memo, allocation) => ({
      ...memo,
      [allocation]: ELECTORATE_IDS.filter(id => allocations[id] === allocation).length
    }),
    {}
  );
};

export const determineIfAllocationIsMade = (allocation: Allocation) => allocation !== Allocation.None;

export const determineIfAllocationIsDefinitive = (allocation: Allocation) =>
  DEFINITIVE_ALLOCATION_VALUES.indexOf(allocation) !== -1;

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
  }, ({} as unknown) as Dict);
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
  decode<Allocations>(code, ELECTORATE_IDS, ALLOCATION_VALUES, Allocation.None);

export const encodeAllocations = (allocations: Allocations): string =>
  encode<Allocations>(allocations, ELECTORATE_IDS, ALLOCATION_VALUES, Allocation.None);

export const decodeAnnotations = (code: string): Annotations =>
  decode<Annotations>(code, ELECTORATE_IDS, NOYES_VALUES, NoYes.No);

export const encodeAnnotations = (annotations: Annotations): string =>
  encode<Annotations>(annotations, ELECTORATE_IDS, NOYES_VALUES, NoYes.No);

export const decodeFocuses = (code: string): Focuses => decode<Focuses>(code, ELECTORATE_IDS, NOYES_VALUES, NoYes.No);

export const encodeFocuses = (focuses: Focuses): string =>
  encode<Focuses>(focuses, ELECTORATE_IDS, NOYES_VALUES, NoYes.No);

export const alternatingCaseToGraphicProps = (alternatingCase: string) => {
  const { allocations, annotations, focuses, ...otherGraphicProps } = acto(alternatingCase);
  const graphicProps = {
    ...otherGraphicProps
  } as Partial<GraphicProps>;

  if (typeof allocations === 'string') {
    graphicProps.allocations = decodeAllocations(allocations);
  }

  if (typeof annotations === 'string') {
    graphicProps.annotations = decodeAnnotations(annotations);
  }

  if (typeof focuses === 'string') {
    graphicProps.focuses = decodeFocuses(focuses);
  }

  if (typeof graphicProps.layout === 'number') {
    graphicProps.layout = String(graphicProps.layout) as Layout;
  }

  // backwards-compatibility with deprecated year-based type
  if (typeof graphicProps.relative === 'number') {
    // e.g. 2019
    graphicProps.relative = true;
  } else if (typeof graphicProps.relative === 'string') {
    // e.g. "null"
    graphicProps.relative = false;
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
    } else if (key === 'annotations') {
      alternatingCase += encodeAnnotations(value);
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
  graphicProps.annotations = decodeAnnotations(graphicProps.annotations);
  graphicProps.focuses = decodeFocuses(graphicProps.focuses);

  if (typeof graphicProps.layout === 'number') {
    graphicProps.layout = String(graphicProps.layout);
  }

  if (typeof graphicProps.counting === 'string') {
    graphicProps.counting = graphicProps.counting === 'true';
  }

  if (typeof graphicProps.inset === 'string') {
    graphicProps.inset = graphicProps.inset === 'true';
  }

  if (typeof graphicProps.relative === 'string') {
    // backwards-compatibility
    graphicProps.relative = graphicProps.relative === 'true' || graphicProps.relative === '2019';
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
    } else if (key === 'annotations') {
      urlQuery += encodeAnnotations(value);
    } else if (key === 'focuses') {
      urlQuery += encodeFocuses(value);
    } else if (typeof value === 'boolean') {
      urlQuery += value ? 'true' : 'false';
    } else {
      urlQuery += value;
    }

    return urlQuery;
  }, '');

export const flattenNestedRecords = <T>(record: Record<string, Record<string, T>>) =>
  Object.keys(record).reduce((memo, key) => ({ ...memo, ...record[key] }), {} as Record<string, T>);

export const transformNestedRecordsValues = <F, T>(
  record: Record<string, Record<string, F>>,
  transformFn: (from: F, key: string, nestedKey: string) => T
) =>
  Object.keys(record).reduce(
    (memo, key) => ({
      ...memo,
      [key]: Object.keys(record[key]).reduce(
        (memo, nestedKey) => ({
          ...memo,
          [nestedKey]: transformFn(record[key][nestedKey], key, nestedKey)
        }),
        {} as Record<string, T>
      )
    }),
    {} as Record<string, Record<string, T>>
  );
