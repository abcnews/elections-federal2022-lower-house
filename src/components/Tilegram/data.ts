import concaveman from 'concaveman';
import { Layout } from '../../constants';

type Vector2 = [number, number]; // [x, y]

type Cell = [number, number]; // [column, row]
type CellRecord = Record<string, Cell>;
type NestedCellRecord = Record<string, CellRecord>;

type Polygon = Vector2[];
type PolygonRecord = Record<string, Polygon>;
type NestedPolygonRecord = Record<string, PolygonRecord>;

type Path = string;
type PathRecord = Record<string, Path>;
type NestedPathRecord = Record<string, PathRecord>;

export const HEX_SIDE_LENGTH = 17;
export const HEX_WIDTH = Math.sqrt(3) * HEX_SIDE_LENGTH;
export const HEX_HEIGHT = 2 * HEX_SIDE_LENGTH;

const flattenNestedRecords = <T>(record: Record<string, Record<string, T>>) =>
  Object.keys(record).reduce((memo, key) => ({ ...memo, ...record[key] }), {} as Record<string, T>);

const transformRecordsValues = <F, T>(record: Record<string, F>, transformFn: (from: F, key: string) => T) =>
  Object.keys(record).reduce(
    (memo, key) => ({
      ...memo,
      [key]: transformFn(record[key], key)
    }),
    {} as Record<string, T>
  );

