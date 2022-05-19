import { Allocation } from './constants';

// Note: Keep these in sync with SASS colours in './constants.scss' &  './theme.scss'

enum Color {
  Black = '#000',
  Grey = '#989494',
  LightGrey = '#ddd',
  White = '#fff',
  PtyAqua = '#005d82',
  PtyBlack = '#757575',
  PtyBlue = '#0a52bf',
  PtyBrown = '#804a40',
  PtyGold = '#cc8500',
  PtyGreen = '#007056',
  PtyLightBlue = '#00a1c7',
  PtyLightGreen = '#51a802',
  PtyOrange = '#e5660b',
  PtyPurple = '#985eb5',
  PtyRed = '#e11f30'
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
