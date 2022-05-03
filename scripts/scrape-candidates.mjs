import got from 'got';
import { writeJsonFile } from 'write-json-file';
import { ELECTORATE_CODES, RESULTS_BASE_URL, EDITOR_CANDIDATES_FILE_NAME } from './constants.mjs';

const PREFILLED_DATA = {
  HAWK: ['LIB', 'ALP', 'GRN', 'UAP', 'ONP', 'IND', 'OTH']
};

const ELECTORATE_URLS = ELECTORATE_CODES.filter(code => PREFILLED_DATA[code] === undefined).map(
  code => `${RESULTS_BASE_URL}OnlineElectorate${code.toUpperCase()}.json`
);

const electorates = await Promise.all(ELECTORATE_URLS.map(url => got.get(url).json()));

const data = electorates.reduce((memo, electorate) => {
  const {
    AccumulatedCandidates,
    ElectorateCode
  } = electorate.Erads.Elections.Election.Chambers.Chamber.Electorates.Electorate;
  const DisplayControlCodes = AccumulatedCandidates.AccumulatedCandidate.map(
    candidate => candidate.DisplayControl.DisplayControlCode
  );

  return {
    ...memo,
    [ElectorateCode]: DisplayControlCodes
  };
}, PREFILLED_DATA);

writeJsonFile(EDITOR_CANDIDATES_FILE_NAME, data);
