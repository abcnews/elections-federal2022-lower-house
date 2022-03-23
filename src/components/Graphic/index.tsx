import React from 'react';
import { DEFAULT_ELECTION_YEAR } from '../../lib/constants';
import type { TilegramProps } from '../Tilegram';
import Tilegram, { DEFAULT_PROPS as DEFAULT_TILEGRAM_PROPS } from '../Tilegram';
import type { TotalsProps } from '../Totals';
import Totals from '../Totals';
import styles from './styles.scss';

export type GraphicProps = {
  title?: string;
  counting?: boolean;
} & TilegramProps &
  TotalsProps;

export type PossiblyEncodedGraphicProps =
  | {
      allocations: string;
      focuses: string;
    }
  | GraphicProps;

export const DEFAULT_PROPS: Partial<GraphicProps> = {
  ...DEFAULT_TILEGRAM_PROPS,
  year: DEFAULT_ELECTION_YEAR,
  relative: null,
  counting: true
};

const Graphic: React.FC<GraphicProps> = props => {
  const { title, counting, year, allocations, children, ...otherTilegramProps } = {
    ...DEFAULT_PROPS,
    ...props
  };
  const isCounting = typeof counting !== 'boolean' || counting;

  return (
    <div className={styles.root} title={title}>
      <header className={styles.header} data-is-counting={isCounting ? '' : undefined}>
        <Totals allocations={allocations} year={year} />
      </header>
      <Tilegram allocations={allocations} year={year} {...otherTilegramProps} />
    </div>
  );
};

export default Graphic;
