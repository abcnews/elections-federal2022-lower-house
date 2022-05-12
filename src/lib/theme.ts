import { Allocation } from './constants';

// Note: Keep these in sync with SASS colours in './constants.scss'

enum PartyColor {
  None = '#fff',
  Black = '#757575',
  Blue = '#1467cc',
  Brown = '#804a40',
  Gold = '#ffc200',
  Green = '#007056',
  LightGreen = '#51a802',
  Orange = '#e5660b',
  Red = '#d61515'
}

export const ALLOCATIONS_COLORS: Record<Allocation, PartyColor> = {
  [Allocation.None]: PartyColor.None,
  [Allocation.ALP]: PartyColor.Red,
  [Allocation.CA]: PartyColor.Orange,
  [Allocation.CLP]: PartyColor.Blue,
  [Allocation.GRN]: PartyColor.LightGreen,
  [Allocation.IND]: PartyColor.Black,
  [Allocation.KAP]: PartyColor.Brown,
  [Allocation.LIB]: PartyColor.Blue,
  [Allocation.LNP]: PartyColor.Blue,
  [Allocation.NAT]: PartyColor.Green,
  [Allocation.ONP]: PartyColor.Orange,
  [Allocation.OTH]: PartyColor.Black,
  [Allocation.UAP]: PartyColor.Gold,
  // For previous winners (map to party with same colors),
  [Allocation.NXT]: PartyColor.Orange,
  [Allocation.PUP]: PartyColor.Gold
};
