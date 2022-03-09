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
  { id: ElectorateID.HUGH, name: 'Hughes (*)', isKeySeat: true },
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
];

export enum GroupID {
  AK,
  AL,
  AR,
  AZ,
  CA,
  CO,
  CT,
  DC,
  DE,
  FL,
  GA,
  HI,
  IA,
  ID,
  IL,
  IN,
  KS,
  KY,
  LA,
  MA,
  MD,
  ME_0,
  ME_1,
  ME_2,
  MI,
  MN,
  MO,
  MS,
  MT,
  NC,
  ND,
  NE_0,
  NE_1,
  NE_2,
  NE_3,
  NH,
  NJ,
  NM,
  NV,
  NY,
  OH,
  OK,
  OR,
  PA,
  RI,
  SC,
  SD,
  TN,
  TX,
  UT,
  VA,
  VT,
  WA,
  WI,
  WV,
  WY
}

export const GROUP_IDS = Object.keys(GroupID).filter(key => typeof GroupID[key] === 'number');

export type Group = {
  id: GroupID;
  name: string;
  votes: number;
};

export const GROUPS: Group[] = [
  {
    id: GroupID.AL,
    name: 'Alabama',
    votes: 9
  },
  {
    id: GroupID.AK,
    name: 'Alaska',
    votes: 3
  },
  {
    id: GroupID.AZ,
    name: 'Arizona',
    votes: 11
  },
  {
    id: GroupID.AR,
    name: 'Arkansas',
    votes: 6
  },
  {
    id: GroupID.CA,
    name: 'California',
    votes: 55
  },
  {
    id: GroupID.CO,
    name: 'Colorado',
    votes: 9
  },
  {
    id: GroupID.CT,
    name: 'Connecticut',
    votes: 7
  },
  {
    id: GroupID.DE,
    name: 'Delaware',
    votes: 3
  },
  {
    id: GroupID.DC,
    name: 'District of Columbia',
    votes: 3
  },
  {
    id: GroupID.FL,
    name: 'Florida',
    votes: 29
  },
  {
    id: GroupID.GA,
    name: 'Georgia',
    votes: 16
  },
  {
    id: GroupID.HI,
    name: 'Hawaii',
    votes: 4
  },
  {
    id: GroupID.ID,
    name: 'Idaho',
    votes: 4
  },
  {
    id: GroupID.IL,
    name: 'Illinois',
    votes: 20
  },
  {
    id: GroupID.IN,
    name: 'Indiana',
    votes: 11
  },
  {
    id: GroupID.IA,
    name: 'Iowa',
    votes: 6
  },
  {
    id: GroupID.KS,
    name: 'Kansas',
    votes: 6
  },
  {
    id: GroupID.KY,
    name: 'Kentucky',
    votes: 8
  },
  {
    id: GroupID.LA,
    name: 'Louisiana',
    votes: 8
  },
  {
    id: GroupID.ME_0,
    name: 'Maine (State)',
    votes: 2
  },
  {
    id: GroupID.ME_1,
    name: 'Maine (District 1)',
    votes: 1
  },
  {
    id: GroupID.ME_2,
    name: 'Maine (District 2)',
    votes: 1
  },
  {
    id: GroupID.MD,
    name: 'Maryland',
    votes: 10
  },
  {
    id: GroupID.MA,
    name: 'Massachusetts',
    votes: 11
  },
  {
    id: GroupID.MI,
    name: 'Michigan',
    votes: 16
  },
  {
    id: GroupID.MN,
    name: 'Minnesota',
    votes: 10
  },
  {
    id: GroupID.MS,
    name: 'Mississippi',
    votes: 6
  },
  {
    id: GroupID.MO,
    name: 'Missouri',
    votes: 10
  },
  {
    id: GroupID.MT,
    name: 'Montana',
    votes: 3
  },
  {
    id: GroupID.NE_0,
    name: 'Nebraska (State)',
    votes: 2
  },
  {
    id: GroupID.NE_1,
    name: 'Nebraska (District 1)',
    votes: 1
  },
  {
    id: GroupID.NE_2,
    name: 'Nebraska (District 2)',
    votes: 1
  },
  {
    id: GroupID.NE_3,
    name: 'Nebraska (District 3)',
    votes: 1
  },
  {
    id: GroupID.NV,
    name: 'Nevada',
    votes: 6
  },
  {
    id: GroupID.NH,
    name: 'New Hampshire',
    votes: 4
  },
  {
    id: GroupID.NJ,
    name: 'New Jersey',
    votes: 14
  },
  {
    id: GroupID.NM,
    name: 'New Mexico',
    votes: 5
  },
  {
    id: GroupID.NY,
    name: 'New York',
    votes: 29
  },
  {
    id: GroupID.NC,
    name: 'North Carolina',
    votes: 15
  },
  {
    id: GroupID.ND,
    name: 'North Dakota',
    votes: 3
  },
  {
    id: GroupID.OH,
    name: 'Ohio',
    votes: 18
  },
  {
    id: GroupID.OK,
    name: 'Oklahoma',
    votes: 7
  },
  {
    id: GroupID.OR,
    name: 'Oregon',
    votes: 7
  },
  {
    id: GroupID.PA,
    name: 'Pennsylvania',
    votes: 20
  },
  {
    id: GroupID.RI,
    name: 'Rhode Island',
    votes: 4
  },
  {
    id: GroupID.SC,
    name: 'South Carolina',
    votes: 9
  },
  {
    id: GroupID.SD,
    name: 'South Dakota',
    votes: 3
  },
  {
    id: GroupID.TN,
    name: 'Tennessee',
    votes: 11
  },
  {
    id: GroupID.TX,
    name: 'Texas',
    votes: 38
  },
  {
    id: GroupID.UT,
    name: 'Utah',
    votes: 6
  },
  {
    id: GroupID.VT,
    name: 'Vermont',
    votes: 3
  },
  {
    id: GroupID.VA,
    name: 'Virginia',
    votes: 13
  },
  {
    id: GroupID.WA,
    name: 'Washington',
    votes: 12
  },
  {
    id: GroupID.WV,
    name: 'West Virginia',
    votes: 5
  },
  {
    id: GroupID.WI,
    name: 'Wisconsin',
    votes: 10
  },
  {
    id: GroupID.WY,
    name: 'Wyoming',
    votes: 3
  }
];

