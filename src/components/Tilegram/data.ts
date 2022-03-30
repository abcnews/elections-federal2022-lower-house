import concaveman from 'concaveman';
import { Allocation, ElectorateID, Focus, Layout } from '../../lib/constants';
import { flattenNestedRecords, transformNestedRecordsValues } from '../../lib/utils';

export type ElectorateRenderProps = {
  id: ElectorateID;
  name: string;
  elementIDRecord: Record<string, string>;
  allocation: Allocation;
  hasAllocation: boolean;
  hasDefinitiveAllocation: boolean;
  relativeAllocation: Allocation | undefined;
  hasDefinitiveRelativeAllocation: boolean;
  shouldFlip: boolean;
  wasPreserved: boolean;
  focus: Focus;
  polygon: Polygon;
};

export type ElectoratesRenderProps = Record<string, ElectorateRenderProps>;

type Point = [number, number]; // [x, y]
export type PointRecord = Record<string, Point>;

type Cell = [number, number]; // [column, row]
type CellRecord = Record<string, Cell>;
type NestedCellRecord = Record<string, CellRecord>;

export type Polygon = Point[];
export type PolygonRecord = Record<string, Polygon>;
type NestedPolygonRecord = Record<string, PolygonRecord>;

type HexDimensions = {
  width: number;
  height: number;
};

type StatesCells = Record<string, [number, number, boolean?]>;

type LayoutsStatesCells = Record<Layout, StatesCells>;

type LayoutMargin = {
  horizontal: number;
  vertical: number;
};

export type LayoutConfig = {
  hexDimensions: HexDimensions;
  electoratesPolygons: PolygonRecord;
  statesPolygons: PolygonRecord;
  statesLabelsPositions: PointRecord;
};

type LayoutsConfigs = Record<Layout, LayoutConfig>;

export const ELEMENT_NAMES = ['polygon', 'clipPath'];

export const SVG_SIZE = 720;

export const generateElementID = (componentID: string, ...rest: Array<string | number>) =>
  ([componentID] as Array<string | number>).concat(rest).join('_');

export const generateElementIDRecord = (keys: string[], componentID: string, ...rest: Array<string | number>) =>
  keys.reduce(
    (memo, key) => ({
      ...memo,
      [key]: generateElementID(componentID, key, ...rest)
    }),
    {} as Record<string, string>
  );

const addPoints = (a: Point, b: Point): Point => [a[0] + b[0], a[1] + b[1]];

const arePointsEqual = (a: Point, b: Point) => a[0] === b[0] && a[1] === b[1];

const uniquePointsReducer = (memo: Point[], point: Point) => {
  if (memo.find(retainedPoint => arePointsEqual(point, retainedPoint))) {
    return memo;
  }

  return [...memo, point];
};

const getHexPosition = (
  hexDimensions: HexDimensions,
  [column, row]: Cell,
  shouldNegateEvenRowOffset = false
): Point => [
  hexDimensions.width * (column + (shouldNegateEvenRowOffset ? -0.5 : 0.5) * (row & 1)),
  ((hexDimensions.height * 3) / 4) * row
];

const getHexPolygon = (hexDimensions: HexDimensions, cell: Cell, shouldNegateEvenRowOffset = false): Polygon => {
  const { width, height } = hexDimensions;
  const [x, y] = getHexPosition(hexDimensions, cell, shouldNegateEvenRowOffset);

  return [
    [x, y + (height / 4) * 3],
    [x + width / 2, y + height],
    [x + width, y + (height / 4) * 3],
    [x + width, y + height / 4],
    [x + width / 2, y],
    [x, y + height / 4],
    [x, y + (height / 4) * 3]
  ];
};

const getConcavePolygon = (hexDimensions: HexDimensions, points: Point[]) =>
  concaveman(points, 0.8, Math.min(hexDimensions.width, hexDimensions.height) / 2) as Polygon;

const getHexDimensions = (cellsWide: number, canvasWidth: number): HexDimensions => {
  // Calculates pointy-tip hex dimensions, where the canvasWidth needs to
  // contain n+0.5 hexes (because odd rows are offset by 0.5 hexes)
  const width = canvasWidth / (cellsWide + 0.5);
  const sideLength = width / Math.sqrt(3);
  const height = sideLength * 2;

  return {
    width,
    height
  };
};