const transformNestedRecordsValues = <F, T>(
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

const addVector2s = (a: Vector2, b: Vector2): Vector2 => [a[0] + b[0], a[1] + b[1]];

const areVector2sEqual = (a: Vector2, b: Vector2) => a[0] === b[0] && a[1] === b[1];

const uniqueVector2sReducer = (memo: Vector2[], vector2: Vector2) => {
  if (memo.find(retainedVector2 => areVector2sEqual(vector2, retainedVector2))) {
    return memo;
  }

  return [...memo, vector2];
};

const getHexVector2 = ([column, row]: Cell, shouldNegateEvenRowOffset = false): Vector2 => [
  HEX_WIDTH * (column + (shouldNegateEvenRowOffset ? -0.5 : 0.5) * (row & 1)),
  ((HEX_HEIGHT * 3) / 4) * row
];

const snappedVector2 = (x: number, y: number): Vector2 => [Math.round(x), Math.round(y)];

const getHexPolygon = (cell: Cell, shouldNegateEvenRowOffset = false): Polygon => {
  const [x, y] = getHexVector2(cell, shouldNegateEvenRowOffset);
  const polygon: Polygon = [
    [x, y + (HEX_HEIGHT / 4) * 3],
    [x + HEX_WIDTH / 2, y + HEX_HEIGHT],
    [x + HEX_WIDTH, y + (HEX_HEIGHT / 4) * 3],
    [x + HEX_WIDTH, y + HEX_HEIGHT / 4],
    [x + HEX_WIDTH / 2, y],
    [x, y + HEX_HEIGHT / 4],
    [x, y + (HEX_HEIGHT / 4) * 3]
  ];

  // return polygon.map(vector2 => snappedVector2(...vector2));
  return polygon;
};

const getPath = (polygon: Polygon): Path => `M${polygon.map(vector2 => vector2.join(',')).join(' ')}`;

const getConcavePolygon = (vector2s: Vector2[]) =>
  concaveman(vector2s, 0.8, Math.min(HEX_WIDTH, HEX_HEIGHT) / 2) as Polygon;

const STATES_ELECTORATES_CELLS: NestedCellRecord = {
  ACT: {
    BEAN: [0, 1],
    CANB: [1, 1],
    FENN: [0, 0]
  },
  NSW: {
    BANK: [7, 4],
    BART: [7, 5],
    BENN: [6, 1],
    BERO: [4, 1],
    BLAX: [7, 3],
    BRFD: [8, 1],
    CALA: [0, 1],
    CHIF: [5, 2],
    COOK: [5, 3],
    COWP: [2, 0],
    CUNN: [3, 3],
    DOBE: [6, 0],
    EMON: [1, 3],
    FARR: [0, 3],
    FOWL: [6, 2],
    GILM: [2, 3],
    GRAY: [8, 3],
    GREE: [7, 2],
    HUGH: [6, 4],
    HUME: [2, 2],
    HUNT: [8, 0],
    KSMI: [8, 6],
    LIND: [3, 0],
    LYNE: [2, 1],
    MACA: [4, 2],
    MACK: [5, 1],
    MACQ: [4, 0],
    MCMA: [3, 1],
    MITC: [7, 1],
    NENG: [1, 2],
    NEWC: [9, 1],
    NSYD: [9, 3],
    PAGE: [1, 1],
    PARK: [0, 0],
    PARR: [6, 3],
    PATE: [9, 0],
    REID: [8, 2],
    RICH: [1, 0],
    RIVE: [0, 2],
    ROBE: [5, 0],
    SHOR: [7, 0],
    SYDN: [9, 4],
    WARR: [9, 2],
    WATS: [8, 4],
    WENT: [8, 5],
    WERR: [4, 3],
    WHIT: [3, 2]
  },
  NT: {
    LING: [1, 0],
    SOLO: [0, 0]
  },
  QLD: {
    BLAI: [2, 4],
    BONN: [6, 2],
    BOWM: [7, 4],
    BRIS: [5, 3],
    CAPR: [3, 2],
    DAWS: [3, 1],
    DICK: [3, 3],
    FADD: [6, 4],
    FAIR: [5, 1],
    FISH: [5, 2],
    FLYN: [2, 3],
    FORD: [5, 5],
    GRIF: [5, 4],
    GROO: [1, 5],
    HERB: [4, 1],
    HINK: [1, 3],
    KENN: [1, 4],
    LEIC: [4, 0],
    LILL: [6, 3],
    LONG: [4, 2],
    MARA: [0, 5],
    MCPH: [7, 5],
    MONC: [6, 5],
    MORE: [3, 4],
    OXLE: [4, 5],
    PETR: [4, 3],
    RANK: [4, 4],
    RYAN: [3, 5],
    WBAY: [5, 0],
    WRIG: [2, 5]
  },
  SA: {
    ADEL: [1, 3],
    BARK: [0, 1],
    BOOT: [1, 4],
    GREY: [1, 0],
    HIND: [1, 2],
    KING: [1, 5],
    MAKI: [0, 3],
    MAYO: [1, 6],
    SPEN: [1, 1],
    STUR: [0, 5]
  },
  TAS: {
    BASS: [2, 0],
    BRAD: [0, 0],
    CLAR: [2, 1],
    FRAN: [1, 1],
    LYON: [1, 0]
  },
  VIC: {
    ASTO: [5, 2],
    BALL: [1, 4],
    BEND: [0, 1],
    BRUC: [5, 3],
    CALW: [2, 0],
    CASE: [6, 3],
    CHIS: [3, 3],
    COOP: [4, 2],
    CORA: [1, 5],
    CORI: [1, 3],
    DEAK: [4, 1],
    DUNK: [5, 5],
    FLIN: [6, 5],
    FRAS: [2, 2],
    GELL: [2, 5],
    GIPP: [7, 2],
    GOLD: [4, 5],
    GORT: [1, 1],
    HAWK: [0, 2],
    HIGG: [4, 4],
    HOLT: [6, 4],
    HOTH: [4, 3],
    INDI: [4, 0],
    ISAA: [5, 4],
    JAGA: [2, 1],
    KOOY: [2, 3],
    LTRO: [7, 4],
    LALO: [1, 2],
    MACN: [3, 5],
    MALL: [0, 0],
    MARI: [2, 4],
    MCEW: [6, 2],
    MELB: [3, 4],
    MENZ: [3, 1],
    MONA: [7, 3],
    NICH: [1, 0],
    SCUL: [3, 0],
    WANN: [0, 3],
    WILL: [3, 2]
  },
  WA: {
    BRAN: [0, 6],
    BURT: [2, 7],
    CANN: [1, 7],
    COWA: [1, 4],
    CURT: [0, 4],
    DURA: [2, 1],
    FORR: [0, 8],
    FREM: [0, 5],
    HASL: [2, 3],
    MOOR: [1, 3],
    OCON: [1, 8],
    PEAR: [1, 2],
    PERT: [1, 5],
    SWAN: [2, 5],
    TANG: [1, 6]
  }
};

type LayoutsStatesCells = Record<Layout, Record<string, [number, number, boolean?]>>;

const LAYOUT_OFFSCREEN: CellRecord = {
  ACT: [100, 100],
  NSW: [100, 100],
  NT: [100, 100],
  QLD: [100, 100],
  SA: [100, 100],
  TAS: [100, 100],
  VIC: [100, 100],
  WA: [100, 100]
};

const LAYOUTS_STATES_CELLS: LayoutsStatesCells = {
  [Layout.COUNTRY]: {
    ACT: [9, 10],
    NSW: [4, 6],
    NT: [2, 5],
    QLD: [5, 0],
    SA: [2, 6],
    TAS: [7, 16.75, true],
    VIC: [4, 10],
    WA: [0, 5]
  },
  // [Layout.EXPLODED]: {
  //   ACT: [12, 11.25, true],
  //   NSW: [6.75, 6.75],
  //   NT: [3, 5],
  //   QLD: [5.75, 0],
  //   SA: [3, 6.75],
  //   TAS: [9.26, 18.5, true],
  //   VIC: [6.75, 11.75, true],
  //   WA: [0, 5.75]
  // },
  [Layout.EXPLODED]: {
    ACT: [11.75, 10.75],
    NSW: [6.75, 6.75],
    NT: [3, 5],
    QLD: [5.75, 0],
    SA: [3, 6.75],
    TAS: [9.26, 18.5, true],
    VIC: [6.75, 11.75, true],
    WA: [0, 5.75]
  },
  // [Layout.GRID]: {
  //   ACT: [10, 21, true],
  //   NSW: [0, 2],
  //   NT: [15, 21],
  //   QLD: [0, 12],
  //   SA: [17, 11, true],
  //   TAS: [2, 21],
  //   VIC: [12, 2],
  //   WA: [11, 10, true]
  // }
  [Layout.GRID]: {
    ACT: [10, 21, true],
    NSW: [0, 2],
    NT: [15, 21],
    QLD: [6, 12],
    SA: [17, 11, true],
    TAS: [2, 21],
    VIC: [12, 2],
    WA: [1, 9]
  },
  [Layout.ACT]: {
    ...LAYOUT_OFFSCREEN,
    ACT: [4.5, 3.5, true]
  },
  [Layout.NSW]: {
    ...LAYOUT_OFFSCREEN,
    NSW: [0, 2]
  },
  [Layout.NT]: {
    ...LAYOUT_OFFSCREEN,
    NT: [4.24, 4]
  },
  [Layout.QLD]: {
    ...LAYOUT_OFFSCREEN,
    QLD: [0.75, 2]
  },
  [Layout.SA]: {
    ...LAYOUT_OFFSCREEN,
    SA: [3.75, 2]
  },
  [Layout.TAS]: {
    ...LAYOUT_OFFSCREEN,
    TAS: [3.25, 3.5]
  },
  [Layout.VIC]: {
    ...LAYOUT_OFFSCREEN,
    VIC: [1, 2]
  },
  [Layout.WA]: {
    ...LAYOUT_OFFSCREEN,
    WA: [3.5, 1]
  }
};

const ACTIVE_LAYOUT = Layout.COUNTRY;

// const ELECTORATES_CELLS: CellRecord = flattenNestedRecords<Cell>(STATES_ELECTORATES_CELLS);

// export const [HEXGRID_CELLS_WIDE, HEXGRID_CELLS_HIGH] = Object.values(ELECTORATES_CELLS).reduce(
//   ([cellsWide, cellsHigh], [column, row]) => [Math.max(cellsWide, column + 1), Math.max(cellsHigh, row + 1)],
//   [0, 0]
// );

export const [HEXGRID_CELLS_WIDE, HEXGRID_CELLS_HIGH] = [14, 18.667]; // COUNTRY
// export const [HEXGRID_CELLS_WIDE, HEXGRID_CELLS_HIGH] = [16.75, 20.5]; // EXPLODED
// export const [HEXGRID_CELLS_WIDE, HEXGRID_CELLS_HIGH] = [20, 23]; // GRID
// export const [HEXGRID_CELLS_WIDE, HEXGRID_CELLS_HIGH] = [10, 12]; // <STATE>

const HEXGRID_MARGIN = {
  horizontal: 2,
  vertical: 2
};

export const HEXGRID_PROPS = {
  width: (HEXGRID_CELLS_WIDE + 0.5) * HEX_WIDTH,
  height: (HEXGRID_CELLS_HIGH + 0.33) * ((HEX_HEIGHT / 4) * 3),
  margin: HEXGRID_MARGIN
};

const STATES_ELECTORATES_POLYGONS: NestedPolygonRecord = transformNestedRecordsValues<Cell, Polygon>(
  STATES_ELECTORATES_CELLS,
  (electorateCell, stateKey) => {
    const [offsetX, offsetY, shouldNegateEvenRowOffset] = LAYOUTS_STATES_CELLS[ACTIVE_LAYOUT][stateKey];

    return getHexPolygon(addVector2s(electorateCell, [offsetX, offsetY]), !!shouldNegateEvenRowOffset);
  }
);

export const ELECTORATES_POLYGONS: PolygonRecord = flattenNestedRecords<Polygon>(STATES_ELECTORATES_POLYGONS);

const STATES_ELECTORATES_PATHS: NestedPathRecord = transformNestedRecordsValues<Polygon, Path>(
  STATES_ELECTORATES_POLYGONS,
  getPath
);

export const ELECTORATES_PATHS: PathRecord = flattenNestedRecords<Path>(STATES_ELECTORATES_PATHS);

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
  {} as PolygonRecord
);

export const STATES_PATHS: PathRecord = transformRecordsValues<Polygon, Path>(STATES_POLYGONS, getPath);
