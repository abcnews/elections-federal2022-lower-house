// NoYes (used for annotations and focuses)

export enum NoYes {
  No = 'n',
  Yes = 'y'
}

export const NOYES_VALUES: string[] = Object.values(NoYes);

// Allocations

export enum Allocation {
  None = 'a',
  Any = 'z',
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
  // An alternatice option for "teal independents"
  Teal = 't',
  // For previous winners (map to party with same colors),
  NXT = 'c',
  PUP = 'm'
}

export const ALLOCATION_VALUES: string[] = Object.values(Allocation);

export const NON_DEFINITIVE_ALLOCATION_VALUES = [Allocation.None, Allocation.Any];

export const DEFINITIVE_ALLOCATION_VALUES = ALLOCATION_VALUES.filter(
  allocation => NON_DEFINITIVE_ALLOCATION_VALUES.indexOf(allocation as Allocation) === -1
);

export type Allocations = {
  [key: string]: Allocation;
};

// States

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

// Electorates

export enum ElectorateSecurity {
  MARGINAL,
  SAFE,
  VERY_SAFE
}

export enum ElectorateSituation {
  INNER_METRO,
  OUTER_METRO,
  REGIONAL,
  RURAL
}

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
  state: StateID;
  holder: Allocation;
  security: ElectorateSecurity;
  situation: ElectorateSituation;
  isKeySeat?: boolean;
  name: string;
  abbr: string;
};

