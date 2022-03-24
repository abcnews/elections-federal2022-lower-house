import got from 'got';
import { writeJsonFile } from 'write-json-file';
import { ELECTORATE_CODES, GUIDE_BASE_URL, CARD_PAST_WINNERS_FILE_NAME } from './constants.mjs';

const ELECTORATE_URLS = ELECTORATE_CODES.map(code => `${GUIDE_BASE_URL}${code.toLowerCase()}.json`);

const electorates = await Promise.all(ELECTORATE_URLS.map(url => got.get(url).json()));

const data = electorates.reduce(
  (memo, electorate) => ({
    ...memo,
    [electorate.id.toUpperCase()]: electorate.pastwinners
      .filter(winner => winner.election == +winner.election) // remove by-elections
      .slice(0, 10) // keep most recent 10
      .reduce((memo, winner) => ({ ...memo, [winner.election]: winner.partycode }), {})
  }),
  {}
);

writeJsonFile(CARD_PAST_WINNERS_FILE_NAME, data);
