import concaveman from 'concaveman';
import { Layout } from '../../lib/constants';
import { flattenNestedRecords, transformNestedRecordsValues } from '../../lib/utils';
import { LAYOUTS_STATES_CELLS, STATES_ELECTORATES_CELLS, STATES_LABELS_CELLS, SVG_SIZE } from './constants';
import type {
  Cell,
  Hex,
  LayoutConfig,
  MarginHorizontalVertical,
  NestedPolygonRecord,
  NumberCouple,
  Point,
  PointRecord,
  Polygon,
  PolygonRecord,
  StatesCells
} from './types';

const addNumberCouples = (a: NumberCouple, b: NumberCouple): NumberCouple => [a[0] + b[0], a[1] + b[1]];

const areNumberCouplesEqual = (a: NumberCouple, b: NumberCouple) => a[0] === b[0] && a[1] === b[1];

const uniquePointsReducer = (memo: Point[], point: Point) => {
  if (memo.find(retainedPoint => areNumberCouplesEqual(point, retainedPoint))) {
    return memo;
  }

  return [...memo, point];
};

const getHexPosition = (hex: Hex, [column, row]: Cell, shouldNegateEvenRowOffset = false): Point => [
  hex.width * (column + (shouldNegateEvenRowOffset ? -0.5 : 0.5) * (row & 1)),
  ((hex.height * 3) / 4) * row
];

const getHexPolygon = (hex: Hex, cell: Cell, shouldNegateEvenRowOffset = false): Polygon => {
  const { width, height } = hex;
  const [x, y] = getHexPosition(hex, cell, shouldNegateEvenRowOffset);

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

const getConcavePolygon = (hex: Hex, points: Point[]) =>
  concaveman(points, 0.8, Math.min(hex.width, hex.height) / 2) as Polygon;

const getHex = (cellsWide: number, canvasWidth: number): Hex => {
  // Calculates pointy-tip hex dimensions, where the canvasWidth needs to
  // contain n+0.5 hexes (because odd rows are offset by 0.5 hexes)
  const width = canvasWidth / (cellsWide + 0.5);
  const sideLength = width / Math.sqrt(3);
  const height = sideLength * 2;
  const polygon: Polygon = [
    [0, (height / 4) * 3],
    [width / 2, height],
    [width, (height / 4) * 3],
    [width, height / 4],
    [width / 2, 0],
    [0, height / 4],
    [0, (height / 4) * 3]
  ];

  return {
    width,
    height,
    polygon
  };
};

export const getLayoutConfig = (layout: Layout, cellsWide: number, margin: MarginHorizontalVertical): LayoutConfig => {
  const hex = getHex(cellsWide, SVG_SIZE - margin[0] * 2);

  const statesElectoratesPolygons: NestedPolygonRecord = transformNestedRecordsValues<Cell, Polygon>(
    STATES_ELECTORATES_CELLS,
    (electorateCell, stateKey) => {
      const [offsetX, offsetY, shouldNegateEvenRowOffset] = (LAYOUTS_STATES_CELLS[layout] as StatesCells)[stateKey];

      const hexPolygon = getHexPolygon(
        hex,
        addNumberCouples(electorateCell, [offsetX, offsetY]),
        !!shouldNegateEvenRowOffset
      );

      return hexPolygon.map(point => addNumberCouples(point, margin));
    }
  );

  const electoratesPolygons: PolygonRecord = flattenNestedRecords<Polygon>(statesElectoratesPolygons);

  const statesPolygons = Object.keys(statesElectoratesPolygons).reduce(
    (memo, stateKey) => ({
      ...memo,
      [stateKey]: getConcavePolygon(
        hex,
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
      [stateKey]: addNumberCouples(
        getHexPosition(hex, addNumberCouples(stateLabelCell, [offsetX, offsetY]), !!shouldNegateEvenRowOffset),
        margin
      )
    };
  }, {} as PointRecord);

  return {
    hex,
    electoratesPolygons,
    statesPolygons,
    statesLabelsPositions
  };
};

const generateElementID = (componentID: string, ...rest: Array<string | number>) =>
  ([componentID] as Array<string | number>).concat(rest).join('_');

export const generateElementIDRecord = (keys: string[], componentID: string, ...rest: Array<string | number>) =>
  keys.reduce(
    (memo, key) => ({
      ...memo,
      [key]: generateElementID(componentID, key, ...rest)
    }),
    {} as Record<string, string>
  );
