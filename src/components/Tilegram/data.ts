import concaveman from 'concaveman';

type Vector2 = [number, number]; // [x, y]
type Vector2Record = Record<string, Vector2>;

type Cell = [number, number]; // [column, row]
type CellRecord = Record<string, Cell>;
type CellsRecord = Record<string, Cell[]>;

type Polygon = Vector2[];
type PolygonRecord = Record<string, Polygon>;
type PolygonsRecord = Record<string, Polygon[]>;

type Path = string;
type PathRecord = Record<string, Path>;
type PathsRecord = Record<string, Path[]>;

export const HEX_SIZE = 17;
export const HEX_WIDTH = Math.sqrt(3) * HEX_SIZE;
export const HEX_HEIGHT = 2 * HEX_SIZE;
export const HEXGRID_CELLS_WIDE = 14;
export const HEXGRID_CELLS_HIGH = 19;

export const HEXGRID_PROPS = {
  width: HEXGRID_CELLS_WIDE * HEX_WIDTH,
  height: (HEXGRID_CELLS_HIGH + 0.33) * ((HEX_HEIGHT / 4) * 3),
  margin: 2
};

const flattenNestedRecords = <T>(record: Record<string, Record<string, T>>) =>
  Object.keys(record).reduce((memo, key) => ({ ...memo, ...record[key] }), {} as Record<string, T>);

const transformRecordsValues = <F, T>(record: Record<string, F>, transformFn: (from: F) => T) =>
  Object.keys(record).reduce(
    (memo, key) => ({
      ...memo,
      [key]: transformFn(record[key])
    }),
    {} as Record<string, T>
  );

const transformNestedRecordsValues = <F, T>(record: Record<string, Record<string, F>>, transformFn: (from: F) => T) =>
  Object.keys(record).reduce(
    (memo, key) => ({
      ...memo,
      [key]: Object.keys(record[key]).reduce(
        (memo, nestedKey) => ({
          ...memo,
          [nestedKey]: transformFn(record[key][nestedKey])
        }),
        {} as Record<string, T>
      )
    }),
    {} as Record<string, Record<string, T>>
  );

const areVector2sEqual = (a: Vector2, b: Vector2) => a[0] === b[0] && a[1] === b[1];

const uniqueVector2sReducer = (memo: Vector2[], vector2: Vector2) => {
  if (memo.find(retainedVector2 => areVector2sEqual(vector2, retainedVector2))) {
    return memo;
  }

  return [...memo, vector2];
};

const getHexTop = ([column, row]: Cell): Vector2 => [
  HEX_WIDTH * (column + 0.5 * (row & 1)),
  ((HEX_SIZE * 3) / 2) * row
];

const getHexPolygon = (cell: Cell): Polygon => {
  const [x, y] = getHexTop(cell);

  return [
    [x - HEX_WIDTH / 2, y + (HEX_HEIGHT / 4) * 3].map(Math.round) as Vector2,
    [x, y + HEX_HEIGHT].map(Math.round) as Vector2,
    [x + HEX_WIDTH / 2, y + (HEX_HEIGHT / 4) * 3].map(Math.round) as Vector2,
    [x + HEX_WIDTH / 2, y + HEX_HEIGHT / 4].map(Math.round) as Vector2,
    [x, y].map(Math.round) as Vector2,
    [x - HEX_WIDTH / 2, y + HEX_HEIGHT / 4].map(Math.round) as Vector2,
    [x - HEX_WIDTH / 2, y + (HEX_HEIGHT / 4) * 3].map(Math.round) as Vector2
  ];
};

const getPath = (polygon: Polygon) => `M${polygon.map(point => point.join(',')).join(' ')}`;

