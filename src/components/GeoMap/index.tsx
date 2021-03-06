import { debounce } from 'debounce';
import * as maplibregl from 'maplibre-gl';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Allocation,
  Allocations,
  Annotations,
  Area,
  DEFAULT_AREA,
  Certainties,
  Electorate,
  ElectorateID,
  ELECTORATES,
  Focuses,
  NoYes
} from '../../lib/constants';
import { ALLOCATIONS_COLORS } from '../../lib/theme';
import { determineIfAllocationIsDefinitive, determineIfAllocationIsMade } from '../../lib/utils';
import type { ElectorateGeoProperties, ElectorateRenderProps } from './constants';
import { AREAS_BOUNDS, ELECTORATES_GEO_PROPERTIES, MAP_BASE_CONFIG } from './constants';
import styles from './styles.scss';
import patternURL from './pattern.png';
import { electorateIdToNumber } from './utils';

const FIT_BOUNDS_OPTIONS = {
  padding: { top: 25, left: 25, right: 25, bottom: 25 }
  // padding: { top: 0, left: 0, right: 0, bottom: 0 }
};

export type GeoMapProps = {
  area: Area;
  allocations?: Allocations;
  annotations?: Annotations;
  certainties?: Certainties;
  focuses?: Focuses;
  onTapElectorate?: (electorateID: string, event: React.MouseEvent<Element>) => void;
};

export const DEFAULT_PROPS = {
  area: DEFAULT_AREA
};