export const ELECTORATES: Electorate[] = [
  {
    id: ElectorateID.ADEL,
    state: StateID.SA,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.INNER_METRO,
    name: 'Adelaide'
  },
  {
    id: ElectorateID.ASTO,
    state: StateID.VIC,
    holder: Allocation.LIB,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Aston'
  },
  {
    id: ElectorateID.BALL,
    state: StateID.VIC,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.REGIONAL,
    name: 'Ballarat'
  },
  {
    id: ElectorateID.BANK,
    state: StateID.NSW,
    holder: Allocation.LIB,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.INNER_METRO,
    isKeySeat: true,
    name: 'Banks'
  },
  {
    id: ElectorateID.BARK,
    state: StateID.SA,
    holder: Allocation.LIB,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.RURAL,
    name: 'Barker'
  },
  {
    id: ElectorateID.BART,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.INNER_METRO,
    name: 'Barton'
  },
  {
    id: ElectorateID.BASS,
    state: StateID.TAS,
    holder: Allocation.LIB,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.REGIONAL,
    isKeySeat: true,
    name: 'Bass'
  },
  {
    id: ElectorateID.BEAN,
    state: StateID.ACT,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Bean'
  },
  {
    id: ElectorateID.BEND,
    state: StateID.VIC,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.REGIONAL,
    name: 'Bendigo'
  },
  {
    id: ElectorateID.BENN,
    state: StateID.NSW,
    holder: Allocation.LIB,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Bennelong'
  },
  {
    id: ElectorateID.BERO,
    state: StateID.NSW,
    holder: Allocation.LIB,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Berowra'
  },
  {
    id: ElectorateID.BLAI,
    state: StateID.QLD,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.OUTER_METRO,
    isKeySeat: true,
    name: 'Blair'
  },
  {
    id: ElectorateID.BLAX,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Blaxland'
  },
  {
    id: ElectorateID.BONN,
    state: StateID.QLD,
    holder: Allocation.LNP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.INNER_METRO,
    name: 'Bonner'
  },
  {
    id: ElectorateID.BOOT,
    state: StateID.SA,
    holder: Allocation.LIB,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.OUTER_METRO,
    isKeySeat: true,
    name: 'Boothby'
  },
  {
    id: ElectorateID.BOWM,
    state: StateID.QLD,
    holder: Allocation.LNP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Bowman'
  },
  {
    id: ElectorateID.BRAD,
    state: StateID.TAS,
    holder: Allocation.LIB,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.REGIONAL,
    isKeySeat: true,
    name: 'Braddon'
  },
  {
    id: ElectorateID.BRFD,
    state: StateID.NSW,
    holder: Allocation.LIB,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Bradfield'
  },
  {
    id: ElectorateID.BRAN,
    state: StateID.WA,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Brand'
  },
  {
    id: ElectorateID.BRIS,
    state: StateID.QLD,
    holder: Allocation.LNP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.INNER_METRO,
    isKeySeat: true,
    name: 'Brisbane'
  },
  {
    id: ElectorateID.BRUC,
    state: StateID.VIC,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Bruce'
  },
  {
    id: ElectorateID.BURT,
    state: StateID.WA,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Burt'
  },
  {
    id: ElectorateID.CALA,
    state: StateID.NSW,
    holder: Allocation.NAT,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.RURAL,
    name: 'Calare'
  },
  {
    id: ElectorateID.CALW,
    state: StateID.VIC,
    holder: Allocation.ALP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Calwell'
  },
  {
    id: ElectorateID.CANB,
    state: StateID.ACT,
    holder: Allocation.ALP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.INNER_METRO,
    name: 'Canberra'
  },
  {
    id: ElectorateID.CANN,
    state: StateID.WA,
    holder: Allocation.LIB,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Canning'
  },
  {
    id: ElectorateID.CAPR,
    state: StateID.QLD,
    holder: Allocation.LNP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.RURAL,
    name: 'Capricornia'
  },
  {
    id: ElectorateID.CASE,
    state: StateID.VIC,
    holder: Allocation.LIB,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.OUTER_METRO,
    isKeySeat: true,
    name: 'Casey'
  },
  {
    id: ElectorateID.CHIF,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Chifley'
  },
  {
    id: ElectorateID.CHIS,
    state: StateID.VIC,
    holder: Allocation.LIB,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.INNER_METRO,
    isKeySeat: true,
    name: 'Chisholm'
  },
  {
    id: ElectorateID.CLAR,
    state: StateID.TAS,
    holder: Allocation.IND,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.INNER_METRO,
    name: 'Clark'
  },
  {
    id: ElectorateID.COOK,
    state: StateID.NSW,
    holder: Allocation.LIB,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Cook'
  },
  {
    id: ElectorateID.COOP,
    state: StateID.VIC,
    holder: Allocation.ALP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.INNER_METRO,
    name: 'Cooper'
  },
  {
    id: ElectorateID.CORA,
    state: StateID.VIC,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.REGIONAL,
    isKeySeat: true,
    name: 'Corangamite'
  },
  {
    id: ElectorateID.CORI,
    state: StateID.VIC,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.REGIONAL,
    name: 'Corio'
  },
  {
    id: ElectorateID.COWA,
    state: StateID.WA,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.INNER_METRO,
    isKeySeat: true,
    name: 'Cowan'
  },
  {
    id: ElectorateID.COWP,
    state: StateID.NSW,
    holder: Allocation.NAT,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.RURAL,
    name: 'Cowper'
  },
  {
    id: ElectorateID.CUNN,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.REGIONAL,
    name: 'Cunningham'
  },
  {
    id: ElectorateID.CURT,
    state: StateID.WA,
    holder: Allocation.LIB,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.INNER_METRO,
    isKeySeat: true,
    name: 'Curtin'
  },
  {
    id: ElectorateID.DAWS,
    state: StateID.QLD,
    holder: Allocation.LNP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.RURAL,
    name: 'Dawson'
  },
  {
    id: ElectorateID.DEAK,
    state: StateID.VIC,
    holder: Allocation.LIB,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.OUTER_METRO,
    isKeySeat: true,
    name: 'Deakin'
  },
  {
    id: ElectorateID.DICK,
    state: StateID.QLD,
    holder: Allocation.LNP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.OUTER_METRO,
    isKeySeat: true,
    name: 'Dickson'
  },
  {
    id: ElectorateID.DOBE,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.OUTER_METRO,
    isKeySeat: true,
    name: 'Dobell'
  },
  {
    id: ElectorateID.DUNK,
    state: StateID.VIC,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.OUTER_METRO,
    isKeySeat: true,
    name: 'Dunkley'
  },
  {
    id: ElectorateID.DURA,
    state: StateID.WA,
    holder: Allocation.LIB,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.RURAL,
    name: 'Durack'
  },
  {
    id: ElectorateID.EMON,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.REGIONAL,
    isKeySeat: true,
    name: 'Eden-Monaro'
  },
  {
    id: ElectorateID.FADD,
    state: StateID.QLD,
    holder: Allocation.LNP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Fadden'
  },
  {
    id: ElectorateID.FAIR,
    state: StateID.QLD,
    holder: Allocation.LNP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Fairfax'
  },
  {
    id: ElectorateID.FARR,
    state: StateID.NSW,
    holder: Allocation.LIB,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.RURAL,
    name: 'Farrer'
  },
  {
    id: ElectorateID.FENN,
    state: StateID.ACT,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Fenner'
  },
  {
    id: ElectorateID.FISH,
    state: StateID.QLD,
    holder: Allocation.LNP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Fisher'
  },
  {
    id: ElectorateID.FLIN,
    state: StateID.VIC,
    holder: Allocation.LIB,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Flinders'
  },
  {
    id: ElectorateID.FLYN,
    state: StateID.QLD,
    holder: Allocation.LNP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.RURAL,
    isKeySeat: true,
    name: 'Flynn'
  },
  {
    id: ElectorateID.FORD,
    state: StateID.QLD,
    holder: Allocation.LNP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Forde'
  },
  {
    id: ElectorateID.FORR,
    state: StateID.WA,
    holder: Allocation.LIB,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.REGIONAL,
    name: 'Forrest'
  },
  {
    id: ElectorateID.FOWL,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    isKeySeat: true,
    name: 'Fowler'
  },
  {
    id: ElectorateID.FRAN,
    state: StateID.TAS,
    holder: Allocation.ALP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Franklin'
  },
  {
    id: ElectorateID.FRAS,
    state: StateID.VIC,
    holder: Allocation.ALP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Fraser'
  },
  {
    id: ElectorateID.FREM,
    state: StateID.WA,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.INNER_METRO,
    name: 'Fremantle'
  },
  {
    id: ElectorateID.GELL,
    state: StateID.VIC,
    holder: Allocation.ALP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.INNER_METRO,
    name: 'Gellibrand'
  },
  {
    id: ElectorateID.GILM,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.REGIONAL,
    isKeySeat: true,
    name: 'Gilmore'
  },
  {
    id: ElectorateID.GIPP,
    state: StateID.VIC,
    holder: Allocation.NAT,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.RURAL,
    name: 'Gippsland'
  },
  {
    id: ElectorateID.GOLD,
    state: StateID.VIC,
    holder: Allocation.LIB,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.INNER_METRO,
    isKeySeat: true,
    name: 'Goldstein'
  },
  {
    id: ElectorateID.GORT,
    state: StateID.VIC,
    holder: Allocation.ALP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Gorton'
  },
  {
    id: ElectorateID.GRAY,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.INNER_METRO,
    name: 'Grayndler'
  },
  {
    id: ElectorateID.GREE,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.OUTER_METRO,
    isKeySeat: true,
    name: 'Greenway'
  },
  {
    id: ElectorateID.GREY,
    state: StateID.SA,
    holder: Allocation.LIB,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.RURAL,
    isKeySeat: true,
    name: 'Grey'
  },
  {
    id: ElectorateID.GRIF,
    state: StateID.QLD,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.INNER_METRO,
    isKeySeat: true,
    name: 'Griffith'
  },
  {
    id: ElectorateID.GROO,
    state: StateID.QLD,
    holder: Allocation.LNP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.REGIONAL,
    name: 'Groom'
  },
  {
    id: ElectorateID.HASL,
    state: StateID.WA,
    holder: Allocation.LIB,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.OUTER_METRO,
    isKeySeat: true,
    name: 'Hasluck'
  },
  {
    id: ElectorateID.HAWK,
    state: StateID.VIC,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Hawke'
  },
  {
    id: ElectorateID.HERB,
    state: StateID.QLD,
    holder: Allocation.LNP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.REGIONAL,
    name: 'Herbert'
  },
  {
    id: ElectorateID.HIGG,
    state: StateID.VIC,
    holder: Allocation.LIB,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.INNER_METRO,
    isKeySeat: true,
    name: 'Higgins'
  },
  {
    id: ElectorateID.HIND,
    state: StateID.SA,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.INNER_METRO,
    name: 'Hindmarsh'
  },
  {
    id: ElectorateID.HINK,
    state: StateID.QLD,
    holder: Allocation.LNP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.RURAL,
    isKeySeat: true,
    name: 'Hinkler'
  },
  {
    id: ElectorateID.HOLT,
    state: StateID.VIC,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Holt'
  },
  {
    id: ElectorateID.HOTH,
    state: StateID.VIC,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.INNER_METRO,
    name: 'Hotham'
  },
  {
    id: ElectorateID.HUGH,
    state: StateID.NSW,
    holder: Allocation.LIB,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Hughes'
  },
  {
    id: ElectorateID.HUME,
    state: StateID.NSW,
    holder: Allocation.LIB,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.RURAL,
    name: 'Hume'
  },
  {
    id: ElectorateID.HUNT,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.REGIONAL,
    isKeySeat: true,
    name: 'Hunter'
  },
  {
    id: ElectorateID.INDI,
    state: StateID.VIC,
    holder: Allocation.IND,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.RURAL,
    isKeySeat: true,
    name: 'Indi'
  },
  {
    id: ElectorateID.ISAA,
    state: StateID.VIC,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Isaacs'
  },
  {
    id: ElectorateID.JAGA,
    state: StateID.VIC,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Jagajaga'
  },
  {
    id: ElectorateID.KENN,
    state: StateID.QLD,
    holder: Allocation.KAP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.RURAL,
    name: 'Kennedy'
  },
  {
    id: ElectorateID.KSMI,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.INNER_METRO,
    name: 'Kingsford Smith'
  },
  {
    id: ElectorateID.KING,
    state: StateID.SA,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Kingston'
  },
  {
    id: ElectorateID.KOOY,
    state: StateID.VIC,
    holder: Allocation.LIB,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.INNER_METRO,
    isKeySeat: true,
    name: 'Kooyong'
  },
  {
    id: ElectorateID.LTRO,
    state: StateID.VIC,
    holder: Allocation.LIB,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'La Trobe'
  },
  {
    id: ElectorateID.LALO,
    state: StateID.VIC,
    holder: Allocation.ALP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Lalor'
  },
  {
    id: ElectorateID.LEIC,
    state: StateID.QLD,
    holder: Allocation.LNP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.REGIONAL,
    isKeySeat: true,
    name: 'Leichhardt'
  },
  {
    id: ElectorateID.LILL,
    state: StateID.QLD,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.INNER_METRO,
    isKeySeat: true,
    name: 'Lilley'
  },
  {
    id: ElectorateID.LIND,
    state: StateID.NSW,
    holder: Allocation.LIB,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.OUTER_METRO,
    isKeySeat: true,
    name: 'Lindsay'
  },
  {
    id: ElectorateID.LING,
    state: StateID.NT,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.RURAL,
    isKeySeat: true,
    name: 'Lingiari'
  },
  {
    id: ElectorateID.LONG,
    state: StateID.QLD,
    holder: Allocation.LNP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.OUTER_METRO,
    isKeySeat: true,
    name: 'Longman'
  },
  {
    id: ElectorateID.LYNE,
    state: StateID.NSW,
    holder: Allocation.NAT,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.RURAL,
    name: 'Lyne'
  },
  {
    id: ElectorateID.LYON,
    state: StateID.TAS,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.RURAL,
    isKeySeat: true,
    name: 'Lyons'
  },
  {
    id: ElectorateID.MACA,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Macarthur'
  },
  {
    id: ElectorateID.MACK,
    state: StateID.NSW,
    holder: Allocation.LIB,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Mackellar'
  },
  {
    id: ElectorateID.MACN,
    state: StateID.VIC,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.INNER_METRO,
    isKeySeat: true,
    name: 'Macnamara'
  },
  {
    id: ElectorateID.MACQ,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.OUTER_METRO,
    isKeySeat: true,
    name: 'Macquarie'
  },
  {
    id: ElectorateID.MAKI,
    state: StateID.SA,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Makin'
  },
  {
    id: ElectorateID.MALL,
    state: StateID.VIC,
    holder: Allocation.NAT,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.RURAL,
    name: 'Mallee'
  },
  {
    id: ElectorateID.MARA,
    state: StateID.QLD,
    holder: Allocation.LNP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.RURAL,
    name: 'Maranoa'
  },
  {
    id: ElectorateID.MARI,
    state: StateID.VIC,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.INNER_METRO,
    name: 'Maribyrnong'
  },
  {
    id: ElectorateID.MAYO,
    state: StateID.SA,
    holder: Allocation.CA,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.OUTER_METRO,
    isKeySeat: true,
    name: 'Mayo'
  },
  {
    id: ElectorateID.MCEW,
    state: StateID.VIC,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.REGIONAL,
    name: 'McEwen'
  },
  {
    id: ElectorateID.MCMA,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'McMahon'
  },
  {
    id: ElectorateID.MCPH,
    state: StateID.QLD,
    holder: Allocation.LNP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'McPherson'
  },
  {
    id: ElectorateID.MELB,
    state: StateID.VIC,
    holder: Allocation.GRN,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.INNER_METRO,
    name: 'Melbourne'
  },
  {
    id: ElectorateID.MENZ,
    state: StateID.VIC,
    holder: Allocation.LIB,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Menzies'
  },
  {
    id: ElectorateID.MITC,
    state: StateID.NSW,
    holder: Allocation.LIB,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Mitchell'
  },
  {
    id: ElectorateID.MONA,
    state: StateID.VIC,
    holder: Allocation.LIB,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.RURAL,
    name: 'Monash'
  },
  {
    id: ElectorateID.MONC,
    state: StateID.QLD,
    holder: Allocation.LNP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Moncrieff'
  },
  {
    id: ElectorateID.MOOR,
    state: StateID.WA,
    holder: Allocation.LIB,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Moore'
  },
  {
    id: ElectorateID.MORE,
    state: StateID.QLD,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.INNER_METRO,
    isKeySeat: true,
    name: 'Moreton'
  },
  {
    id: ElectorateID.NENG,
    state: StateID.NSW,
    holder: Allocation.NAT,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.RURAL,
    name: 'New England'
  },
  {
    id: ElectorateID.NEWC,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.REGIONAL,
    name: 'Newcastle'
  },
  {
    id: ElectorateID.NICH,
    state: StateID.VIC,
    holder: Allocation.NAT,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.RURAL,
    isKeySeat: true,
    name: 'Nicholls'
  },
  {
    id: ElectorateID.NSYD,
    state: StateID.NSW,
    holder: Allocation.LIB,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.INNER_METRO,
    isKeySeat: true,
    name: 'North Sydney'
  },
  {
    id: ElectorateID.OCON,
    state: StateID.WA,
    holder: Allocation.LIB,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.RURAL,
    name: "O'Connor"
  },
  {
    id: ElectorateID.OXLE,
    state: StateID.QLD,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Oxley'
  },
  {
    id: ElectorateID.PAGE,
    state: StateID.NSW,
    holder: Allocation.NAT,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.RURAL,
    name: 'Page'
  },
  {
    id: ElectorateID.PARK,
    state: StateID.NSW,
    holder: Allocation.NAT,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.RURAL,
    name: 'Parkes'
  },
  {
    id: ElectorateID.PARR,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.OUTER_METRO,
    isKeySeat: true,
    name: 'Parramatta'
  },
  {
    id: ElectorateID.PATE,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.REGIONAL,
    isKeySeat: true,
    name: 'Paterson'
  },
  {
    id: ElectorateID.PEAR,
    state: StateID.WA,
    holder: Allocation.LIB,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    isKeySeat: true,
    name: 'Pearce'
  },
  {
    id: ElectorateID.PERT,
    state: StateID.WA,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.INNER_METRO,
    name: 'Perth'
  },
  {
    id: ElectorateID.PETR,
    state: StateID.QLD,
    holder: Allocation.LNP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Petrie'
  },
  {
    id: ElectorateID.RANK,
    state: StateID.QLD,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Rankin'
  },
  {
    id: ElectorateID.REID,
    state: StateID.NSW,
    holder: Allocation.LIB,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.INNER_METRO,
    isKeySeat: true,
    name: 'Reid'
  },
  {
    id: ElectorateID.RICH,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.REGIONAL,
    name: 'Richmond'
  },
  {
    id: ElectorateID.RIVE,
    state: StateID.NSW,
    holder: Allocation.NAT,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.RURAL,
    name: 'Riverina'
  },
  {
    id: ElectorateID.ROBE,
    state: StateID.NSW,
    holder: Allocation.LIB,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.OUTER_METRO,
    isKeySeat: true,
    name: 'Robertson'
  },
  {
    id: ElectorateID.RYAN,
    state: StateID.QLD,
    holder: Allocation.LNP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.INNER_METRO,
    name: 'Ryan'
  },
  {
    id: ElectorateID.SCUL,
    state: StateID.VIC,
    holder: Allocation.ALP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Scullin'
  },
  {
    id: ElectorateID.SHOR,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.REGIONAL,
    name: 'Shortland'
  },
  {
    id: ElectorateID.SOLO,
    state: StateID.NT,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.OUTER_METRO,
    isKeySeat: true,
    name: 'Solomon'
  },
  {
    id: ElectorateID.SPEN,
    state: StateID.SA,
    holder: Allocation.ALP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Spence'
  },
  {
    id: ElectorateID.STUR,
    state: StateID.SA,
    holder: Allocation.LIB,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.INNER_METRO,
    name: 'Sturt'
  },
  {
    id: ElectorateID.SWAN,
    state: StateID.WA,
    holder: Allocation.LIB,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.INNER_METRO,
    isKeySeat: true,
    name: 'Swan'
  },
  {
    id: ElectorateID.SYDN,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.INNER_METRO,
    name: 'Sydney'
  },
  {
    id: ElectorateID.TANG,
    state: StateID.WA,
    holder: Allocation.LIB,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.INNER_METRO,
    name: 'Tangney'
  },
  {
    id: ElectorateID.WANN,
    state: StateID.VIC,
    holder: Allocation.LIB,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.RURAL,
    name: 'Wannon'
  },
  {
    id: ElectorateID.WARR,
    state: StateID.NSW,
    holder: Allocation.IND,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Warringah'
  },
  {
    id: ElectorateID.WATS,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.INNER_METRO,
    name: 'Watson'
  },
  {
    id: ElectorateID.WENT,
    state: StateID.NSW,
    holder: Allocation.LIB,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.INNER_METRO,
    isKeySeat: true,
    name: 'Wentworth'
  },
  {
    id: ElectorateID.WERR,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.MARGINAL,
    situation: ElectorateSituation.OUTER_METRO,
    name: 'Werriwa'
  },
  {
    id: ElectorateID.WHIT,
    state: StateID.NSW,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.REGIONAL,
    name: 'Whitlam'
  },
  {
    id: ElectorateID.WBAY,
    state: StateID.QLD,
    holder: Allocation.LNP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.RURAL,
    name: 'Wide Bay'
  },
  {
    id: ElectorateID.WILL,
    state: StateID.VIC,
    holder: Allocation.ALP,
    security: ElectorateSecurity.SAFE,
    situation: ElectorateSituation.INNER_METRO,
    name: 'Wills'
  },
  {
    id: ElectorateID.WRIG,
    state: StateID.QLD,
    holder: Allocation.LNP,
    security: ElectorateSecurity.VERY_SAFE,
    situation: ElectorateSituation.REGIONAL,
    name: 'Wright'
  }
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

// Electorates > Allocationss

export const ELECTORATES_HELD_ALLOCATIONS = ELECTORATES.reduce(
  (memo, electorate) => ({
    ...memo,
    [ElectorateID[electorate.id]]: electorate.holder
  }),
  {} as Allocations
);

export const INITIAL_ELECTORATES_ALLOCATIONS = ELECTORATE_IDS.reduce((allocations, electorateID) => {
  allocations[electorateID] = Allocation.None;

  return allocations;
}, {} as Allocations);

// Alliances

export enum AllianceID {
  ALP,
  CLN
}

export const PRIMARY_ALLIANCES: [AllianceID, AllianceID] = [AllianceID.CLN, AllianceID.ALP];

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

export const ALLOCATIONS_ALLIANCES = ALLOCATION_VALUES.map(allocation =>
  ALLIANCES.find(alliance => alliance.allocations.indexOf(allocation as Allocation) !== -1)
);

// Annotations

export type Annotations = {
  [key: string]: NoYes;
};

export const INITIAL_ELECTORATES_ANNOTATIONS = ELECTORATE_IDS.reduce((annotations, electorateID) => {
  annotations[electorateID] = NoYes.No;

  return annotations;
}, {} as Annotations);

// Certainties

export type Certainties = {
  [key: string]: NoYes;
};

export const INITIAL_ELECTORATES_CERTAINTIES = ELECTORATE_IDS.reduce((certainties, electorateID) => {
  certainties[electorateID] = NoYes.Yes;

  return certainties;
}, {} as Certainties);

// Focuses

export type Focuses = {
  [key: string]: NoYes;
};

export const INITIAL_ELECTORATES_FOCUSES = ELECTORATE_IDS.reduce((focuses, electorateID) => {
  focuses[electorateID] = NoYes.No;

  return focuses;
}, {} as Focuses);

// Layouts

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
  WA = 'k',
  NSW_QLD = 'l',
  NSW_VIC = 'm',
  QLD_VIC = 'n',
  QLD_WA = 'o',
  QLD_NSW_VIC = 'p',
  SA_TAS_WA = 'q',
  ACT_NT = 'r'
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
  [Layout.WA]: 'WA',
  [Layout.ACT_NT]: 'ACT & NT',
  [Layout.NSW_QLD]: 'Qld. & NSW',
  [Layout.NSW_VIC]: 'NSW & Vic.',
  [Layout.QLD_VIC]: 'Qld. & Vic.',
  [Layout.QLD_WA]: 'WA & Qld',
  [Layout.QLD_NSW_VIC]: 'Qld., NSW & Vic.',
  [Layout.SA_TAS_WA]: 'WA, SA & Tas.'
};

