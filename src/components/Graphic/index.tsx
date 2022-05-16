import React from 'react';
import { Layout } from '../../lib/constants';
import BasicGeoMap from '../Geo';
import type { GeoMapProps } from '../GeoMap';
import GeoMap from '../GeoMap';
import type { TilegramProps } from '../Tilegram';
import Tilegram, { DEFAULT_PROPS as DEFAULT_TILEGRAM_PROPS } from '../Tilegram';
import type { TotalsProps } from '../Totals';
import Totals from '../Totals';
import styles from './styles.scss';

export type GraphicProps = {
  counting?: boolean;
  willChange?: boolean;
} & GeoMapProps &
  TilegramProps &
  TotalsProps;

export type PossiblyEncodedGraphicProps =
  | {
      allocations: string;
      annotations: string;
      focuses: string;
      layout: number | string;
    }
  | GraphicProps;

export const DEFAULT_PROPS: Partial<GraphicProps> = {
  ...DEFAULT_TILEGRAM_PROPS,
  counting: true
};

const Graphic: React.FC<GraphicProps> = props => {
  const { counting, allocations, annotations, focuses, inset, layout, onTapElectorate, relative, willChange } = {
    ...DEFAULT_PROPS,
    ...props
  };
  const isCounting = typeof counting !== 'boolean' || counting;
  let map: React.ReactElement;

  switch (layout) {
    case Layout.GEO:
      if (willChange) {
        map = <BasicGeoMap allocations={allocations} focuses={focuses} />;
        break;
      }
      map = (
        <GeoMap
          allocations={allocations}
          annotations={annotations}
          focuses={focuses}
          onTapElectorate={onTapElectorate}
        />
      );
      break;
    default:
      map = (
        <Tilegram
          layout={layout}
          allocations={allocations}
          annotations={annotations}
          focuses={focuses}
          inset={inset}
          relative={relative}
          onTapElectorate={onTapElectorate}
        />
      );
      break;
  }

  return (
    <div className={styles.root}>
      {(willChange || isCounting) && (
        <header className={styles.header} data-is-counting={isCounting ? '' : undefined}>
          <Totals allocations={allocations} />
        </header>
      )}
      {map}
    </div>
  );
};

export default Graphic;
