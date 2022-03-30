import type { Allocation, ElectorateID, Focus, Layout } from '../../lib/constants';

export type NumberCouple = [number, number];

export type MarginHorizontalVertical = NumberCouple; // [horizontal, vertical]

export type Point = NumberCouple; // [x, y]
export type PointRecord = Record<string, Point>;

export type Polygon = Point[];
export type PolygonRecord = Record<string, Polygon>;
export type NestedPolygonRecord = Record<string, PolygonRecord>;

export type Hex = {
  width: number;
  height: number;
  polygon: Polygon;
};

export type Cell = NumberCouple; // [column, row]
export type CellRecord = Record<string, Cell>;
export type NestedCellRecord = Record<string, CellRecord>;

export type StatesCells = Record<string, [number, number, boolean?]>;

export type LayoutsStatesCells = Record<Layout, StatesCells>;

export type LayoutConfig = {
  hex: Hex;
  electoratesPolygons: PolygonRecord;
  statesPolygons: PolygonRecord;
  statesLabelsPositions: PointRecord;
};

export type LayoutsConfigs = Record<Layout, LayoutConfig>;

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