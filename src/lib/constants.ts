export enum ElectorateID {
  ADEL,
  ASTO,
  BALL,
  BANK,
  BARK,
  BART,
  BASS,
  BEAN,
  BEND,
  BENN,
  BERO,
  BLAI,
  BLAX,
  BONN,
  BOOT,
  BOWM,
  BRAD,
  BRFD,
  BRAN,
  BRIS,
  BRUC,
  BURT,
  CALA,
  CALW,
  CANB,
  CANN,
  CAPR,
  CASE,
  CHIF,
  CHIS,
  CLAR,
  COOK,
  COOP,
  CORA,
  CORI,
  COWA,
  COWP,
  CUNN,
  CURT,
  DAWS,
  DEAK,
  DICK,
  DOBE,
  DUNK,
  DURA,
  EMON,
  FADD,
  FAIR,
  FARR,
  FENN,
  FISH,
  FLIN,
  FLYN,
  FORD,
  FORR,
  FOWL,
  FRAN,
  FRAS,
  FREM,
  GELL,
  GILM,
  GIPP,
  GOLD,
  GORT,
  GRAY,
  GREE,
  GREY,
  GRIF,
  GROO,
  HASL,
  HAWK,
  HERB,
  HIGG,
  HIND,
  HINK,
  HOLT,
  HOTH,
  HUGH,
  HUME,
  HUNT,
  INDI,
  ISAA,
  JAGA,
  KENN,
  KSMI,
  KING,
  KOOY,
  LTRO,
  LALO,
  LEIC,
  LILL,
  LIND,
  LING,
  LONG,
  LYNE,
  LYON,
  MACA,
  MACK,
  MACN,
  MACQ,
  MAKI,
  MALL,
  MARA,
  MARI,
  MAYO,
  MCEW,
  MCMA,
  MCPH,
  MELB,
  MENZ,
  MITC,
  MONA,
  MONC,
  MOOR,
  MORE,
  NENG,
  NEWC,
  NICH,
  NSYD,
  OCON,
  OXLE,
  PAGE,
  PARK,
  PARR,
  PATE,
  PEAR,
  PERT,
  PETR,
  RANK,
  REID,
  RICH,
  RIVE,
  ROBE,
  RYAN,
  SCUL,
  SHOR,
  SOLO,
  SPEN,
  STUR,
  SWAN,
  SYDN,
  TANG,
  WANN,
  WARR,
  WATS,
  WENT,
  WERR,
  WHIT,
  WBAY,
  WILL,
  WRIG
}

export const ELECTORATE_IDS = Object.keys(ElectorateID).filter(key => typeof ElectorateID[key] === 'number');

export type Electorate = {
  id: ElectorateID;
  name: string;
  abbr: string;
  isKeySeat?: boolean;
  // TODO: state?
};