/* TODO: State top-left cells, with relative electorate cells? */
const STATES_ELECTORATES_CELLS: Record<string, CellRecord> = {
  ACT: {
    BEAN: [9, 11],
    CANB: [10, 11],
    FENN: [9, 10]
  },
  NSW: {
    BANK: [11, 10],
    BART: [11, 11],
    BENN: [10, 7],
    BERO: [8, 7],
    BLAX: [11, 9],
    BRFD: [12, 7],
    CALA: [4, 7],
    CHIF: [9, 8],
    COOK: [9, 9],
    COWP: [6, 6],
    CUNN: [7, 9],
    DOBE: [10, 6],
    EMON: [5, 9],
    FARR: [4, 9],
    FOWL: [10, 8],
    GILM: [6, 9],
    GRAY: [12, 9],
    GREE: [11, 8],
    HUGH: [10, 10],
    HUME: [6, 8],
    HUNT: [12, 6],
    KSMI: [12, 12],
    LIND: [7, 6],
    LYNE: [6, 7],
    MACA: [8, 8],
    MACK: [9, 7],
    MACQ: [8, 6],
    MCMA: [7, 7],
    MITC: [11, 7],
    NENG: [5, 8],
    NEWC: [13, 7],
    NSYD: [13, 9],
    PAGE: [5, 7],
    PARK: [4, 6],
    PARR: [10, 9],
    PATE: [13, 8],
    REID: [12, 8],
    RICH: [5, 6],
    RIVE: [4, 8],
    ROBE: [9, 6],
    SHOR: [11, 6],
    SYDN: [13, 10],
    WARR: [13, 8],
    WATS: [12, 10],
    WENT: [12, 11],
    WERR: [8, 9],
    WHIT: [7, 8]
  },
  NT: {
    LING: [3, 8],
    SOLO: [2, 5]
  },
  QLD: {
    BLAI: [7, 9],
    BONN: [11, 2],
    BOWM: [12, 4],
    BRIS: [10, 3],
    CAPR: [8, 2],
    DAWS: [8, 1],
    DICK: [8, 3],
    FADD: [11, 9],
    FAIR: [10, 1],
    FISH: [10, 2],
    FLYN: [7, 3],
    FORD: [10, 3],
    GRIF: [10, 4],
    GROO: [6, 5],
    HERB: [9, 1],
    HINK: [6, 3],
    KENN: [6, 4],
    LEIC: [9, 0],
    LILL: [11, 3],
    LONG: [9, 2],
    MARA: [5, 5],
    MCPH: [12, 5],
    MONC: [11, 5],
    MORE: [8, 4],
    OXLE: [9, 5],
    PETR: [9, 3],
    RANK: [9, 4],
    RYAN: [8, 5],
    WBAY: [10, 0],
    WRIG: [7, 5]
  },
  SA: {
    ADEL: [3, 10],
    BARK: [3, 7],
    BOOT: [2, 11],
    GREY: [2, 7],
    HIND: [2, 9],
    KING: [3, 12],
    MAKI: [3, 9],
    MAYO: [3, 13],
    SPEN: [3, 8],
    STUR: [3, 11]
  },
  TAS: {
    BASS: [9, 17],
    BRAD: [7, 17],
    CLAR: [9, 18],
    FRAN: [8, 18],
    LYON: [8, 17]
  },
  VIC: {
    ASTO: [9, 12],
    BALL: [5, 14],
    BEND: [4, 11],
    BRUC: [9, 13],
    CALW: [6, 10],
    CASE: [9, 13],
    CHIS: [7, 13],
    COOP: [8, 12],
    CORA: [5, 15],
    CORI: [5, 13],
    DEAK: [18, 11],
    DUNK: [9, 15],
    FLIN: [10, 15],
    FRAS: [6, 12],
    GELL: [6, 15],
    GIPP: [11, 12],
    GOLD: [8, 15],
    GORT: [5, 11],
    HAWK: [4, 12],
    HIGG: [8, 14],
    HOLT: [10, 14],
    HOTH: [8, 13],
    INDI: [8, 10],
    ISAA: [9, 14],
    JAGA: [6, 11],
    KOOY: [6, 13],
    LTRO: [11, 14],
    LALO: [5, 12],
    MACN: [7, 15],
    MALL: [4, 10],
    MARI: [6, 14],
    MCEW: [10, 12],
    MELB: [7, 14],
    MENZ: [7, 11],
    MONA: [11, 13],
    NICH: [5, 10],
    SCUL: [7, 10],
    WANN: [4, 13],
    WILL: [7, 12]
  },
  WA: {
    BRAN: [0, 11],
    BURT: [2, 12],
    CANN: [1, 12],
    COWA: [1, 9],
    CURT: [0, 9],
    DURA: [2, 6],
    FORR: [0, 13],
    FREM: [0, 10],
    HASL: [2, 8],
    MOOR: [1, 8],
    OCON: [1, 13],
    PEAR: [1, 7],
    PERT: [1, 10],
    SWAN: [2, 12],
    TANG: [1, 11]
  }
};

const ELECTORATES_CELLS = flattenNestedRecords<Cell>(STATES_ELECTORATES_CELLS);