export enum Allocation {
  None = 'n',
  CLN = 'c',
  LikelyCLN = 'q',
  Tossup = 't',
  LikelyALP = 'z',
  ALP = 'a'
}

export const ALLOCATIONS: string[] = Object.keys(Allocation).map(x => Allocation[x]);

export type Allocations = {
  [key: string]: Allocation;
};

export const INITIAL_ALLOCATIONS = GROUP_IDS.reduce((allocations, groupID) => {
  allocations[groupID] = Allocation.None;

  return allocations;
}, {});

export enum StateID {
  AK,
  AL,
  AR,
  AZ,
  CA,
  CO,
  CT,
  DC,
  DE,
  FL,
  GA,
  HI,
  IA,
  ID,
  IL,
  IN,
  KS,
  KY,
  LA,
  MA,
  MD,
  ME,
  MI,
  MN,
  MO,
  MS,
  MT,
  NC,
  ND,
  NE,
  NH,
  NJ,
  NM,
  NV,
  NY,
  OH,
  OK,
  OR,
  PA,
  RI,
  SC,
  SD,
  TN,
  TX,
  UT,
  VA,
  VT,
  WA,
  WI,
  WV,
  WY
}

export const STATE_IDS = Object.keys(StateID).filter(key => typeof StateID[key] === 'number');

export type State = {
  id: StateID;
  name: string;
};

export const STATES: State[] = GROUPS.filter(({ id }) => {
  const [, index] = GROUP_IDS[id].split('_');

  return index == null || index === '0';
}).map(({ id, name }) => {
  const stateID = StateID[GROUP_IDS[id].split('_')[0]] as unknown;

  return {
    id: stateID as StateID,
    name: name.split(' (')[0]
  };
});

export enum Focus {
  No = 'n',
  Yes = 'y'
}

export const FOCUSES: string[] = Object.keys(Focus).map(x => Focus[x]);

export type Focuses = {
  [key: string]: Focus;
};

export const INITIAL_FOCUSES = STATE_IDS.reduce((focuses, stateID) => {
  focuses[stateID] = Focus.No;

  return focuses;
}, {});

export type Preset = {
  name?: string;
  allocations: Allocations;
  focuses: Focuses;
  year?: ElectionYear;
};

export type Presets = {
  [key: string]: Preset;
};

