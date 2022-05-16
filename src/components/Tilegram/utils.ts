import concaveman from 'concaveman';
import { Layout, MULTI_STATE_LAYOUTS } from '../../lib/constants';
import { flattenNestedRecords, transformNestedRecordsValues } from '../../lib/utils';
import { LAYOUTS_STATES_CELLS, STATES_ELECTORATES_CELLS, STATES_LABELS_CELLS, SVG_SIZE } from './constants';
import type {
  Cell,
  Hex,
  LayoutConfig,
  MarginHorizontalVertical,
  NestedPointRecord,
  NestedPolygonRecord,
  NumberCouple,
  Point,
  PointRecord,
  Polygon,
  PolygonRecord,
  StatesCells
} from './types';

const addNumberCouples = (...numberCouples: NumberCouple[]): NumberCouple =>
  numberCouples.reduce((a, b) => [a[0] + b[0], a[1] + b[1]]);

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
  return hex.polygon.map(point => addNumberCouples(point, getHexPosition(hex, cell, shouldNegateEvenRowOffset)));
};

const getConcavePolygon = (hex: Hex, points: Point[]) =>
  concaveman(points, 0.8, Math.min(hex.width, hex.height) / 2) as Polygon;

export const getHex = (cellsWide: number, canvasWidth: number): Hex => {
  // Calculates pointy-tip hex dimensions, where the canvasWidth needs to
  // contain n+0.5 hexes (because odd rows are offset by 0.5 hexes).
  // The polygon points are arranged around the center.
  const width = canvasWidth / (cellsWide + 0.5);
  const sideLength = width / Math.sqrt(3);
  const height = sideLength * 2;
  const polygon: Polygon = [
    [width / -2, height / 4],
    [width / -2, height / -4],
    [0, height / -2],
    [width / 2, height / -4],
    [width / 2, height / 4],
    [0, height / 2],
    [width / -2, height / 4]
  ];

  return {
    width,
    height,
    polygon
  };
};

export const getLayoutConfig = (layout: Layout, cellsWide: number, margin: MarginHorizontalVertical): LayoutConfig => {
  const hex = getHex(cellsWide, SVG_SIZE - margin[0] * 2);

  const statesElectoratesPositions: NestedPointRecord = transformNestedRecordsValues<Cell, Point>(
    STATES_ELECTORATES_CELLS,
    (electorateCell, stateKey) => {
      const [offsetX, offsetY, shouldNegateEvenRowOffset = false] = (LAYOUTS_STATES_CELLS[layout] as StatesCells)[
        stateKey
      ];

      const hexPosition = getHexPosition(
        hex,
        addNumberCouples(electorateCell, [offsetX, offsetY]),
        shouldNegateEvenRowOffset
      );

      return addNumberCouples(hexPosition, [hex.width / 2, hex.height / 2], margin);
    }
  );

  const electoratesPositions: PointRecord = flattenNestedRecords<Point>(statesElectoratesPositions);

  const statesElectoratesPolygons: NestedPolygonRecord = transformNestedRecordsValues<Cell, Polygon>(
    STATES_ELECTORATES_CELLS,
    (electorateCell, stateKey) => {
      const [offsetX, offsetY, shouldNegateEvenRowOffset = false] = (LAYOUTS_STATES_CELLS[layout] as StatesCells)[
        stateKey
      ];

      return getHexPolygon(
        hex,
        addNumberCouples(electorateCell, [offsetX, offsetY]),
        shouldNegateEvenRowOffset
      ).map(point => addNumberCouples(point, [hex.width / 2, hex.height / 2], margin));
    }
  );

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
          : layout === Layout.GRID
          ? 'GRID'
          : layout === Layout.EXPLODED
          ? 'EXPLODED'
          : MULTI_STATE_LAYOUTS.indexOf(layout) > -1
          ? 'SINGLE'
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
    electoratesPositions,
    statesPolygons,
    statesLabelsPositions
  };
};

export const generateComponentID = () => (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 8);

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