const STATES_ELECTORATES_POLYGONS = transformNestedRecordsValues<Cell, Polygon>(
  STATES_ELECTORATES_CELLS,
  getHexPolygon
);

export const ELECTORATES_POLYGONS = flattenNestedRecords<Polygon>(STATES_ELECTORATES_POLYGONS);

const STATES_ELECTORATES_PATHS = transformNestedRecordsValues<Polygon, Path>(STATES_ELECTORATES_POLYGONS, getPath);

export const ELECTORATES_PATHS = flattenNestedRecords<Path>(STATES_ELECTORATES_PATHS);

export const _STATES_POLYGONS = Object.keys(STATES_ELECTORATES_POLYGONS).reduce(
  (memo, stateKey) => ({
    ...memo,
    [stateKey]: concaveman(
      Object.keys(STATES_ELECTORATES_POLYGONS[stateKey])
        .reduce(
          (memo, electorateKey) => [...memo, ...STATES_ELECTORATES_POLYGONS[stateKey][electorateKey]],
          [] as Vector2[]
        )
        .reduce(uniqueVector2sReducer, [] as Vector2[]),
      0.8,
      HEX_SIZE
    ) as Polygon
  }),
  {} as Record<string, Polygon>
);

const _STATES_PATHS = transformRecordsValues<Polygon, Path>(_STATES_POLYGONS, getPath);

// console.log({
//   STATES_ELECTORATES_CELLS,
//   ELECTORATES_CELLS,
//   STATES_ELECTORATES_POLYGONS,
//   ELECTORATES_POLYGONS,
//   STATES_ELECTORATES_PATHS,
//   ELECTORATES_PATHS,
//   _STATES_POLYGONS,
//   _STATES_PATHS
// });

/* OLD US ELECTION STUFF */

