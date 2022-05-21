export enum Mode {
  Historic = 'historic',
  ResultsPrimary = 'primary',
  Results2CP = '2cp'
}

export const MODES: string[] = Object.values(Mode);

export const MODE_LABELS: Record<Mode, string> = {
  [Mode.Historic]: 'Historic',
  [Mode.ResultsPrimary]: 'Results (primary)',
  [Mode.Results2CP]: 'Results (two-candidate-preferred)'
};

export const DEFAULT_MODE = Mode.Historic;
