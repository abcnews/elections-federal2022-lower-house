export enum Mode {
  Historic = 'historic',
  Results1P = '1p',
  Results2PP = '2pp'
}

export const MODES: string[] = Object.values(Mode);

export const MODE_LABELS: Record<Mode, string> = {
  [Mode.Historic]: 'Historic',
  [Mode.Results1P]: 'Results (first preference)',
  [Mode.Results2PP]: 'Results (two-party-preferred)'
};

export const DEFAULT_MODE = Mode.Historic;
