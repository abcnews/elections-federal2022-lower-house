import React from 'react';
import { Layout } from '../../lib/constants';
import { remapAllocationsToAlliances } from '../../lib/utils';
import BasicGeoMap from '../Geo';
import type { GeoMapProps } from '../GeoMap';
import GeoMap from '../GeoMap';
import type { TilegramProps } from '../Tilegram';
import Tilegram, { DEFAULT_PROPS as DEFAULT_TILEGRAM_PROPS } from '../Tilegram';
import type { TotalsProps } from '../Totals';
import Totals from '../Totals';
import styles from './styles.scss';

export type GraphicProps = {
  allied?: boolean;
  counting?: boolean;
  willChange?: boolean;
} & GeoMapProps &
  TilegramProps &
  TotalsProps;

export type PossiblyEncodedGraphicProps =
  | {
      allocations: string;
      annotations: string;
      certainties: string;
      focuses: string;
      layout: number | string;
    }
  | GraphicProps;

export const DEFAULT_PROPS: Partial<GraphicProps> = {
  ...DEFAULT_TILEGRAM_PROPS,
  allied: false,
  counting: true
};

const Graphic: React.FC<GraphicProps> = props => {
  const {
    counting,
    allocations,
    annotations,
    certainties,
    focuses,
    allied,
    inset,
    layout,
    onTapElectorate,
    relative,
    willChange
  } = {
    ...DEFAULT_PROPS,
    ...props
  };
  const isCounting = typeof counting !== 'boolean' || counting;
  const potentiallyAlliedAllocations =
    allocations && typeof allied === 'boolean' && allied ? remapAllocationsToAlliances(allocations) : allocations;
  let electoratesGraphic: React.ReactElement;

  switch (layout) {
    case Layout.GEO:
      if (willChange) {
        electoratesGraphic = <BasicGeoMap allocations={potentiallyAlliedAllocations} focuses={focuses} />;
        break;
      }
      electoratesGraphic = (
        <GeoMap
          allocations={potentiallyAlliedAllocations}
          annotations={annotations}
          certainties={certainties}
          focuses={focuses}
          onTapElectorate={onTapElectorate}
        />
      );
      break;
    default:
      electoratesGraphic = (
        <Tilegram
          layout={layout}
          allocations={potentiallyAlliedAllocations}
          annotations={annotations}
          certainties={certainties}
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
      {electoratesGraphic}
    </div>
  );
};

export default Graphic;
