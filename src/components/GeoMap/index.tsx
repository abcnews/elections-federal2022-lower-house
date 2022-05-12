/// <reference types="maplibre-gl" />

declare var maplibregl: typeof import('maplibre-gl');

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Allocation, Allocations, ElectorateID, ELECTORATES, Focus, Focuses } from '../../lib/constants';
import { ALLOCATIONS_COLORS } from '../../lib/theme';
import { determineIfAllocationIsDefinitive, determineIfAllocationIsMade } from '../../lib/utils';
import type { ElectorateGeoProperties, ElectorateRenderProps } from './constants';
import { CAPITALS_COORDINATES, ELECTORATES_GEO_PROPERTIES } from './constants';
import styles from './styles.scss';
import { ensureMaplibre } from './utils';

const AUSTRALA_BOUNDS: maplibregl.LngLatBoundsLike = [
  [112, -44],
  [156, -10]
];

const FIT_BOUNDS_OPTIONS = {
  padding: { top: 25, left: 25, right: 25, bottom: 25 }
};

export type GeoMapProps = {
  allocations?: Allocations;
  focuses?: Focuses;
};

const GeoMap: React.FC<GeoMapProps> = props => {
  const mapElRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | undefined>(undefined);
  const { allocations, focuses } = props;
  const electoratesRenderProps = useMemo(
    () =>
      Object.values(ELECTORATES).map(electorate => {
        const id = ElectorateID[electorate.id];
        const allocation = allocations ? allocations[id] : Allocation.None;

        return {
          id,
          name: electorate.name,
          allocation,
          hasAllocation: allocation && determineIfAllocationIsMade(allocation),
          hasDefinitiveAllocation: allocation && determineIfAllocationIsDefinitive(allocation),
          focus: focuses ? focuses[id] : Focus.No,
          color: ALLOCATIONS_COLORS[allocation || Allocation.None],
          geoProps: ELECTORATES_GEO_PROPERTIES.find(
            geoProps => geoProps.id.toUpperCase() === id
          ) as ElectorateGeoProperties
        };
      }, [] as ElectorateRenderProps[]),
    [allocations, focuses]
  );

  const updateMapState = () => {
    if (!map || !map.getSource('electorate_polygons')) {
      return;
    }

    const focusedElectoratesGeoProperties: ElectorateGeoProperties[] = [];

    [...electoratesRenderProps]
      .sort((a, b) => (a.focus === Focus.Yes ? 1 : 0))
      .forEach(electorateRenderProps => {
        const { id, color, focus, geoProps, hasAllocation } = electorateRenderProps;
        const isFocused = focus === Focus.Yes;

        map.setFeatureState(
          {
            source: 'electorate_polygons',
            sourceLayer: 'federalelectorates2022',
            id: ((id as unknown) as String).toLowerCase()
          },
          { fill: color, stroke: hasAllocation ? '#fff' : isFocused ? '#000' : 'transparent' }
        );

        if (isFocused) {
          focusedElectoratesGeoProperties.push(geoProps);
        }
      });

    let nextBounds: maplibregl.LngLatBoundsLike = AUSTRALA_BOUNDS;

    if (focusedElectoratesGeoProperties.length > 0) {
      const [{ east, north, south, west }, ...remainingGeoProps] = focusedElectoratesGeoProperties;

      nextBounds = [
        [east, north],
        [west, south]
      ];

      console.log(focusedElectoratesGeoProperties);

      if (remainingGeoProps.length) {
        nextBounds = remainingGeoProps.reduce<maplibregl.LngLatBoundsLike>(
          (memo, geoProps) => [
            [Math.max(memo[0][0], geoProps.east), Math.max(memo[0][1], geoProps.north)],
            [Math.min(memo[1][0], geoProps.west), Math.min(memo[1][1], geoProps.south)]
          ],
          nextBounds
        );
      }
      // Fit bounds to Australia extents of focused electorates
    }
    map.fitBounds(new maplibregl.LngLatBounds(nextBounds), FIT_BOUNDS_OPTIONS);
  };

  useEffect(() => {
    ensureMaplibre().then(() => {
      if (!mapElRef.current || map) {
        return;
      }

      const bounds = new maplibregl.LngLatBounds(AUSTRALA_BOUNDS);

      const _map: maplibregl.Map = new maplibregl.Map({
        container: mapElRef.current,
        center: bounds.getCenter(),
        zoom: 2,
        minZoom: 2,
        maxZoom: 12,
        // interactive: false,
        attributionControl: false,
        dragRotate: false,
        style: {
          version: 8,
          sources: {},
          layers: []
        }
      });

      _map.fitBounds(bounds, FIT_BOUNDS_OPTIONS);

      setMap(_map);

      _map.on('load', () => {
        _map.addSource('electorate_polygons', {
          type: 'vector',
          tiles: [
            'https://www.abc.net.au/res/sites/news-projects/map-vector-tiles-federal-electorates-2022/{z}/{x}/{y}.pbf'
          ],
          minzoom: 0,
          maxzoom: 9,
          bounds: [96.816952, -43.740497, 167.998033, -9.142162],
          promoteId: { federalelectorates2022: 'code' }
        });

        _map.addLayer({
          id: 'electorate_polygons_fill',
          type: 'fill',
          source: 'electorate_polygons',
          'source-layer': 'federalelectorates2022',
          paint: {
            'fill-color': ['coalesce', ['feature-state', 'fill'], '#fff']
          }
        });

        _map.addLayer({
          id: 'electorate_polygons_baseline',
          type: 'line',
          source: 'electorate_polygons',
          'source-layer': 'federalelectorates2022',
          paint: {
            'line-color': '#ddd',
            'line-width': ['interpolate', ['exponential', 0.5], ['zoom'], 0, 0.5, 6, 1, 10, 1, 15, 2]
          }
        });

        _map.addLayer({
          id: 'electorate_polygons_line',
          type: 'line',
          source: 'electorate_polygons',
          'source-layer': 'federalelectorates2022',
          paint: {
            'line-color': ['coalesce', ['feature-state', 'stroke'], 'transparent'],
            'line-width': ['interpolate', ['exponential', 0.5], ['zoom'], 0, 0.5, 6, 1, 10, 1, 15, 2]
          }
        });
      });
    });
  }, [mapElRef]);

  useEffect(() => {
    updateMapState();
  }, [map, electoratesRenderProps]);

  return (
    <div className={styles.root}>
      <div ref={mapElRef} data-map></div>
    </div>
  );
};

export default GeoMap;