const GROUPS_DELEGATE_CELLS = {
  AK: [
    [1, 22],
    [0, 23],
    [1, 23]
  ],
  AL: [
    [17, 18],
    [18, 18],
    [16, 19],
    [17, 19],
    [17, 20],
    [18, 20],
    [17, 21],
    [18, 21],
    [17, 22]
  ],
  AR: [
    [14, 14],
    [13, 15],
    [14, 15],
    [14, 16],
    [13, 17],
    [14, 17]
  ],
  AZ: [
    [7, 14],
    [6, 15],
    [7, 15],
    [7, 16],
    [6, 17],
    [7, 17],
    [7, 18],
    [6, 19],
    [7, 19],
    [6, 20],
    [7, 20]
  ],
  CA: [
    [1, 8],
    [2, 8],
    [3, 8],
    [4, 8],
    [5, 8],
    [1, 9],
    [2, 9],
    [3, 9],
    [4, 9],
    [1, 10],
    [2, 10],
    [3, 10],
    [4, 10],
    [5, 10],
    [1, 11],
    [2, 11],
    [3, 11],
    [4, 11],
    [5, 11],
    [1, 12],
    [2, 12],
    [3, 12],
    [4, 12],
    [5, 12],
    [2, 13],
    [3, 13],
    [4, 13],
    [5, 13],
    [6, 13],
    [1, 14],
    [2, 14],
    [3, 14],
    [4, 14],
    [5, 14],
    [6, 14],
    [1, 15],
    [2, 15],
    [3, 15],
    [4, 15],
    [5, 15],
    [2, 16],
    [3, 16],
    [4, 16],
    [5, 16],
    [6, 16],
    [2, 17],
    [3, 17],
    [4, 17],
    [5, 17],
    [3, 18],
    [4, 18],
    [5, 18],
    [6, 18],
    [4, 19],
    [5, 19]
  ],
  CO: [
    [8, 8],
    [8, 9],
    [8, 10],
    [9, 10],
    [8, 11],
    [8, 12],
    [9, 12],
    [8, 13],
    [8, 14]
  ],
  CT: [
    [30, 6],
    [31, 6],
    [32, 6],
    [29, 7],
    [30, 7],
    [31, 7],
    [32, 7]
  ],
  DC: [
    [28, 13],
    [28, 14],
    [28, 15]
  ],
  DE: [
    [30, 12],
    [30, 13],
    [31, 14]
  ],
  FL: [
    [18, 22],
    [19, 22],
    [20, 22],
    [21, 22],
    [22, 22],
    [23, 22],
    [19, 23],
    [20, 23],
    [21, 23],
    [22, 23],
    [20, 24],
    [21, 24],
    [22, 24],
    [23, 24],
    [19, 25],
    [20, 25],
    [21, 25],
    [22, 25],
    [20, 26],
    [21, 26],
    [22, 26],
    [23, 26],
    [20, 27],
    [21, 27],
    [22, 27],
    [23, 27],
    [21, 28],
    [22, 28],
    [23, 28]
  ],
  GA: [
    [19, 18],
    [20, 18],
    [21, 18],
    [18, 19],
    [19, 19],
    [20, 19],
    [21, 19],
    [19, 20],
    [20, 20],
    [21, 20],
    [22, 20],
    [19, 21],
    [20, 21],
    [21, 21],
    [22, 21],
    [23, 21]
  ],
  HI: [
    [4, 25],
    [6, 26],
    [7, 27],
    [7, 28]
  ],
  IA: [
    [11, 9],
    [12, 9],
    [13, 9],
    [12, 10],
    [13, 10],
    [14, 10]
  ],
  ID: [
    [7, 5],
    [8, 6],
    [7, 7],
    [8, 7]
  ],
  IL: [
    [14, 9],
    [15, 9],
    [16, 9],
    [17, 9],
    [15, 10],
    [16, 10],
    [17, 10],
    [14, 11],
    [15, 11],
    [16, 11],
    [17, 11],
    [15, 12],
    [16, 12],
    [17, 12],
    [15, 13],
    [16, 13],
    [17, 13],
    [15, 14],
    [16, 14],
    [17, 14]
  ],
  IN: [
    [18, 9],
    [19, 9],
    [18, 10],
    [19, 10],
    [18, 11],
    [19, 11],
    [18, 12],
    [19, 12],
    [18, 13],
    [19, 13],
    [18, 14]
  ],
  KS: [
    [9, 11],
    [10, 11],
    [10, 12],
    [11, 12],
    [9, 13],
    [10, 13]
  ],
  KY: [
    [19, 14],
    [20, 14],
    [15, 15],
    [16, 15],
    [17, 15],
    [18, 15],
    [19, 15],
    [20, 15]
  ],
  LA: [
    [14, 18],
    [13, 19],
    [14, 19],
    [14, 20],
    [13, 21],
    [14, 21],
    [15, 21],
    [15, 22]
  ],
  MA: [
    [32, 3],
    [30, 4],
    [31, 4],
    [32, 4],
    [33, 4],
    [29, 5],
    [30, 5],
    [31, 5],
    [32, 5],
    [33, 5],
    [34, 5]
  ],
  MD: [
    [25, 12],
    [26, 12],
    [27, 12],
    [28, 12],
    [29, 12],
    [26, 13],
    [29, 13],
    [29, 14],
    [30, 14],
    [29, 15]
  ],
  ME: [
    [32, 0],
    [33, 0],
    [32, 1],
    [32, 2]
  ],
  MI: [
    [17, 4],
    [18, 4],
    [17, 5],
    [19, 5],
    [20, 5],
    [19, 6],
    [20, 6],
    [21, 6],
    [22, 6],
    [18, 7],
    [19, 7],
    [20, 7],
    [21, 7],
    [19, 8],
    [20, 8],
    [21, 8]
  ],
  MN: [
    [12, 5],
    [13, 5],
    [14, 5],
    [12, 6],
    [13, 6],
    [12, 7],
    [13, 7],
    [12, 8],
    [13, 8],
    [14, 8]
  ],
  MO: [
    [11, 11],
    [12, 11],
    [13, 11],
    [12, 12],
    [13, 12],
    [14, 12],
    [11, 13],
    [12, 13],
    [13, 13],
    [14, 13]
  ],
  MS: [
    [15, 18],
    [16, 18],
    [15, 19],
    [15, 20],
    [16, 20],
    [16, 21]
  ],
  MT: [
    [8, 5],
    [9, 5],
    [10, 6]
  ],
  NC: [
    [21, 16],
    [22, 16],
    [23, 16],
    [24, 16],
    [25, 16],
    [26, 16],
    [27, 16],
    [20, 17],
    [21, 17],
    [22, 17],
    [23, 17],
    [24, 17],
    [25, 17],
    [26, 17],
    [27, 18]
  ],
  ND: [
    [10, 5],
    [11, 5],
    [11, 6]
  ],
  NE: [
    [10, 8],
    [9, 9],
    [10, 9],
    [10, 10],
    [11, 10]
  ],
  NH: [
    [31, 1],
    [31, 2],
    [30, 3],
    [31, 3]
  ],
  NJ: [
    [28, 9],
    [29, 9],
    [30, 9],
    [31, 9],
    [29, 10],
    [30, 10],
    [31, 10],
    [32, 10],
    [28, 11],
    [29, 11],
    [30, 11],
    [31, 11],
    [31, 12],
    [32, 12]
  ],
  NM: [
    [8, 15],
    [8, 16],
    [8, 17],
    [8, 18],
    [8, 19]
  ],
  NV: [
    [6, 8],
    [5, 9],
    [6, 9],
    [6, 10],
    [6, 11],
    [6, 12]
  ],
  NY: [
    [28, 1],
    [29, 1],
    [28, 2],
    [29, 2],
    [27, 3],
    [28, 3],
    [27, 4],
    [28, 4],
    [29, 4],
    [24, 5],
    [25, 5],
    [26, 5],
    [27, 5],
    [28, 5],
    [24, 6],
    [25, 6],
    [26, 6],
    [27, 6],
    [28, 6],
    [29, 6],
    [23, 7],
    [24, 7],
    [25, 7],
    [26, 7],
    [27, 7],
    [28, 7],
    [28, 8],
    [29, 8],
    [30, 8]
  ],
  OH: [
    [20, 9],
    [21, 9],
    [22, 9],
    [20, 10],
    [21, 10],
    [22, 10],
    [23, 10],
    [20, 11],
    [21, 11],
    [22, 11],
    [20, 12],
    [21, 12],
    [22, 12],
    [23, 12],
    [20, 13],
    [21, 13],
    [22, 13],
    [21, 14]
  ],
  OK: [
    [9, 14],
    [10, 14],
    [11, 14],
    [12, 14],
    [13, 14],
    [11, 15],
    [12, 15]
  ],
  OR: [
    [0, 7],
    [1, 7],
    [2, 7],
    [3, 7],
    [4, 7],
    [5, 7],
    [6, 7]
  ],
  PA: [
    [23, 8],
    [24, 8],
    [25, 8],
    [26, 8],
    [27, 8],
    [23, 9],
    [24, 9],
    [25, 9],
    [26, 9],
    [27, 9],
    [24, 10],
    [25, 10],
    [26, 10],
    [27, 10],
    [28, 10],
    [23, 11],
    [24, 11],
    [25, 11],
    [26, 11],
    [27, 11]
  ],
  RI: [
    [33, 6],
    [34, 6],
    [33, 7],
    [34, 7]
  ],
  SC: [
    [22, 18],
    [23, 18],
    [24, 18],
    [25, 18],
    [22, 19],
    [23, 19],
    [24, 19],
    [23, 20],
    [24, 20]
  ],
  SD: [
    [10, 7],
    [11, 7],
    [11, 8]
  ],
  TN: [
    [15, 16],
    [16, 16],
    [17, 16],
    [18, 16],
    [19, 16],
    [20, 16],
    [15, 17],
    [16, 17],
    [17, 17],
    [18, 17],
    [19, 17]
  ],
  TX: [
    [9, 15],
    [10, 15],
    [9, 16],
    [10, 16],
    [11, 16],
    [12, 16],
    [13, 16],
    [9, 17],
    [10, 17],
    [11, 17],
    [12, 17],
    [9, 18],
    [10, 18],
    [11, 18],
    [12, 18],
    [13, 18],
    [9, 19],
    [10, 19],
    [11, 19],
    [12, 19],
    [9, 20],
    [10, 20],
    [11, 20],
    [12, 20],
    [13, 20],
    [9, 21],
    [10, 21],
    [11, 21],
    [12, 21],
    [10, 22],
    [11, 22],
    [12, 22],
    [9, 23],
    [10, 23],
    [11, 23],
    [10, 24],
    [11, 24],
    [12, 24]
  ],
  UT: [
    [7, 8],
    [7, 9],
    [7, 10],
    [7, 11],
    [7, 12],
    [7, 13]
  ],
  VA: [
    [25, 13],
    [27, 13],
    [22, 14],
    [25, 14],
    [26, 14],
    [27, 14],
    [21, 15],
    [22, 15],
    [23, 15],
    [24, 15],
    [25, 15],
    [26, 15],
    [27, 15]
  ],
  VT: [
    [30, 1],
    [30, 2],
    [29, 3]
  ],
  WA: [
    [2, 5],
    [3, 5],
    [4, 5],
    [5, 5],
    [6, 5],
    [1, 6],
    [2, 6],
    [3, 6],
    [4, 6],
    [5, 6],
    [6, 6],
    [7, 6]
  ],
  WI: [
    [14, 6],
    [15, 6],
    [16, 6],
    [17, 6],
    [14, 7],
    [15, 7],
    [16, 7],
    [15, 8],
    [16, 8],
    [17, 8]
  ],
  WV: [
    [24, 12],
    [23, 13],
    [24, 13],
    [23, 14],
    [24, 14]
  ],
  WY: [
    [9, 6],
    [9, 7],
    [9, 8]
  ]
};