const getLayoutConfig = (layout: Layout, cellsWide: number, margin: LayoutMargin): LayoutConfig => {
  const offset: Point = [margin.horizontal, margin.vertical];
  const hexDimensions = getHexDimensions(cellsWide, SVG_SIZE - margin.horizontal * 2);

  const statesElectoratesPolygons: NestedPolygonRecord = transformNestedRecordsValues<Cell, Polygon>(
    STATES_ELECTORATES_CELLS,
    (electorateCell, stateKey) => {
      const [offsetX, offsetY, shouldNegateEvenRowOffset] = (LAYOUTS_STATES_CELLS[layout] as StatesCells)[stateKey];

      const hexPolygon = getHexPolygon(
        hexDimensions,
        addPoints(electorateCell, [offsetX, offsetY]),
        !!shouldNegateEvenRowOffset
      );

      return hexPolygon.map(point => addPoints(point, offset));
    }
  );

  const electoratesPolygons: PolygonRecord = flattenNestedRecords<Polygon>(statesElectoratesPolygons);

  const statesPolygons = Object.keys(statesElectoratesPolygons).reduce(
    (memo, stateKey) => ({
      ...memo,
      [stateKey]: getConcavePolygon(
        hexDimensions,
        Object.keys(statesElectoratesPolygons[stateKey])
          .reduce(
            (memo, electorateKey) => [...memo, ...statesElectoratesPolygons[stateKey][electorateKey]],
            [] as Point[]
          )
          .reduce(uniquePointsReducer, [] as Point[])
      )
    }),
    {} as PolygonRecord
  );

  const statesCells = LAYOUTS_STATES_CELLS[layout] as StatesCells;

  const statesLabelsPositions = Object.keys(statesCells).reduce((memo, stateKey) => {
    const [offsetX, offsetY, shouldNegateEvenRowOffset] = statesCells[stateKey];
    const stateLabelCell =
      STATES_LABELS_CELLS[stateKey][
        layout === Layout.COUNTRY
          ? 'COUNTRY'
          : layout === Layout.EXPLODED
          ? 'EXPLODED'
          : layout === Layout.GRID
          ? 'GRID'
          : 'SINGLE'
      ];

    return {
      ...memo,
      [stateKey]: addPoints(
        getHexPosition(hexDimensions, addPoints(stateLabelCell, [offsetX, offsetY]), !!shouldNegateEvenRowOffset),
        offset
      )
    };
  }, {} as PointRecord);

  return {
    hexDimensions,
    electoratesPolygons,
    statesPolygons,
    statesLabelsPositions
  };
};

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
    COWP: [1, 0],
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
    LIND: [2, 0],
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
    RICH: [3, 0],
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

const STATES_LABELS_CELLS: NestedCellRecord = {
  ACT: {
    COUNTRY: [0.5, 1.5],
    EXPLODED: [0.5, 1.5],
    GRID: [0.75, -1],
    SINGLE: [0.75, -1]
  },
  NSW: {
    COUNTRY: [5, 2],
    EXPLODED: [5, 2],
    GRID: [4.5, -1],
    SINGLE: [4.75, -1]
  },
  NT: {
    COUNTRY: [1, 0.5],
    EXPLODED: [1, 0.5],
    GRID: [1.5, -1],
    SINGLE: [1.5, -1]
  },
  QLD: {
    COUNTRY: [4.5, 3.5],
    EXPLODED: [4.5, 3.5],
    GRID: [4, -1],
    SINGLE: [4, -1]
  },
  SA: {
    COUNTRY: [1, 3.5],
    EXPLODED: [1.5, 3.5],
    GRID: [1, -1],
    SINGLE: [1, -1]
  },
  TAS: {
    COUNTRY: [2, 1],
    EXPLODED: [2, 1],
    GRID: [2, -1],
    SINGLE: [2, -1]
  },
  VIC: {
    COUNTRY: [3.5, 3.25],
    EXPLODED: [4, 3.25],
    GRID: [3.5, -1],
    SINGLE: [3.75, -1]
  },
  WA: {
    COUNTRY: [1.5, 5.5],
    EXPLODED: [1, 5.5],
    GRID: [0.75, 1],
    SINGLE: [1.25, 0]
  }
};

const LAYOUT_OFFSCREEN: CellRecord = {
  ACT: [0, 25],
  NSW: [0, 25],
  NT: [0, 25],
  QLD: [0, 25],
  SA: [0, 25],
  TAS: [0, 25],
  VIC: [0, 25],
  WA: [0, 25]
};