const GeoMap: React.FC<GeoMapProps> = props => {
  const { allocations, annotations, area, certainties, focuses, onTapElectorate } = { ...DEFAULT_PROPS, ...props };
  const [isElectoratePolygonsLoaded, setIsElectoratePolygonsLoaded] = useState(false);
  const [isInspecting, setIsInspecting] = useState(false);
  const mapElRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | undefined>(undefined);
  const [bounds, setBounds] = useState<maplibregl.LngLatBoundsLike>(AREAS_BOUNDS[area]);
  const [resizeDirtyValue, setResizeDirtyValue] = useState<number>(Math.random());
  const hasFocuses = focuses && Object.keys(focuses).some(key => focuses[key] !== NoYes.No);
  const isInteractive = !!onTapElectorate;

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
          certainty: certainties ? certainties[id] : NoYes.Yes,
          annotation: annotations ? annotations[id] : NoYes.No,
          focus: focuses ? focuses[id] : NoYes.No,
          color: ALLOCATIONS_COLORS[allocation],
          geoProps: ELECTORATES_GEO_PROPERTIES.find(
            geoProps => geoProps.id.toUpperCase() === id
          ) as ElectorateGeoProperties
        };
      }, [] as ElectorateRenderProps[]),
    [allocations, annotations, certainties, focuses]
  );

  const updateMapState = (isInspectionChange = false) => {
    if (!map || !isElectoratePolygonsLoaded) {
      return;
    }

    const focusedElectoratesGeoProperties: ElectorateGeoProperties[] = [];

    [...electoratesRenderProps].forEach(electorateRenderProps => {
      const { id, hasAllocation, annotation, certainty, focus, color, geoProps } = electorateRenderProps;
      const geoPropsID = ((id as unknown) as String).toLowerCase();
      const isAnnotated = annotation === NoYes.Yes;
      const isCertain = certainty === NoYes.Yes; // TODO - impact stroke/fill, like with hexes?
      const isFocused = focus === NoYes.Yes;

      map.setFeatureState(
        {
          source: 'electorate_polygons',
          sourceLayer: 'federalelectorates2022',
          id: geoPropsID
        },
        {
          opacity: hasFocuses && !isFocused ? 0.25 : 1,
          'pattern-opacity': isCertain ? 0 : 1,
          fill: color,
          stroke: hasAllocation ? '#fff' : isFocused ? '#000' : 'transparent'
        }
      );

      map.setFeatureState(
        {
          source: 'electorate_points',
          id: electorateIdToNumber(geoPropsID)
        },
        { opacity: isInspecting || isAnnotated ? 1 : 0 }
      );

      if (isFocused) {
        focusedElectoratesGeoProperties.push(geoProps);
      }
    });

    if (!isInspectionChange) {
      let nextBounds = AREAS_BOUNDS[area];

      if (area === Area.FocusDriven && focusedElectoratesGeoProperties.length > 0) {
        const [{ east, north, south, west }, ...remainingGeoProps] = focusedElectoratesGeoProperties;

        nextBounds = [
          [east, north],
          [west, south]
        ];

        if (remainingGeoProps.length) {
          nextBounds = remainingGeoProps.reduce<maplibregl.LngLatBoundsLike>(
            (memo, geoProps) => [
              [Math.max(memo[0][0], geoProps.east), Math.max(memo[0][1], geoProps.north)],
              [Math.min(memo[1][0], geoProps.west), Math.min(memo[1][1], geoProps.south)]
            ],
            nextBounds
          );
        }
      }

      setBounds(nextBounds);
    }
  };

  useEffect(() => {
    if (!mapElRef.current || map) {
      return;
    }

    const _map: maplibregl.Map = new maplibregl.Map({
      ...(MAP_BASE_CONFIG as maplibregl.MapOptions),
      container: mapElRef.current,
      center: new maplibregl.LngLatBounds(bounds).getCenter(),
      interactive: isInteractive
    });

    setMap(_map);

    _map.on('load', () => {
      if (!mapElRef.current) {
        return;
      }

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

      _map.addSource('electorate_points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: ELECTORATES_GEO_PROPERTIES.map(geoProps => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [geoProps.longitude, geoProps.latitude]
            },
            id: electorateIdToNumber(geoProps.id),
            properties: {
              ...geoProps,
              name: (ELECTORATES.find(
                electorate => String(ElectorateID[electorate.id]) === geoProps.id.toUpperCase()
              ) as Electorate).name
            }
          }))
        }
      });

      _map.loadImage(
        patternURL,
        (err, image) => err || _map.addImage('diagonal_stripes_pattern', image as ImageBitmap)
      );

      _map.addLayer({
        id: 'electorate_polygons_fill',
        type: 'fill',
        source: 'electorate_polygons',
        'source-layer': 'federalelectorates2022',
        paint: {
          'fill-opacity': ['coalesce', ['feature-state', 'opacity'], 1],
          'fill-color': ['coalesce', ['feature-state', 'fill'], '#fff']
        }
      });

      _map.addLayer({
        id: 'electorate_polygons_pattern',
        type: 'fill',
        source: 'electorate_polygons',
        'source-layer': 'federalelectorates2022',
        paint: {
          'fill-opacity': ['coalesce', ['feature-state', 'pattern-opacity'], 0],
          'fill-pattern': 'diagonal_stripes_pattern'
        }
      });

      _map.addLayer({
        id: 'electorate_polygons_baseline',
        type: 'line',
        source: 'electorate_polygons',
        'source-layer': 'federalelectorates2022',
        paint: {
          'line-opacity': ['coalesce', ['feature-state', 'opacity'], 1],
          'line-color': '#ddd',
          'line-width': 1
        }
      });

      _map.addLayer({
        id: 'electorate_polygons_line',
        type: 'line',
        source: 'electorate_polygons',
        'source-layer': 'federalelectorates2022',
        paint: {
          'line-color': ['coalesce', ['feature-state', 'stroke'], 'transparent'],
          'line-width': 1
        }
      });

      _map.addLayer({
        id: 'electorate_points_label',
        type: 'symbol',
        source: 'electorate_points',
        layout: {
          'text-field': '{name}',
          'text-anchor': 'center',
          'text-max-width': 6,
          'text-font': ['ABC Sans Bold'],
          'text-size': 13
        },
        paint: {
          'text-opacity': ['coalesce', ['feature-state', 'opacity'], 0],
          'text-color': '#000',
          'text-halo-color': '#fff',
          'text-halo-width': 1.5
        }
      });

      _map.on('sourcedata', () => {
        if (!mapElRef.current) {
          return;
        }

        setIsElectoratePolygonsLoaded(!!_map.getSource('electorate_polygons'));
      });

      _map.on(
        'resize',
        debounce(() => setResizeDirtyValue(Math.random()), 200)
      );

      _map.on('click', event => {
        if (!onTapElectorate) {
          return;
        }

        const { point } = event;
        const features = _map.queryRenderedFeatures(point, { layers: ['electorate_polygons_fill'] });

        if (features.length > 0) {
          const { code } = features[0].properties;

          if (code) {
            onTapElectorate(code.toUpperCase(), { nativeEvent: event.originalEvent } as React.MouseEvent);
          }
        }
      });

      updateMapState();
    });
  }, [mapElRef, map]);

  useEffect(() => {
    updateMapState();
  }, [map, isElectoratePolygonsLoaded, area, electoratesRenderProps]);

  useEffect(() => {
    updateMapState(true);
  }, [isInspecting]);

  useEffect(() => {
    let textIgnorePlacementTimeout: NodeJS.Timeout;

    if (map) {
      map.fitBounds(new maplibregl.LngLatBounds(bounds), FIT_BOUNDS_OPTIONS);
      textIgnorePlacementTimeout = setTimeout(
        () => map.setLayoutProperty('electorate_points_label', 'text-ignore-placement', area !== Area.Australia),
        area === Area.Australia ? 250 : 750
      );
    }

    return () => {
      clearTimeout(textIgnorePlacementTimeout);
    };
  }, [map, bounds, resizeDirtyValue]);

  // While the alt key is held down on an interactive graphic, we enable
  // 'inspecting' mode. Currentnly, this displays labels on each electorate to
  // help with authoring graphics in the editor.
  useEffect(() => {
    if (!isInteractive) {
      return;
    }

    function handler(event: KeyboardEvent) {
      setIsInspecting(event.altKey);
    }

    window.addEventListener('keydown', handler, false);
    window.addEventListener('keyup', handler, false);

    return () => {
      window.removeEventListener('keydown', handler, false);
      window.removeEventListener('keyup', handler, false);
    };
  }, [isInteractive]);

  return (
    <div className={styles.root} data-area={area}>
      <div ref={mapElRef} data-map></div>
    </div>
  );
};

export default GeoMap;
