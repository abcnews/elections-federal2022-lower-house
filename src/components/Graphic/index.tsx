import React from 'react';
import { Layout } from '../../lib/constants';
// import Geo from '../Geo';
import GeoMap from '../GeoMap';
import type { TilegramProps } from '../Tilegram';
import Tilegram, { DEFAULT_PROPS as DEFAULT_TILEGRAM_PROPS } from '../Tilegram';
import type { TotalsProps } from '../Totals';
import Totals from '../Totals';
import styles from './styles.scss';

export type GraphicProps = {
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
  counting: true
};

const Graphic: React.FC<GraphicProps> = props => {
  const { children, counting, allocations, focuses, layout, layer, ...otherTilegramProps } = {
    ...DEFAULT_PROPS,
    ...props
  };
  const isCounting = typeof counting !== 'boolean' || counting;
  let map: React.ReactElement;

  switch (layout) {
    case Layout.GEO:
      // map = <Geo allocations={allocations} focuses={focuses} layer={layer} />;
      map = <GeoMap allocations={allocations} focuses={focuses} />;
      break;
    default:
      map = (
        <Tilegram allocations={allocations} focuses={focuses} layout={layout} layer={layer} {...otherTilegramProps} />
      );
      break;
  }

  return (
    <div className={styles.root}>
      <header className={styles.header} data-is-counting={isCounting ? '' : undefined}>
        <Totals allocations={allocations} />
      </header>
      {map}
    </div>
  );
};

export default Graphic;