export const GROUPS_DELEGATES_POINTS: PolygonsRecord = Object.keys(GROUPS_DELEGATE_CELLS).reduce(
  (memo, key) => ({
    ...memo,
    [key]: GROUPS_DELEGATE_CELLS[key].map((cell: Cell) => getHexPolygon(cell))
  }),
  {} as PolygonsRecord
);

export const GROUPS_DELEGATES_PATHS: PathsRecord = Object.keys(GROUPS_DELEGATES_POINTS).reduce(
  (memo, key) => ({
    ...memo,
    [key]: GROUPS_DELEGATES_POINTS[key].map(points => getPath(points))
  }),
  {} as PathsRecord
);

export const STATES_POINTS: PolygonsRecord = Object.keys(GROUPS_DELEGATES_POINTS).reduce((memo, key) => {
  const delegatesPoints: Polygon[] = GROUPS_DELEGATES_POINTS[key];

  const allPoints = delegatesPoints.reduce((memo, delegatePoints) => [...memo, ...delegatePoints], [] as Polygon);

  const uniquePoints = allPoints.reduce((memo, point) => {
    if (memo.find(([x, y]) => point[0] === x && point[1] === y)) {
      return memo;
    }

    return [...memo, point];
  }, [] as Polygon);

  return {
    ...memo,
    [key]: [concaveman(uniquePoints, 0.8, HEX_SIZE) as Polygon]
  };
}, {} as PolygonsRecord);