export const ELECTORATES: Electorate[] = [
  { id: ElectorateID.ADEL, name: 'Adelaide' },
  { id: ElectorateID.ASTO, name: 'Aston' },
  { id: ElectorateID.BALL, name: 'Ballarat' },
  { id: ElectorateID.BANK, name: 'Banks', isKeySeat: true },
  { id: ElectorateID.BARK, name: 'Barker' },
  { id: ElectorateID.BART, name: 'Barton' },
  { id: ElectorateID.BASS, name: 'Bass', isKeySeat: true },
  { id: ElectorateID.BEAN, name: 'Bean' },
  { id: ElectorateID.BEND, name: 'Bendigo' },
  { id: ElectorateID.BENN, name: 'Bennelong' },
  { id: ElectorateID.BERO, name: 'Berowra' },
  { id: ElectorateID.BLAI, name: 'Blair', isKeySeat: true },
  { id: ElectorateID.BLAX, name: 'Blaxland' },
  { id: ElectorateID.BONN, name: 'Bonner' },
  { id: ElectorateID.BOOT, name: 'Boothby', isKeySeat: true },
  { id: ElectorateID.BOWM, name: 'Bowman' },
  { id: ElectorateID.BRAD, name: 'Braddon', isKeySeat: true },
  { id: ElectorateID.BRFD, name: 'Bradfield' },
  { id: ElectorateID.BRAN, name: 'Brand' },
  { id: ElectorateID.BRIS, name: 'Brisbane', isKeySeat: true },
  { id: ElectorateID.BRUC, name: 'Bruce' },
  { id: ElectorateID.BURT, name: 'Burt' },
  { id: ElectorateID.CALA, name: 'Calare' },
  { id: ElectorateID.CALW, name: 'Calwell' },
  { id: ElectorateID.CANB, name: 'Canberra' },
  { id: ElectorateID.CANN, name: 'Canning' },
  { id: ElectorateID.CAPR, name: 'Capricornia' },
  { id: ElectorateID.CASE, name: 'Casey' },
  { id: ElectorateID.CHIF, name: 'Chifley' },
  { id: ElectorateID.CHIS, name: 'Chisholm', isKeySeat: true },
  { id: ElectorateID.CLAR, name: 'Clark' },
  { id: ElectorateID.COOK, name: 'Cook' },
  { id: ElectorateID.COOP, name: 'Cooper' },
  { id: ElectorateID.CORA, name: 'Corangamite', isKeySeat: true },
  { id: ElectorateID.CORI, name: 'Corio' },
  { id: ElectorateID.COWA, name: 'Cowan', isKeySeat: true },
  { id: ElectorateID.COWP, name: 'Cowper' },
  { id: ElectorateID.CUNN, name: 'Cunningham' },
  { id: ElectorateID.CURT, name: 'Curtin' },
  { id: ElectorateID.DAWS, name: 'Dawson' },
  { id: ElectorateID.DEAK, name: 'Deakin', isKeySeat: true },
  { id: ElectorateID.DICK, name: 'Dickson', isKeySeat: true },
  { id: ElectorateID.DOBE, name: 'Dobell', isKeySeat: true },
  { id: ElectorateID.DUNK, name: 'Dunkley', isKeySeat: true },
  { id: ElectorateID.DURA, name: 'Durack' },
  { id: ElectorateID.EMON, name: 'Eden-Monaro', isKeySeat: true },
  { id: ElectorateID.FADD, name: 'Fadden' },
  { id: ElectorateID.FAIR, name: 'Fairfax' },
  { id: ElectorateID.FARR, name: 'Farrer' },
  { id: ElectorateID.FENN, name: 'Fenner' },
  { id: ElectorateID.FISH, name: 'Fisher' },
  { id: ElectorateID.FLIN, name: 'Flinders' },
  { id: ElectorateID.FLYN, name: 'Flynn', isKeySeat: true },
  { id: ElectorateID.FORD, name: 'Forde' },
  { id: ElectorateID.FORR, name: 'Forrest' },
  { id: ElectorateID.FOWL, name: 'Fowler' },
  { id: ElectorateID.FRAN, name: 'Franklin' },
  { id: ElectorateID.FRAS, name: 'Fraser' },
  { id: ElectorateID.FREM, name: 'Fremantle' },
  { id: ElectorateID.GELL, name: 'Gellibrand' },
  { id: ElectorateID.GILM, name: 'Gilmore', isKeySeat: true },
  { id: ElectorateID.GIPP, name: 'Gippsland' },
  { id: ElectorateID.GOLD, name: 'Goldstein' },
  { id: ElectorateID.GORT, name: 'Gorton' },
  { id: ElectorateID.GRAY, name: 'Grayndler' },
  { id: ElectorateID.GREE, name: 'Greenway', isKeySeat: true },
  { id: ElectorateID.GREY, name: 'Grey' },
  { id: ElectorateID.GRIF, name: 'Griffith', isKeySeat: true },
  { id: ElectorateID.GROO, name: 'Groom' },
  { id: ElectorateID.HASL, name: 'Hasluck', isKeySeat: true },
  { id: ElectorateID.HAWK, name: 'Hawke' },
  { id: ElectorateID.HERB, name: 'Herbert' },
  { id: ElectorateID.HIGG, name: 'Higgins', isKeySeat: true },
  { id: ElectorateID.HIND, name: 'Hindmarsh' },
  { id: ElectorateID.HINK, name: 'Hinkler' },
  { id: ElectorateID.HOLT, name: 'Holt' },
  { id: ElectorateID.HOTH, name: 'Hotham' },
  { id: ElectorateID.HUGH, name: 'Hughes', isKeySeat: true },
  { id: ElectorateID.HUME, name: 'Hume' },
  { id: ElectorateID.HUNT, name: 'Hunter', isKeySeat: true },
  { id: ElectorateID.INDI, name: 'Indi', isKeySeat: true },
  { id: ElectorateID.ISAA, name: 'Isaacs' },
  { id: ElectorateID.JAGA, name: 'Jagajaga' },
  { id: ElectorateID.KENN, name: 'Kennedy' },
  { id: ElectorateID.KSMI, name: 'Kingsford Smith' },
  { id: ElectorateID.KING, name: 'Kingston' },
  { id: ElectorateID.KOOY, name: 'Kooyong' },
  { id: ElectorateID.LTRO, name: 'La Trobe' },
  { id: ElectorateID.LALO, name: 'Lalor' },
  { id: ElectorateID.LEIC, name: 'Leichhardt', isKeySeat: true },
  { id: ElectorateID.LILL, name: 'Lilley', isKeySeat: true },
  { id: ElectorateID.LIND, name: 'Lindsay', isKeySeat: true },
  { id: ElectorateID.LING, name: 'Lingiari' },
  { id: ElectorateID.LONG, name: 'Longman' },
  { id: ElectorateID.LYNE, name: 'Lyne' },
  { id: ElectorateID.LYON, name: 'Lyons', isKeySeat: true },
  { id: ElectorateID.MACA, name: 'Macarthur' },
  { id: ElectorateID.MACK, name: 'Mackellar' },
  { id: ElectorateID.MACN, name: 'Macnamara', isKeySeat: true },
  { id: ElectorateID.MACQ, name: 'Macquarie', isKeySeat: true },
  { id: ElectorateID.MAKI, name: 'Makin' },
  { id: ElectorateID.MALL, name: 'Mallee' },
  { id: ElectorateID.MARA, name: 'Maranoa' },
  { id: ElectorateID.MARI, name: 'Maribyrnong' },
  { id: ElectorateID.MAYO, name: 'Mayo', isKeySeat: true },
  { id: ElectorateID.MCEW, name: 'McEwen' },
  { id: ElectorateID.MCMA, name: 'McMahon' },
  { id: ElectorateID.MCPH, name: 'McPherson' },
  { id: ElectorateID.MELB, name: 'Melbourne' },
  { id: ElectorateID.MENZ, name: 'Menzies' },
  { id: ElectorateID.MITC, name: 'Mitchell' },
  { id: ElectorateID.MONA, name: 'Monash' },
  { id: ElectorateID.MONC, name: 'Moncrieff' },
  { id: ElectorateID.MOOR, name: 'Moore' },
  { id: ElectorateID.MORE, name: 'Moreton', isKeySeat: true },
  { id: ElectorateID.NENG, name: 'New England' },
  { id: ElectorateID.NEWC, name: 'Newcastle' },
  { id: ElectorateID.NICH, name: 'Nicholls' },
  { id: ElectorateID.NSYD, name: 'North Sydney' },
  { id: ElectorateID.OCON, name: "O'Connor" },
  { id: ElectorateID.OXLE, name: 'Oxley' },
  { id: ElectorateID.PAGE, name: 'Page' },
  { id: ElectorateID.PARK, name: 'Parkes' },
  { id: ElectorateID.PARR, name: 'Parramatta', isKeySeat: true },
  { id: ElectorateID.PATE, name: 'Paterson', isKeySeat: true },
  { id: ElectorateID.PEAR, name: 'Pearce', isKeySeat: true },
  { id: ElectorateID.PERT, name: 'Perth' },
  { id: ElectorateID.PETR, name: 'Petrie' },
  { id: ElectorateID.RANK, name: 'Rankin' },
  { id: ElectorateID.REID, name: 'Reid', isKeySeat: true },
  { id: ElectorateID.RICH, name: 'Richmond' },
  { id: ElectorateID.RIVE, name: 'Riverina' },
  { id: ElectorateID.ROBE, name: 'Robertson', isKeySeat: true },
  { id: ElectorateID.RYAN, name: 'Ryan' },
  { id: ElectorateID.SCUL, name: 'Scullin' },
  { id: ElectorateID.SHOR, name: 'Shortland' },
  { id: ElectorateID.SOLO, name: 'Solomon', isKeySeat: true },
  { id: ElectorateID.SPEN, name: 'Spence' },
  { id: ElectorateID.STUR, name: 'Sturt', isKeySeat: true },
  { id: ElectorateID.SWAN, name: 'Swan', isKeySeat: true },
  { id: ElectorateID.SYDN, name: 'Sydney' },
  { id: ElectorateID.TANG, name: 'Tangney' },
  { id: ElectorateID.WANN, name: 'Wannon' },
  { id: ElectorateID.WARR, name: 'Warringah' },
  { id: ElectorateID.WATS, name: 'Watson' },
  { id: ElectorateID.WENT, name: 'Wentworth', isKeySeat: true },
  { id: ElectorateID.WERR, name: 'Werriwa' },
  { id: ElectorateID.WHIT, name: 'Whitlam' },
  { id: ElectorateID.WBAY, name: 'Wide Bay' },
  { id: ElectorateID.WILL, name: 'Wills' },
  { id: ElectorateID.WRIG, name: 'Wright' }
].map((electorate: Partial<Electorate>) => {
  const { name } = electorate as Electorate;
  let abbr = name.substring(0, 5).trim();

  const isInitialAbbreviationThin = !!(abbr.match(/i|'|\s/i) && !abbr.match(/m|w/i));

  if (name.length > 6 || (!isInitialAbbreviationThin && name.length > 5)) {
    abbr = `${name.substring(0, isInitialAbbreviationThin ? 5 : 4).trim()}.`;
  }

  return {
    ...electorate,
    abbr
  } as Electorate;
});

export enum StateID {
  ACT,
  NSW,
  NT,
  QLD,
  SA,
  TAS,
  VIC,
  WA
}

export const STATE_IDS = Object.keys(StateID).filter(key => typeof StateID[key] === 'number');

export type State = {
  id: StateID;
  name: string;
  abbr: string;
  caps: string;
};

export const STATES: State[] = [
  {
    id: StateID.ACT,
    name: 'Australian Capital Territory',
    abbr: 'ACT',
    caps: 'ACT'
  },
  {
    id: StateID.NSW,
    name: 'New South Wales',
    abbr: 'NSW',
    caps: 'NSW'
  },
  {
    id: StateID.NT,
    name: 'Northern Territory',
    abbr: 'NT',
    caps: 'NT'
  },
  {
    id: StateID.QLD,
    name: 'Queensland',
    abbr: 'Qld.',
    caps: 'QLD'
  },
  {
    id: StateID.SA,
    name: 'South Australia',
    abbr: 'SA',
    caps: 'SA'
  },
  {
    id: StateID.TAS,
    name: 'Tasmania',
    abbr: 'Tas.',
    caps: 'TAS'
  },
  {
    id: StateID.VIC,
    name: 'Victoria',
    abbr: 'Vic.',
    caps: 'VIC'
  },
  {
    id: StateID.WA,
    name: 'Western Australia',
    abbr: 'WA',
    caps: 'WA'
  }
];

export enum Allocation {
  None = 'a',
  ALP = 'b',
  CA = 'c',
  CLP = 'd',
  GRN = 'e',
  IND = 'f',
  KAP = 'g',
  LIB = 'h',
  LNP = 'i',
  NAT = 'j',
  ONP = 'k',
  OTH = 'l',
  UAP = 'm',
  // For previous winners (map to party with same colors),
  NXT = 'c',
  PUP = 'm'
}

export const ALLOCATIONS: string[] = Object.values(Allocation);

export const UNCERTAIN_ALLOCATIONS = [Allocation.None];

export const DEFINITIVE_ALLOCATIONS = ALLOCATIONS.filter(
  allocation => UNCERTAIN_ALLOCATIONS.indexOf(allocation as Allocation) === -1
);

export type Allocations = {
  [key: string]: Allocation;
};

export const INITIAL_ELECTORATES_ALLOCATIONS = ELECTORATE_IDS.reduce((allocations, electorateID) => {
  allocations[electorateID] = Allocation.None;

  return allocations;
}, {});

export enum AllianceID {
  ALP,
  CLN
}

export type Alliance = {
  id: AllianceID;
  name: string;
  shortName: string;
  allocations: Allocation[];
  majorAllocation: Allocation;
};

export const ALLIANCES: Alliance[] = [
  {
    id: AllianceID.ALP,
    name: 'Labor',
    shortName: 'ALP',
    allocations: [Allocation.ALP],
    majorAllocation: Allocation.ALP
  },
  {
    id: AllianceID.CLN,
    name: 'Coalition',
    shortName: 'L/NP',
    allocations: [Allocation.CLP, Allocation.LIB, Allocation.LNP, Allocation.NAT],
    majorAllocation: Allocation.LIB
  }
];

export const ALLOCATIONS_ALLIANCES = ALLOCATIONS.map(allocation =>
  ALLIANCES.find(alliance => alliance.allocations.indexOf(allocation as Allocation) !== -1)
);

export enum Focus {
  No = 'n',
  Yes = 'y'
}

export const FOCUSES: string[] = Object.values(Focus);

export type Focuses = {
  [key: string]: Focus;
};

export const INITIAL_ELECTORATES_FOCUSES = ELECTORATE_IDS.reduce((focuses, electorateID) => {
  focuses[electorateID] = Focus.No;

  return focuses;
}, {});

export enum Layer {
  ELECTORATES = 'a',
  STATES = 'b'
}

export const LAYER_LABELS: Record<Layer, string> = {
  [Layer.ELECTORATES]: 'Electorates',
  [Layer.STATES]: 'States'
};

export const DEFAULT_LAYER = Layer.ELECTORATES;

export enum Layout {
  GEO = '0',
  COUNTRY = 'a',
  EXPLODED = 'b',
  GRID = 'c',
  ACT = 'd',
  NSW = 'e',
  NT = 'f',
  QLD = 'g',
  SA = 'h',
  TAS = 'i',
  VIC = 'j',
  WA = 'k'
}

export const LAYOUTS: string[] = Object.values(Layout);

export const LAYOUT_LABELS: Record<Layout, string> = {
  [Layout.GEO]: 'Geo',
  [Layout.COUNTRY]: 'Country',
  [Layout.EXPLODED]: 'Exploded',
  [Layout.GRID]: 'Grid',
  [Layout.ACT]: 'ACT',
  [Layout.NSW]: 'NSW',
  [Layout.NT]: 'NT',
  [Layout.QLD]: 'Qld.',
  [Layout.SA]: 'SA',
  [Layout.TAS]: 'Tas.',
  [Layout.VIC]: 'Vic.',
  [Layout.WA]: 'WA'
};

export const DEFAULT_LAYOUT = Layout.EXPLODED;
export const MULTI_STATE_LAYOUTS = [Layout.GEO, Layout.COUNTRY, Layout.EXPLODED, Layout.GRID];
export const SINGLE_STATE_LAYOUTS = LAYOUTS.filter(layout => MULTI_STATE_LAYOUTS.indexOf(layout as Layout) === -1);

export type Preset = {
  name?: string;
  year?: ElectionYear;
  allocations: Allocations;
  focuses: Focuses;
};

export type Presets = {
  [key: string]: Preset;
};

export const MIXINS: Presets = {
  safelabor: {
    name: 'Safe Labor',
    allocations: {
      ADEL: Allocation.ALP,
      BALL: Allocation.ALP,
      BART: Allocation.ALP,
      BEAN: Allocation.ALP,
      BEND: Allocation.ALP,
      // BLAI: Allocation.ALP,
      BLAX: Allocation.ALP,
      BRAN: Allocation.ALP,
      BRUC: Allocation.ALP,
      // BURT: Allocation.ALP,
      CALW: Allocation.ALP,
      CANB: Allocation.ALP,
      CHIF: Allocation.ALP,
      COOP: Allocation.ALP,
      // CORA: Allocation.ALP,
      CORI: Allocation.ALP,
      // COWA: Allocation.ALP,
      CUNN: Allocation.ALP,
      // DOBE: Allocation.ALP,
      // DUNK: Allocation.ALP,
      // EMON: Allocation.ALP,
      FENN: Allocation.ALP,
      FOWL: Allocation.ALP,
      FRAN: Allocation.ALP,
      FRAS: Allocation.ALP,
      FREM: Allocation.ALP,
      GELL: Allocation.ALP,
      // GILM: Allocation.ALP,
      GORT: Allocation.ALP,
      GRAY: Allocation.ALP,
      // GREE: Allocation.ALP,
      // GRIF: Allocation.ALP,
      HAWK: Allocation.ALP,
      HIND: Allocation.ALP,
      HOLT: Allocation.ALP,
      HOTH: Allocation.ALP,
      // HUNT: Allocation.ALP,
      ISAA: Allocation.ALP,
      JAGA: Allocation.ALP,
      KSMI: Allocation.ALP,
      KING: Allocation.ALP,
      LALO: Allocation.ALP,
      // LILL: Allocation.ALP,
      // LING: Allocation.ALP,
      // LYON: Allocation.ALP,
      MACA: Allocation.ALP,
      // MACN: Allocation.ALP,
      // MACQ: Allocation.ALP,
      MAKI: Allocation.ALP,
      MARI: Allocation.ALP,
      // MCEW: Allocation.ALP,
      MCMA: Allocation.ALP,
      // MORE: Allocation.ALP,
      NEWC: Allocation.ALP,
      OXLE: Allocation.ALP,
      // PARR: Allocation.ALP,
      // PATE: Allocation.ALP,
      // PERT: Allocation.ALP,
      RANK: Allocation.ALP,
      // RICH: Allocation.ALP,
      SCUL: Allocation.ALP,
      // SHOR: Allocation.ALP,
      // SOLO: Allocation.ALP,
      SPEN: Allocation.ALP,
      SYDN: Allocation.ALP,
      WATS: Allocation.ALP,
      // WERR: Allocation.ALP,
      WHIT: Allocation.ALP,
      WILL: Allocation.ALP
    },
    focuses: {}
  },
  safecoalition: {
    name: 'Safe Coalition',
    allocations: {
      ASTO: Allocation.LIB,
      BANK: Allocation.LIB,
      BARK: Allocation.LIB,
      // BASS: Allocation.LIB,
      BENN: Allocation.LIB,
      BERO: Allocation.LIB,
      BONN: Allocation.LNP,
      // BOOT: Allocation.LIB,
      BOWM: Allocation.LNP,
      // BRAD: Allocation.LIB,
      BRFD: Allocation.LIB,
      // BRIS: Allocation.LNP,
      CALA: Allocation.NAT,
      CANN: Allocation.LIB,
      CAPR: Allocation.LNP,
      // CASE: Allocation.LIB,
      // CHIS: Allocation.LIB,
      COOK: Allocation.LIB,
      COWP: Allocation.NAT,
      CURT: Allocation.LIB,
      DAWS: Allocation.LNP,
      // DEAK: Allocation.LIB,
      // DICK: Allocation.LNP,
      DURA: Allocation.LIB,
      FADD: Allocation.LNP,
      FAIR: Allocation.LNP,
      FARR: Allocation.LIB,
      FISH: Allocation.LNP,
      // FLIN: Allocation.LIB,
      FLYN: Allocation.LNP,
      FORD: Allocation.LNP,
      FORR: Allocation.LIB,
      GIPP: Allocation.NAT,
      GOLD: Allocation.LIB,
      GREY: Allocation.LIB,
      GROO: Allocation.LNP,
      HASL: Allocation.LIB,
      HERB: Allocation.LNP,
      // HIGG: Allocation.LIB,
      HINK: Allocation.LNP,
      HUGH: Allocation.LIB,
      HUME: Allocation.LIB,
      // KOOY: Allocation.LIB,
      // LTRO: Allocation.LIB,
      // LEIC: Allocation.LNP,
      // LIND: Allocation.LIB,
      // LONG: Allocation.LNP,
      LYNE: Allocation.NAT,
      MACK: Allocation.LIB,
      MALL: Allocation.NAT,
      MARA: Allocation.LNP,
      MCPH: Allocation.LNP,
      MENZ: Allocation.LIB,
      MITC: Allocation.LIB,
      MONA: Allocation.LIB,
      MONC: Allocation.LNP,
      MOOR: Allocation.LIB,
      NENG: Allocation.NAT,
      NICH: Allocation.NAT,
      NSYD: Allocation.LIB,
      OCON: Allocation.LIB,
      PAGE: Allocation.NAT,
      PARK: Allocation.NAT,
      // PEAR: Allocation.LIB,
      PETR: Allocation.LNP,
      // REID: Allocation.LIB,
      RIVE: Allocation.NAT,
      // ROBE: Allocation.LIB,
      RYAN: Allocation.LNP,
      STUR: Allocation.LIB,
      // SWAN: Allocation.LIB,
      TANG: Allocation.LIB,
      WANN: Allocation.LIB,
      // WENT: Allocation.LIB,
      WBAY: Allocation.LNP,
      WRIG: Allocation.LNP
    },
    focuses: {}
  }
};

export const PRESETS: Presets = {
  2019: {
    allocations: {
      ADEL: Allocation.ALP,
      ASTO: Allocation.LIB,
      BALL: Allocation.ALP,
      BANK: Allocation.LIB,
      BARK: Allocation.LIB,
      BART: Allocation.ALP,
      BASS: Allocation.LIB,
      BEAN: Allocation.ALP,
      BEND: Allocation.ALP,
      BENN: Allocation.LIB,
      BERO: Allocation.LIB,
      BLAI: Allocation.ALP,
      BLAX: Allocation.ALP,
      BONN: Allocation.LNP,
      BOOT: Allocation.LIB,
      BOWM: Allocation.LNP,
      BRAD: Allocation.LIB,
      BRFD: Allocation.LIB,
      BRAN: Allocation.ALP,
      BRIS: Allocation.LNP,
      BRUC: Allocation.ALP,
      BURT: Allocation.ALP,
      CALA: Allocation.NAT,
      CALW: Allocation.ALP,
      CANB: Allocation.ALP,
      CANN: Allocation.LIB,
      CAPR: Allocation.LNP,
      CASE: Allocation.LIB,
      CHIF: Allocation.ALP,
      CHIS: Allocation.LIB,
      CLAR: Allocation.IND,
      COOK: Allocation.LIB,
      COOP: Allocation.ALP,
      CORA: Allocation.ALP,
      CORI: Allocation.ALP,
      COWA: Allocation.ALP,
      COWP: Allocation.NAT,
      CUNN: Allocation.ALP,
      CURT: Allocation.LIB,
      DAWS: Allocation.LNP,
      DEAK: Allocation.LIB,
      DICK: Allocation.LNP,
      DOBE: Allocation.ALP,
      DUNK: Allocation.ALP,
      DURA: Allocation.LIB,
      EMON: Allocation.ALP,
      FADD: Allocation.LNP,
      FAIR: Allocation.LNP,
      FARR: Allocation.LIB,
      FENN: Allocation.ALP,
      FISH: Allocation.LNP,
      FLIN: Allocation.LIB,
      FLYN: Allocation.LNP,
      FORD: Allocation.LNP,
      FORR: Allocation.LIB,
      FOWL: Allocation.ALP,
      FRAN: Allocation.ALP,
      FRAS: Allocation.ALP,
      FREM: Allocation.ALP,
      GELL: Allocation.ALP,
      GILM: Allocation.ALP,
      GIPP: Allocation.NAT,
      GOLD: Allocation.LIB,
      GORT: Allocation.ALP,
      GRAY: Allocation.ALP,
      GREE: Allocation.ALP,
      GREY: Allocation.LIB,
      GRIF: Allocation.ALP,
      GROO: Allocation.LNP,
      HASL: Allocation.LIB,
      HAWK: Allocation.ALP,
      HERB: Allocation.LNP,
      HIGG: Allocation.LIB,
      HIND: Allocation.ALP,
      HINK: Allocation.LNP,
      HOLT: Allocation.ALP,
      HOTH: Allocation.ALP,
      HUGH: Allocation.LIB,
      HUME: Allocation.LIB,
      HUNT: Allocation.ALP,
      INDI: Allocation.IND,
      ISAA: Allocation.ALP,
      JAGA: Allocation.ALP,
      KENN: Allocation.KAP,
      KSMI: Allocation.ALP,
      KING: Allocation.ALP,
      KOOY: Allocation.LIB,
      LTRO: Allocation.LIB,
      LALO: Allocation.ALP,
      LEIC: Allocation.LNP,
      LILL: Allocation.ALP,
      LIND: Allocation.LIB,
      LING: Allocation.ALP,
      LONG: Allocation.LNP,
      LYNE: Allocation.NAT,
      LYON: Allocation.ALP,
      MACA: Allocation.ALP,
      MACK: Allocation.LIB,
      MACN: Allocation.ALP,
      MACQ: Allocation.ALP,
      MAKI: Allocation.ALP,
      MALL: Allocation.NAT,
      MARA: Allocation.LNP,
      MARI: Allocation.ALP,
      MAYO: Allocation.CA,
      MCEW: Allocation.ALP,
      MCMA: Allocation.ALP,
      MCPH: Allocation.LNP,
      MELB: Allocation.GRN,
      MENZ: Allocation.LIB,
      MITC: Allocation.LIB,
      MONA: Allocation.LIB,
      MONC: Allocation.LNP,
      MOOR: Allocation.LIB,
      MORE: Allocation.ALP,
      NENG: Allocation.NAT,
      NEWC: Allocation.ALP,
      NICH: Allocation.NAT,
      NSYD: Allocation.LIB,
      OCON: Allocation.LIB,
      OXLE: Allocation.ALP,
      PAGE: Allocation.NAT,
      PARK: Allocation.NAT,
      PARR: Allocation.ALP,
      PATE: Allocation.ALP,
      PEAR: Allocation.LIB,
      PERT: Allocation.ALP,
      PETR: Allocation.LNP,
      RANK: Allocation.ALP,
      REID: Allocation.LIB,
      RICH: Allocation.ALP,
      RIVE: Allocation.NAT,
      ROBE: Allocation.LIB,
      RYAN: Allocation.LNP,
      SCUL: Allocation.ALP,
      SHOR: Allocation.ALP,
      SOLO: Allocation.ALP,
      SPEN: Allocation.ALP,
      STUR: Allocation.LIB,
      SWAN: Allocation.LIB,
      SYDN: Allocation.ALP,
      TANG: Allocation.LIB,
      WANN: Allocation.LIB,
      WARR: Allocation.IND,
      WATS: Allocation.ALP,
      WENT: Allocation.LIB,
      WERR: Allocation.ALP,
      WHIT: Allocation.ALP,
      WBAY: Allocation.LNP,
      WILL: Allocation.ALP,
      WRIG: Allocation.LNP
    },
    focuses: {},
    year: 2019
  },
  safe: {
    name: 'Safe',
    allocations: {
      ...MIXINS.safecoalition.allocations,
      ...MIXINS.safelabor.allocations
    },
    focuses: {}
  }
};

export const ELECTION_YEARS = [2022, 2019] as const;

export const [DEFAULT_ELECTION_YEAR, DEFAULT_RELATIVE_ELECTION_YEAR] = ELECTION_YEARS;

export type ElectionYear = typeof ELECTION_YEARS[number];

type ElectionYearsPrimaryAlliances = Record<ElectionYear, [AllianceID, AllianceID]>;

// Important: Alliance IDs need to be ordered: [government, opposition], as this impacts Totals sides
export const ELECTION_YEARS_PRIMARY_ALLIANCES: ElectionYearsPrimaryAlliances = {
  2022: [AllianceID.CLN, AllianceID.ALP],
  2019: [AllianceID.CLN, AllianceID.ALP]
};