export const DEFAULT_LAYOUT = Layout.EXPLODED;
export const ALL_STATES_LAYOUTS = [Layout.GEO, Layout.COUNTRY, Layout.EXPLODED, Layout.GRID];
export const MULTI_STATE_LAYOUTS = [
  ...ALL_STATES_LAYOUTS,
  Layout.ACT_NT,
  Layout.NSW_QLD,
  Layout.NSW_VIC,
  Layout.QLD_VIC,
  Layout.QLD_WA,
  Layout.QLD_NSW_VIC,
  Layout.SA_TAS_WA
];
export const SINGLE_STATE_LAYOUTS = LAYOUTS.filter(layout => MULTI_STATE_LAYOUTS.indexOf(layout as Layout) === -1);

// Areas

export enum Area {
  Australia = 'a',
  BrisbaneAndSurrounds = 'b',
  SydneyAndSurrounds = 'c',
  MelbourneAndSurrounds = 'd',
  InnerCitySydney = 'e',
  InnerCityMelbourne = 'f',
  Perth = 'g',
  Adelaide = 'h',
  Tasmania = 'i',
  FocusDriven = 'z'
}

export const AREAS: string[] = Object.values(Area);

export const AREA_LABELS: Record<Area, string> = {
  [Area.Australia]: 'Australia',
  [Area.BrisbaneAndSurrounds]: 'Brisbane and surrounds',
  [Area.SydneyAndSurrounds]: 'Sydney and surrounds',
  [Area.MelbourneAndSurrounds]: 'Melbourne and surrounds',
  [Area.InnerCitySydney]: 'Inner-city Sydney',
  [Area.InnerCityMelbourne]: 'Inner-city Melbourne',
  [Area.Perth]: 'Perth',
  [Area.Adelaide]: 'Adelaide',
  [Area.Tasmania]: 'Tasmania',
  [Area.FocusDriven]: 'Focus-driven'
};

export const DEFAULT_AREA = Area.Australia;