const LAYOUTS_STATES_CELLS: Partial<LayoutsStatesCells> = {
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
  [Layout.EXPLODED]: {
    ACT: [12, 11.25, true],
    NSW: [6.75, 6.75],
    NT: [3, 5],
    QLD: [5.75, 0],
    SA: [3, 6.75],
    TAS: [9.26, 18.5, true],
    VIC: [6.75, 11.75, true],
    WA: [0, 5.75]
  },
  // [Layout.EXPLODED]: {
  //   ACT: [11.75, 10.75],
  //   NSW: [6.75, 6.75],
  //   NT: [3, 5],
  //   QLD: [5.75, 0],
  //   SA: [3, 6.75],
  //   TAS: [9.26, 18.5, true],
  //   VIC: [6.75, 11.75, true],
  //   WA: [0, 5.75]
  // },
  [Layout.GRID]: {
    ACT: [10, 19, true],
    NSW: [0, 0],
    NT: [15, 19],
    QLD: [1, 9, true],
    SA: [17, 9, true],
    TAS: [3, 19],
    VIC: [12, 0],
    WA: [11, 7]
  },
  // [Layout.GRID]: {
  //   ACT: [10, 21, true],
  //   NSW: [0, 2],
  //   NT: [15, 21],
  //   QLD: [6, 12],
  //   SA: [17, 11, true],
  //   TAS: [2, 21],
  //   VIC: [12, 2],
  //   WA: [1, 9]
  // },
  [Layout.ACT]: {
    ...LAYOUT_OFFSCREEN,
    ACT: [4.5, 1.5, true]
  },
  [Layout.NSW]: {
    ...LAYOUT_OFFSCREEN,
    NSW: [0, 0]
  },
  [Layout.NT]: {
    ...LAYOUT_OFFSCREEN,
    NT: [3.75, 1.5]
  },
  [Layout.QLD]: {
    ...LAYOUT_OFFSCREEN,
    QLD: [0.75, 0]
  },
  [Layout.SA]: {
    ...LAYOUT_OFFSCREEN,
    SA: [3.75, 0]
  },
  [Layout.TAS]: {
    ...LAYOUT_OFFSCREEN,
    TAS: [3.25, 1.5]
  },
  [Layout.VIC]: {
    ...LAYOUT_OFFSCREEN,
    VIC: [1, 0]
  },
  [Layout.WA]: {
    ...LAYOUT_OFFSCREEN,
    WA: [3.5, -1]
  }
};

const STATE_LAYOUT_CONFIG_ARGS: [number, LayoutMargin] = [
  10,
  {
    horizontal: 2,
    vertical: 102
  }
];

export const LAYOUTS_CONFIGS: Partial<LayoutsConfigs> = {
  [Layout.COUNTRY]: getLayoutConfig(Layout.COUNTRY, 14, {
    horizontal: 47,
    vertical: 2
  }),
  [Layout.EXPLODED]: getLayoutConfig(Layout.EXPLODED, 16.75, {
    horizontal: 20,
    vertical: 2
  }),
  [Layout.GRID]: getLayoutConfig(Layout.GRID, 20, {
    horizontal: 2,
    vertical: 72
  }),
  [Layout.ACT]: getLayoutConfig(Layout.ACT, ...STATE_LAYOUT_CONFIG_ARGS),
  [Layout.NSW]: getLayoutConfig(Layout.NSW, ...STATE_LAYOUT_CONFIG_ARGS),
  [Layout.NT]: getLayoutConfig(Layout.NT, ...STATE_LAYOUT_CONFIG_ARGS),
  [Layout.QLD]: getLayoutConfig(Layout.QLD, ...STATE_LAYOUT_CONFIG_ARGS),
  [Layout.SA]: getLayoutConfig(Layout.SA, ...STATE_LAYOUT_CONFIG_ARGS),
  [Layout.TAS]: getLayoutConfig(Layout.TAS, ...STATE_LAYOUT_CONFIG_ARGS),
  [Layout.VIC]: getLayoutConfig(Layout.VIC, ...STATE_LAYOUT_CONFIG_ARGS),
  [Layout.WA]: getLayoutConfig(Layout.WA, ...STATE_LAYOUT_CONFIG_ARGS)
};
