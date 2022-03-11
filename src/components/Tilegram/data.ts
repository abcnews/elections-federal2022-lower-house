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

// export const HEX_WIDTH = 40;
// export const HEX_HEIGHT = 30;

export const HEXGRID_CELLS_WIDE = 14;
export const HEXGRID_CELLS_HIGH = 19;

export const HEXGRID_PROPS = {
  width: (HEXGRID_CELLS_WIDE + 0.5) * HEX_WIDTH,
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

const getHexVector2 = ([column, row]: Cell): Vector2 => [
  HEX_WIDTH * (column + 0.5 * (row & 1)),
  ((HEX_HEIGHT * 3) / 4) * row
];

const getHexPolygon = (cell: Cell): Polygon => {
  const [x, y] = getHexVector2(cell);

  return [
    [x, y + (HEX_HEIGHT / 4) * 3].map(Math.round) as Vector2,
    [x + HEX_WIDTH / 2, y + HEX_HEIGHT].map(Math.round) as Vector2,
    [x + HEX_WIDTH, y + (HEX_HEIGHT / 4) * 3].map(Math.round) as Vector2,
    [x + HEX_WIDTH, y + HEX_HEIGHT / 4].map(Math.round) as Vector2,
    [x + HEX_WIDTH / 2, y].map(Math.round) as Vector2,
    [x, y + HEX_HEIGHT / 4].map(Math.round) as Vector2,
    [x, y + (HEX_HEIGHT / 4) * 3].map(Math.round) as Vector2
  ];
};

const getPath = (polygon: Polygon) => `M${polygon.map(point => point.join(',')).join(' ')}`;

const getConcavePolygon = (vector2s: Vector2[]) =>
  concaveman(vector2s, 0.8, Math.min(HEX_WIDTH, HEX_HEIGHT) / 2) as Polygon;

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
    PATE: [13, 6],
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
    LING: [3, 6],
    SOLO: [2, 5]
  },
  QLD: {
    BLAI: [7, 4],
    BONN: [11, 2],
    BOWM: [12, 4],
    BRIS: [10, 3],
    CAPR: [8, 2],
    DAWS: [8, 1],
    DICK: [8, 3],
    FADD: [11, 4],
    FAIR: [10, 1],
    FISH: [10, 2],
    FLYN: [7, 3],
    FORD: [10, 5],
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
    CASE: [10, 13],
    CHIS: [7, 13],
    COOP: [8, 12],
    CORA: [5, 15],
    CORI: [5, 13],
    DEAK: [8, 11],
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
    SWAN: [2, 10],
    TANG: [1, 11]
  }
};

// const ELECTORATES_CELLS = flattenNestedRecords<Cell>(STATES_ELECTORATES_CELLS);

const STATES_ELECTORATES_POLYGONS = transformNestedRecordsValues<Cell, Polygon>(
  STATES_ELECTORATES_CELLS,
  getHexPolygon
);

export const ELECTORATES_POLYGONS = flattenNestedRecords<Polygon>(STATES_ELECTORATES_POLYGONS);

const STATES_ELECTORATES_PATHS = transformNestedRecordsValues<Polygon, Path>(STATES_ELECTORATES_POLYGONS, getPath);

export const ELECTORATES_PATHS = flattenNestedRecords<Path>(STATES_ELECTORATES_PATHS);

export const STATES_POLYGONS = Object.keys(STATES_ELECTORATES_POLYGONS).reduce(
  (memo, stateKey) => ({
    ...memo,
    [stateKey]: getConcavePolygon(
      Object.keys(STATES_ELECTORATES_POLYGONS[stateKey])
        .reduce(
          (memo, electorateKey) => [...memo, ...STATES_ELECTORATES_POLYGONS[stateKey][electorateKey]],
          [] as Vector2[]
        )
        .reduce(uniqueVector2sReducer, [] as Vector2[])
    )
  }),
  {} as Record<string, Polygon>
);

export const STATES_PATHS = transformRecordsValues<Polygon, Path>(STATES_POLYGONS, getPath);

export const COUNTRY_POLYGON = getConcavePolygon(
  Object.keys(STATES_POLYGONS)
    .reduce<Vector2[]>((memo, key) => [...memo, ...STATES_POLYGONS[key]], [])
    .reduce(uniqueVector2sReducer, [])
);

export const COUNTRY_PATH = getPath(COUNTRY_POLYGON);