export const MIXINS: Presets = {
  safecln: {
    name: 'Safe CLN',
    allocations: {
      CA: Allocation.CLN,
      CT: Allocation.CLN,
      DE: Allocation.CLN,
      DC: Allocation.CLN,
      HI: Allocation.CLN,
      IL: Allocation.CLN,
      ME_1: Allocation.CLN,
      MD: Allocation.CLN,
      MA: Allocation.CLN,
      NM: Allocation.CLN,
      NJ: Allocation.CLN,
      NY: Allocation.CLN,
      OR: Allocation.CLN,
      RI: Allocation.CLN,
      VT: Allocation.CLN,
      WA: Allocation.CLN
    },
    focuses: {}
  },
  safealp: {
    name: 'Safe ALP',
    allocations: {
      AL: Allocation.ALP,
      AK: Allocation.ALP,
      AR: Allocation.ALP,
      ID: Allocation.ALP,
      KS: Allocation.ALP,
      KY: Allocation.ALP,
      LA: Allocation.ALP,
      MS: Allocation.ALP,
      MT: Allocation.ALP,
      NE_0: Allocation.ALP,
      NE_1: Allocation.ALP,
      NE_3: Allocation.ALP,
      ND: Allocation.ALP,
      OK: Allocation.ALP,
      SC: Allocation.ALP,
      SD: Allocation.ALP,
      TN: Allocation.ALP,
      TX: Allocation.ALP,
      WV: Allocation.ALP,
      WY: Allocation.ALP
    },
    focuses: {}
  },
  nofocus: {
    name: 'No states focused',
    allocations: {},
    focuses: { ...INITIAL_FOCUSES }
  }
};

export const PRESETS: Presets = {
  2019: {
    allocations: {
      AK: Allocation.ALP,
      AL: Allocation.ALP,
      AR: Allocation.ALP,
      AZ: Allocation.ALP,
      CA: Allocation.CLN,
      CO: Allocation.CLN,
      CT: Allocation.CLN,
      DC: Allocation.CLN,
      DE: Allocation.CLN,
      FL: Allocation.ALP,
      GA: Allocation.ALP,
      HI: Allocation.CLN,
      IA: Allocation.ALP,
      ID: Allocation.ALP,
      IL: Allocation.CLN,
      IN: Allocation.ALP,
      KS: Allocation.ALP,
      KY: Allocation.ALP,
      LA: Allocation.ALP,
      MA: Allocation.CLN,
      MD: Allocation.CLN,
      ME_0: Allocation.CLN,
      ME_1: Allocation.CLN,
      ME_2: Allocation.ALP,
      MI: Allocation.ALP,
      MN: Allocation.CLN,
      MO: Allocation.ALP,
      MS: Allocation.ALP,
      MT: Allocation.ALP,
      NC: Allocation.ALP,
      ND: Allocation.ALP,
      NE_0: Allocation.ALP,
      NE_1: Allocation.ALP,
      NE_2: Allocation.ALP,
      NE_3: Allocation.ALP,
      NH: Allocation.CLN,
      NJ: Allocation.CLN,
      NM: Allocation.CLN,
      NV: Allocation.CLN,
      NY: Allocation.CLN,
      OH: Allocation.ALP,
      OK: Allocation.ALP,
      OR: Allocation.CLN,
      PA: Allocation.ALP,
      RI: Allocation.CLN,
      SC: Allocation.ALP,
      SD: Allocation.ALP,
      TN: Allocation.ALP,
      TX: Allocation.ALP,
      UT: Allocation.ALP,
      VA: Allocation.CLN,
      VT: Allocation.CLN,
      WA: Allocation.CLN,
      WI: Allocation.ALP,
      WV: Allocation.ALP,
      WY: Allocation.ALP
    },
    focuses: {},
    year: 2019
  },
  safe: {
    name: 'Safe',
    allocations: {
      ...MIXINS.safecln.allocations,
      ...MIXINS.safealp.allocations
    },
    focuses: {}
  },
  tossup: {
    name: 'Tossup',
    allocations: GROUP_IDS.reduce((allocations, groupID) => {
      allocations[groupID] = Allocation.Tossup;

      return allocations;
    }, {}),
    focuses: {}
  }
};

export const ELECTION_YEARS_ALLOCATIONS_CANDIDATES = {
  2022: {
    [Allocation.CLN]: 'L/NP',
    [Allocation.ALP]: 'ALP'
  },
  2019: {
    [Allocation.CLN]: 'L/NP',
    [Allocation.ALP]: 'ALP'
  }
};

export type ElectionYear = keyof typeof ELECTION_YEARS_ALLOCATIONS_CANDIDATES;

export const ELECTION_YEARS = Object.keys(ELECTION_YEARS_ALLOCATIONS_CANDIDATES)
  .reverse()
  .map(x => +x as ElectionYear);

export const [DEFAULT_ELECTION_YEAR, DEFAULT_RELATIVE_ELECTION_YEAR] = ELECTION_YEARS;
