import type { Allocations, Focuses } from '../../lib/constants';
import {
  ALLIANCES,
  ElectorateID,
  ElectorateSecurity,
  ElectorateSituation,
  ELECTORATES,
  ELECTORATES_HELD_ALLOCATIONS,
  NoYes
} from '../../lib/constants';

export type Mixin = {
  name: string;
  allocations: Allocations;
  focuses?: Focuses;
};

export type Mixins = {
  [key: string]: Mixin;
};

const [LABOR_ALLIANCE, COALITION_ALLIANCE] = ALLIANCES;

const MARGINALLY_HELD_ALLOCATIONS = ELECTORATES.reduce((memo, electorate) => {
  if (electorate.security === ElectorateSecurity.MARGINAL) {
    memo[ElectorateID[electorate.id]] = electorate.holder;
  }

  return memo;
}, {} as Allocations);

const SAFELY_HELD_ALLOCATIONS = ELECTORATES.reduce((memo, electorate) => {
  if (electorate.security === ElectorateSecurity.SAFE) {
    memo[ElectorateID[electorate.id]] = electorate.holder;
  }

  return memo;
}, {} as Allocations);

const VERY_SAFELY_HELD_ALLOCATIONS = ELECTORATES.reduce((memo, electorate) => {
  if (electorate.security === ElectorateSecurity.VERY_SAFE) {
    memo[ElectorateID[electorate.id]] = electorate.holder;
  }

  return memo;
}, {} as Allocations);

const NON_MARGINALLY_HELD_ALLOCATIONS = {
  ...SAFELY_HELD_ALLOCATIONS,
  ...VERY_SAFELY_HELD_ALLOCATIONS
};

const NON_MARGINALLY_LABOR_HELD_ALLOCATIONS = ELECTORATES.reduce((memo, electorate) => {
  if (
    electorate.security !== ElectorateSecurity.MARGINAL &&
    LABOR_ALLIANCE.allocations.find(allocation => allocation === electorate.holder)
  ) {
    memo[ElectorateID[electorate.id]] = electorate.holder;
  }

  return memo;
}, {} as Allocations);

const NON_MARGINALLY_COALITION_HELD_ALLOCATIONS = ELECTORATES.reduce((memo, electorate) => {
  if (
    electorate.security !== ElectorateSecurity.MARGINAL &&
    COALITION_ALLIANCE.allocations.find(allocation => allocation === electorate.holder)
  ) {
    memo[ElectorateID[electorate.id]] = electorate.holder;
  }

  return memo;
}, {} as Allocations);

const INNER_METRO_ALLOCATIONS = ELECTORATES.reduce((memo, electorate) => {
  if (electorate.situation === ElectorateSituation.INNER_METRO) {
    memo[ElectorateID[electorate.id]] = electorate.holder;
  }

  return memo;
}, {} as Allocations);

const OUTER_METRO_ALLOCATIONS = ELECTORATES.reduce((memo, electorate) => {
  if (electorate.situation === ElectorateSituation.OUTER_METRO) {
    memo[ElectorateID[electorate.id]] = electorate.holder;
  }

  return memo;
}, {} as Allocations);

const REGIONAL_ALLOCATIONS = ELECTORATES.reduce((memo, electorate) => {
  if (electorate.situation === ElectorateSituation.REGIONAL) {
    memo[ElectorateID[electorate.id]] = electorate.holder;
  }

  return memo;
}, {} as Allocations);

const RURAL_ALLOCATIONS = ELECTORATES.reduce((memo, electorate) => {
  if (electorate.situation === ElectorateSituation.RURAL) {
    memo[ElectorateID[electorate.id]] = electorate.holder;
  }

  return memo;
}, {} as Allocations);

const allocationsToFocuses = (allocations: Allocations) =>
  Object.keys(allocations).reduce(
    (memo, electorateID) => ({
      ...memo,
      [electorateID]: NoYes.Yes
    }),
    {} as Focuses
  );

const MARGINALLY_HELD_FOCUSES = allocationsToFocuses(MARGINALLY_HELD_ALLOCATIONS);
const SAFELY_HELD_FOCUSES = allocationsToFocuses(SAFELY_HELD_ALLOCATIONS);
const VERY_SAFELY_HELD_FOCUSES = allocationsToFocuses(VERY_SAFELY_HELD_ALLOCATIONS);
const INNER_METRO_FOCUSES = allocationsToFocuses(INNER_METRO_ALLOCATIONS);
const OUTER_METRO_FOCUSES = allocationsToFocuses(OUTER_METRO_ALLOCATIONS);
const REGIONAL_FOCUSES = allocationsToFocuses(REGIONAL_ALLOCATIONS);
const RURAL_FOCUSES = allocationsToFocuses(RURAL_ALLOCATIONS);

export const MIXINS: Mixins = {
  held: {
    name: 'Held',
    allocations: ELECTORATES_HELD_ALLOCATIONS
  },
  marginal: {
    name: 'Marginal',
    allocations: MARGINALLY_HELD_ALLOCATIONS,
    focuses: MARGINALLY_HELD_FOCUSES
  },
  safe: {
    name: 'Safe',
    allocations: SAFELY_HELD_ALLOCATIONS,
    focuses: SAFELY_HELD_FOCUSES
  },
  verysafe: {
    name: 'Very Safe',
    allocations: VERY_SAFELY_HELD_ALLOCATIONS,
    focuses: VERY_SAFELY_HELD_FOCUSES
  },
  nonmarginal: {
    name: 'Non-marginal',
    allocations: NON_MARGINALLY_HELD_ALLOCATIONS
  },
  nonmarginallabor: {
    name: 'Non-marginal Labor',
    allocations: NON_MARGINALLY_LABOR_HELD_ALLOCATIONS
  },
  nonmarginalcoalition: {
    name: 'Non-marginal Coalition',
    allocations: NON_MARGINALLY_COALITION_HELD_ALLOCATIONS
  },
  innermetro: {
    name: 'Inner Metro',
    allocations: INNER_METRO_ALLOCATIONS,
    focuses: INNER_METRO_FOCUSES
  },
  outermetro: {
    name: 'Outer Metro',
    allocations: OUTER_METRO_ALLOCATIONS,
    focuses: OUTER_METRO_FOCUSES
  },
  regional: {
    name: 'Regional',
    allocations: REGIONAL_ALLOCATIONS,
    focuses: REGIONAL_FOCUSES
  },
  rural: {
    name: 'Rural',
    allocations: RURAL_ALLOCATIONS,
    focuses: RURAL_FOCUSES
  }
};

export const PRESETS: Mixins = {
  held: {
    ...MIXINS.held,
    focuses: {}
  },
  nonmarginal: {
    ...MIXINS.nonmarginal,
    focuses: {}
  }
};
