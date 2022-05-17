import { Allocation } from './constants';

// Note: Keep these in sync with SASS colours in './constants.scss' &  './theme.scss'

enum Color {
  Black = '#fff',
  Grey = '#989494',
  LightGrey = '#ddd',
  White = '#000',
  PtyBlack = '#757575',
  PtyBlue = '#1467cc',
  PtyBrown = '#804a40',
  PtyGold = '#ffc200',
  PtyGreen = '#007056',
  PtyLightGreen = '#51a802',
  PtyOrange = '#e5660b',
  PtyRed = '#d61515'
}

export const ALLOCATIONS_COLORS: Record<Allocation, Color> = {
  [Allocation.None]: Color.White,
  [Allocation.Any]: Color.Black,
  [Allocation.ALP]: Color.PtyRed,
  [Allocation.CA]: Color.PtyOrange,
  [Allocation.CLP]: Color.PtyBlue,
  [Allocation.GRN]: Color.PtyLightGreen,
  [Allocation.IND]: Color.Black,
  [Allocation.KAP]: Color.PtyBrown,
  [Allocation.LIB]: Color.PtyBlue,
  [Allocation.LNP]: Color.PtyBlue,
  [Allocation.NAT]: Color.PtyGreen,
  [Allocation.ONP]: Color.PtyOrange,
  [Allocation.OTH]: Color.Black,
  [Allocation.UAP]: Color.PtyGold
};
