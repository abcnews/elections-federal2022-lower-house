import React, { ReactChild } from 'react';
import { DEFAULT_ELECTION_YEAR, Layout } from '../../lib/constants';
import Geo from '../Geo';
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
      layout: number | string;
    }
  | GraphicProps;

export const DEFAULT_PROPS: Partial<GraphicProps> = {
  ...DEFAULT_TILEGRAM_PROPS,
  year: DEFAULT_ELECTION_YEAR,
  relative: null,
  counting: true
};

const Graphic: React.FC<GraphicProps> = props => {
  const { children, title, counting, year, allocations, focuses, layout, layer, ...otherTilegramProps } = {
    ...DEFAULT_PROPS,
    ...props
  };
  const isCounting = typeof counting !== 'boolean' || counting;
  let map: React.ReactElement;

  switch (layout) {
    case Layout.GEO:
      map = <Geo allocations={allocations} focuses={focuses} layer={layer} />;
      break;
    default:
      map = (
        <Tilegram
          allocations={allocations}
          focuses={focuses}
          year={year}
          layout={layout}
          layer={layer}
          {...otherTilegramProps}
        />
      );
      break;
  }

  return (
    <div className={styles.root} title={title}>
      <header className={styles.header} data-is-counting={isCounting ? '' : undefined}>
        <Totals allocations={allocations} year={year} />
      </header>
      {map}
    </div>
  );
};

export default Graphic;