export const STATES_PATHS: PathsRecord = Object.keys(STATES_POINTS).reduce(
  (memo, key) => ({
    ...memo,
    [key]: STATES_POINTS[key].map(points => getPath(points))
  }),
  {} as PathsRecord
);

export const COUNTRY_POINTS: Polygon = concaveman(
  Object.keys(STATES_POINTS)
    .filter(key => key !== 'AK' && key !== 'HI')
    .reduce((memo, key) => [...memo, ...STATES_POINTS[key][0]], [] as Polygon)
    .reduce((memo, point) => {
      if (memo.find(([x, y]) => point[0] === x && point[1] === y)) {
        return memo;
      }

      return [...memo, point];
    }, [] as Polygon),
  0.8,
  HEX_SIZE
) as Polygon;

export const COUNTRY_PATHS = [getPath(COUNTRY_POINTS)];

export const GROUPS_LABELS: Vector2Record = {
  AK: [30, 599],
  AL: [518, 530],
  AR: [415, 404],
  AZ: [206, 453],
  CA: [111, 363],
  CO: [252, 276],
  CT: [918, 184],
  DC: [829, 376],
  DE: [903, 350],
  FL: [628, 658],
  GA: [600, 517],
  HI: [178, 686],
  IA: [378, 261],
  ID: [237, 171],
  IL: [474, 312],
  IN: [555, 312],
  KS: [304, 325],
  KY: [577, 389],
  LA: [415, 506],
  MA: [947, 135],
  MD: [873, 376],
  ME: [962, 29],
  MI: [592, 188],
  MN: [378, 184],
  MO: [385, 325],
  MS: [459, 522],
  MT: [281, 148],
  NC: [703, 442],
  ND: [326, 158],
  NE: [296, 250],
  NH: [918, 88],
  NJ: [896, 286],
  NM: [252, 453],
  NV: [178, 250],
  NY: [800, 173],
  OH: [637, 312],
  OK: [356, 389],
  OR: [104, 197],
  PA: [755, 261],
  RI: [999, 184],
  SC: [696, 504],
  SD: [326, 209],
  TN: [518, 440],
  TX: [326, 517],
  UT: [207, 276],
  VA: [754, 388],
  VT: [888, 70],
  WA: [118, 158],
  WI: [459, 197],
  WV: [703, 360],
  WY: [281, 197]
};
