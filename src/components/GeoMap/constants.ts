/// <reference types="maplibre-gl" />

declare var maplibregl: typeof import('maplibre-gl');

import type { Allocation, ElectorateID, NoYes } from '../../lib/constants';
import { Area } from '../../lib/constants';

export type CardinalBoundary = {
  north: number;
  south: number;
  east: number;
  west: number;
};

export type ElectorateGeoProperties = {
  id: string;
  latitude: number;
  longitude: number;
} & CardinalBoundary;

export type ElectorateRenderProps = {
  id: ElectorateID;
  name: string;
  allocation: Allocation;
  hasAllocation: boolean;
  hasDefinitiveAllocation: boolean;
  focus: NoYes;
  color: string;
  geoProps: ElectorateGeoProperties;
};

export const MAP_BASE_CONFIG: Partial<maplibregl.MapOptions> = {
  zoom: 2,
  minZoom: 2,
  maxZoom: 12,
  attributionControl: false,
  dragRotate: false,
  doubleClickZoom: false,
  style: {
    version: 8,
    sources: {},
    layers: [],
    glyphs: 'https://www.abc.net.au/res/sites/news-projects/map-vector-fonts/{fontstack}/{range}.pbf'
  }
};

export const AREAS_BOUNDS: Record<Area, maplibregl.LngLatBoundsLike> = {
  [Area.Australia]: [
    [112, -44],
    [156, -10]
  ],
  [Area.BrisbaneAndSurrounds]: [
    [152.67620200034025, -27.85975844732532],
    [153.50771856749492, -27.122141459597835]
  ],
  [Area.SydneyAndSurrounds]: [
    [150.53643051298894, -34.250330919454555],
    [151.6159583706169, -33.35329642067877]
  ],
  [Area.MelbourneAndSurrounds]: [
    [143.7112326761349, -38.73737902155104],
    [146.2181523182391, -36.755303142447325]
  ],
  [Area.InnerCitySydney]: [
    [150.97804393208258, -33.9820617904466],
    [151.29883502771884, -33.71564208020996]
  ],
  [Area.InnerCityMelbourne]: [
    [144.77343032299214, -38.00505753293409],
    [145.25008324655564, -37.62851493730817]
  ],
  [Area.Perth]: [
    [115.29761105882773, -32.58735478749758],
    [116.46158922227181, -31.601283791419284]
  ],
  [Area.Adelaide]: [
    [138.1361307284978, -35.308045628940405],
    [139.08340859017528, -34.53133194772551]
  ],
  [Area.Tasmania]: [
    [143.15169589003773, -43.824678713957354],
    [149.19913869957333, -39.30289848300832]
  ],
  // Start with Australia's bounds
  [Area.FocusDriven]: [
    [112, -44],
    [156, -10]
  ]
};

export const ELECTORATES_GEO_PROPERTIES: ElectorateGeoProperties[] = [
  {
    id: 'adel',
    latitude: -34.9025454,
    longitude: 138.5890261,
    north: -34.846848,
    south: -34.967237,
    west: 138.546715,
    east: 138.638165
  },
  {
    id: 'asto',
    latitude: -37.8889673,
    longitude: 145.258639,
    north: -37.833033,
    south: -37.963976,
    west: 145.190852,
    east: 145.347619
  },
  {
    id: 'ball',
    latitude: -37.6209435,
    longitude: 143.9104325,
    north: -37.14766,
    south: -38.065483,
    west: 143.440553,
    east: 144.419031
  },
  {
    id: 'bank',
    latitude: -33.9648639,
    longitude: 151.0464093,
    north: -33.939661,
    south: -33.994321,
    west: 150.970677,
    east: 151.129671
  },
  {
    id: 'bark',
    latitude: -35.5126527,
    longitude: 140.1809253,
    north: -33.310387,
    south: -38.061475,
    west: 138.744114,
    east: 141.002956
  },
  {
    id: 'bart',
    latitude: -33.9408654,
    longitude: 151.12745,
    north: -33.90912,
    south: -33.973631,
    west: 151.076976,
    east: 151.17424
  },
  {
    id: 'bass',
    latitude: -41.1681932,
    longitude: 147.4406877,
    north: -39.203662,
    south: -41.556178,
    west: 146.380638,
    east: 148.498674
  },
  {
    id: 'bean',
    latitude: -35.5484609,
    longitude: 148.9635227,
    north: -35.218467,
    south: -35.920762,
    west: 148.762675,
    east: 149.206345
  },
  {
    id: 'bend',
    latitude: -36.8901546,
    longitude: 144.3735186,
    north: -36.385183,
    south: -37.386072,
    west: 143.830638,
    east: 144.853563
  },
  {
    id: 'benn',
    latitude: -33.7935698,
    longitude: 151.0983998,
    north: -33.751745,
    south: -33.841778,
    west: 151.047308,
    east: 151.159079
  },
  {
    id: 'bero',
    latitude: -33.5703072,
    longitude: 151.0387909,
    north: -33.37806,
    south: -33.769749,
    west: 150.869657,
    east: 151.247114
  },
  {
    id: 'blai',
    latitude: -27.1196719,
    longitude: 152.4654156,
    north: -26.451923,
    south: -27.865469,
    west: 152.073393,
    east: 152.927745
  },
  {
    id: 'blax',
    latitude: -33.8963821,
    longitude: 151.0089549,
    north: -33.834392,
    south: -33.946946,
    west: 150.966024,
    east: 151.044015
  },
  {
    id: 'bonn',
    latitude: -27.502152,
    longitude: 153.1409435,
    north: -27.021965,
    south: -27.606616,
    west: 153.055774,
    east: 153.468489
  },
  {
    id: 'boot',
    latitude: -35.0021387,
    longitude: 138.5843433,
    north: -34.951985,
    south: -35.059834,
    west: 138.503687,
    east: 138.681387
  },
  {
    id: 'bowm',
    latitude: -27.5464036,
    longitude: 153.4543737,
    north: -27.387907,
    south: -27.740764,
    west: 153.171525,
    east: 153.546708
  },
  {
    id: 'brad',
    latitude: -41.7469073,
    longitude: 145.5261106,
    north: -39.579252,
    south: -43.322601,
    west: 143.818931,
    east: 146.76206
  },
  {
    id: 'brfd',
    latitude: -33.734374,
    longitude: 151.1499412,
    north: -33.659582,
    south: -33.797722,
    west: 151.090013,
    east: 151.233052
  },
  {
    id: 'bran',
    latitude: -32.310699,
    longitude: 115.8058171,
    north: -32.118366,
    south: -32.458152,
    west: 115.658949,
    east: 115.900791
  },
  {
    id: 'bris',
    latitude: -27.438114,
    longitude: 153.0294476,
    north: -27.404039,
    south: -27.479493,
    west: 152.975299,
    east: 153.099735
  },
  {
    id: 'bruc',
    latitude: -37.9937057,
    longitude: 145.2793876,
    north: -37.923128,
    south: -38.074511,
    west: 145.188362,
    east: 145.361053
  },
  {
    id: 'burt',
    latitude: -32.1034842,
    longitude: 115.9764612,
    north: -32.003525,
    south: -32.186852,
    west: 115.896914,
    east: 116.056273
  },
  {
    id: 'cala',
    latitude: -33.0872973,
    longitude: 149.4776991,
    north: -32.05809,
    south: -34.205768,
    west: 148.290218,
    east: 150.619763
  },
  {
    id: 'calw',
    latitude: -37.5991409,
    longitude: 144.9014629,
    north: -37.502119,
    south: -37.694691,
    west: 144.806039,
    east: 144.977813
  },
  {
    id: 'canb',
    latitude: -35.2879307,
    longitude: 149.193184,
    north: -35.201373,
    south: -35.35137,
    west: 149.026067,
    east: 149.399287
  },
  {
    id: 'cann',
    latitude: -32.5386619,
    longitude: 115.9988063,
    north: -32.009311,
    south: -32.94311,
    west: 115.606787,
    east: 116.35808
  },
  {
    id: 'capr',
    latitude: -22.0494455,
    longitude: 148.1816279,
    north: -20.294495,
    south: -23.556035,
    west: 146.031455,
    east: 151.086697
  },
  {
    id: 'case',
    latitude: -37.7152873,
    longitude: 145.6955945,
    north: -37.52509,
    south: -37.975028,
    west: 145.281666,
    east: 146.192502
  },
  {
    id: 'chif',
    latitude: -33.7303271,
    longitude: 150.8371657,
    north: -33.650137,
    south: -33.797945,
    west: 150.75963,
    east: 150.906339
  },
  {
    id: 'chis',
    latitude: -37.8751023,
    longitude: 145.1447719,
    north: -37.816894,
    south: -37.924401,
    west: 145.088226,
    east: 145.208341
  },
  {
    id: 'clar',
    latitude: -42.8892737,
    longitude: 147.2432789,
    north: -42.750403,
    south: -42.986264,
    west: 147.135393,
    east: 147.361982
  },
  {
    id: 'cook',
    latitude: -34.0339413,
    longitude: 151.1456106,
    north: -33.964309,
    south: -34.073811,
    west: 151.076831,
    east: 151.231936
  },
  {
    id: 'coop',
    latitude: -37.7365349,
    longitude: 145.0131484,
    north: -37.690999,
    south: -37.803662,
    west: 144.966158,
    east: 145.075398
  },
  {
    id: 'cora',
    latitude: -38.1867095,
    longitude: 144.2454154,
    north: -37.976627,
    south: -38.398371,
    west: 143.809865,
    east: 144.720215
  },
  {
    id: 'cori',
    latitude: -37.9850121,
    longitude: 144.3660147,
    north: -37.800934,
    south: -38.214825,
    west: 144.20252,
    east: 144.591924
  },
  {
    id: 'cowa',
    latitude: -31.8584757,
    longitude: 115.8620577,
    north: -31.817323,
    south: -31.901762,
    west: 115.783178,
    east: 115.956597
  },
  {
    id: 'cowp',
    latitude: -30.7612042,
    longitude: 152.718967,
    north: -29.92302,
    south: -31.492967,
    west: 152.269825,
    east: 153.39483
  },
  {
    id: 'cunn',
    latitude: -34.3204101,
    longitude: 150.8677846,
    north: -34.130009,
    south: -34.500719,
    west: 150.689634,
    east: 151.06615
  },
  {
    id: 'curt',
    latitude: -31.9401695,
    longitude: 115.7869156,
    north: -31.857519,
    south: -32.025053,
    west: 115.750013,
    east: 115.843989
  },
  {
    id: 'daws',
    latitude: -20.1965756,
    longitude: 147.9745099,
    north: -19.181776,
    south: -21.272082,
    west: 146.76101,
    east: 149.936368
  },
  {
    id: 'deak',
    latitude: -37.8139586,
    longitude: 145.2432323,
    north: -37.761845,
    south: -37.865207,
    west: 145.152195,
    east: 145.318727
  },
  {
    id: 'dick',
    latitude: -27.2715625,
    longitude: 152.8482457,
    north: -27.086169,
    south: -27.422375,
    west: 152.68095,
    east: 153.020453
  },
  {
    id: 'dobe',
    latitude: -33.2412723,
    longitude: 151.3526307,
    north: -33.043632,
    south: -33.429352,
    west: 151.199234,
    east: 151.579359
  },
  {
    id: 'dunk',
    latitude: -38.1437987,
    longitude: 145.161503,
    north: -38.067395,
    south: -38.224894,
    west: 145.061238,
    east: 145.239583
  },
  {
    id: 'dura',
    latitude: -22.330211,
    longitude: 121.3629956,
    north: -13.688704,
    south: -32.139926,
    west: 112.921125,
    east: 129.001338
  },
  {
    id: 'emon',
    latitude: -36.0454777,
    longitude: 149.0414722,
    north: -34.535667,
    south: -37.505036,
    west: 147.687385,
    east: 150.230948
  },
  {
    id: 'fadd',
    latitude: -27.8134504,
    longitude: 153.3353782,
    north: -27.691834,
    south: -27.976843,
    west: 153.212689,
    east: 153.448823
  },
  {
    id: 'fair',
    latitude: -26.5830875,
    longitude: 152.8856519,
    north: -26.432044,
    south: -26.733574,
    west: 152.550871,
    east: 153.120026
  },
  {
    id: 'farr',
    latitude: -34.3457072,
    longitude: 144.4540942,
    north: -32.671254,
    south: -36.12992,
    west: 141.001707,
    east: 147.897578
  },
  {
    id: 'fenn',
    latitude: -35.1980429,
    longitude: 149.0832675,
    north: -35.112321,
    south: -35.280474,
    west: 148.961345,
    east: 150.772306
  },
  {
    id: 'fish',
    latitude: -26.7861112,
    longitude: 152.9003521,
    north: -26.616193,
    south: -26.984837,
    west: 152.582116,
    east: 153.151394
  },
  {
    id: 'flin',
    latitude: -38.3465242,
    longitude: 145.0334073,
    north: -38.181571,
    south: -38.499358,
    west: 144.651418,
    east: 145.503419
  },
  {
    id: 'flyn',
    latitude: -24.4953396,
    longitude: 149.6564763,
    north: -22.654254,
    south: -26.478767,
    west: 146.572458,
    east: 152.719367
  },
  {
    id: 'ford',
    latitude: -27.761726,
    longitude: 153.1805989,
    north: -27.634159,
    south: -27.919222,
    west: 152.986762,
    east: 153.314623
  },
  {
    id: 'forr',
    latitude: -33.6238673,
    longitude: 115.614672,
    north: -32.920678,
    south: -34.414942,
    west: 114.974661,
    east: 116.239769
  },
  {
    id: 'fowl',
    latitude: -33.893911,
    longitude: 150.9210355,
    north: -33.851122,
    south: -33.939096,
    west: 150.843477,
    east: 150.985518
  },
  {
    id: 'fran',
    latitude: -43.2432129,
    longitude: 146.6269612,
    north: -42.761214,
    south: -43.740497,
    west: 145.915098,
    east: 147.613383
  },
  {
    id: 'fras',
    latitude: -37.7803186,
    longitude: 144.8322146,
    north: -37.724219,
    south: -37.822888,
    west: 144.769138,
    east: 144.916501
  },
  {
    id: 'frem',
    latitude: -32.1185837,
    longitude: 115.821892,
    north: -31.987343,
    south: -32.181389,
    west: 115.449484,
    east: 115.916173
  },
  {
    id: 'gell',
    latitude: -37.8603231,
    longitude: 144.7903673,
    north: -37.806788,
    south: -37.941266,
    west: 144.702655,
    east: 144.915517
  },
  {
    id: 'gilm',
    latitude: -35.2402513,
    longitude: 150.3121661,
    north: -34.598949,
    south: -36.066889,
    west: 149.81439,
    east: 150.865478
  },
  {
    id: 'gipp',
    latitude: -37.5812889,
    longitude: 147.7681255,
    north: -36.612428,
    south: -38.790876,
    west: 146.210508,
    east: 149.976287
  },
  {
    id: 'gold',
    latitude: -37.9325405,
    longitude: 145.021715,
    north: -37.883274,
    south: -37.996434,
    west: 144.983388,
    east: 145.055267
  },
  {
    id: 'gort',
    latitude: -37.7396847,
    longitude: 144.7100991,
    north: -37.66291,
    south: -37.812017,
    west: 144.604728,
    east: 144.848173
  },
  {
    id: 'gray',
    latitude: -33.8877227,
    longitude: 151.1575035,
    north: -33.845481,
    south: -33.924966,
    west: 151.117504,
    east: 151.19659
  },
  {
    id: 'gree',
    latitude: -33.7314295,
    longitude: 150.911061,
    north: -33.646317,
    south: -33.811574,
    west: 150.851043,
    east: 150.966879
  },
  {
    id: 'grey',
    latitude: -29.6283063,
    longitude: 135.4712167,
    north: -25.996146,
    south: -35.378174,
    west: 129.001337,
    east: 141.002391
  },
  {
    id: 'grif',
    latitude: -27.4865494,
    longitude: 153.0637409,
    north: -27.442167,
    south: -27.531787,
    west: 152.996215,
    east: 153.106651
  },
  {
    id: 'groo',
    latitude: -27.4838278,
    longitude: 151.6534885,
    north: -26.967754,
    south: -27.907429,
    west: 151.076586,
    east: 152.153098
  },
  {
    id: 'hasl',
    latitude: -31.8604497,
    longitude: 116.178432,
    north: -31.670468,
    south: -32.062561,
    west: 115.914083,
    east: 116.415125
  },
  {
    id: 'hawk',
    latitude: -37.6301974,
    longitude: 144.4404764,
    north: -37.420649,
    south: -37.864089,
    west: 144.130125,
    east: 144.870505
  },
  {
    id: 'herb',
    latitude: -19.266969,
    longitude: 146.606518,
    north: -18.537793,
    south: -19.416731,
    west: 146.273046,
    east: 147.043446
  },
  {
    id: 'higg',
    latitude: -37.8646339,
    longitude: 145.0452417,
    north: -37.829622,
    south: -37.90814,
    west: 144.983322,
    east: 145.093654
  },
  {
    id: 'hind',
    latitude: -34.8742197,
    longitude: 138.5185663,
    north: -34.755243,
    south: -34.975938,
    west: 138.47573,
    east: 138.575357
  },
  {
    id: 'hink',
    latitude: -25.202038,
    longitude: 152.4129525,
    north: -24.756955,
    south: -25.510504,
    west: 151.982063,
    east: 153.024622
  },
  {
    id: 'holt',
    latitude: -38.1513152,
    longitude: 145.3021769,
    north: -38.017011,
    south: -38.24848,
    west: 145.214929,
    east: 145.430658
  },
  {
    id: 'hoth',
    latitude: -37.9403618,
    longitude: 145.1320921,
    north: -37.887152,
    south: -37.99542,
    west: 145.048317,
    east: 145.195486
  },
  {
    id: 'hugh',
    latitude: -34.0619202,
    longitude: 151.0136013,
    north: -33.926893,
    south: -34.172328,
    west: 150.886112,
    east: 151.171843
  },
  {
    id: 'hume',
    latitude: -34.4421084,
    longitude: 149.6642881,
    north: -33.841775,
    south: -35.256292,
    west: 148.553622,
    east: 150.898073
  },
  {
    id: 'hunt',
    latitude: -32.65463,
    longitude: 150.9213068,
    north: -32.130034,
    south: -33.202843,
    west: 150.22644,
    east: 151.665396
  },
  {
    id: 'indi',
    latitude: -36.7345667,
    longitude: 146.6067888,
    north: -35.928545,
    south: -37.629427,
    west: 145.162734,
    east: 148.220685
  },
  {
    id: 'isaa',
    latitude: -38.0150678,
    longitude: 145.1495265,
    north: -37.933006,
    south: -38.084999,
    west: 145.034373,
    east: 145.251854
  },
  {
    id: 'jaga',
    latitude: -37.7149041,
    longitude: 145.1412302,
    north: -37.656809,
    south: -37.78509,
    west: 145.027828,
    east: 145.269289
  },
  {
    id: 'kenn',
    latitude: -19.6416511,
    longitude: 142.0910229,
    north: -15.837752,
    south: -23.693644,
    west: 137.995957,
    east: 147.347724
  },
  {
    id: 'ksmi',
    latitude: -33.9454409,
    longitude: 151.2214372,
    north: -33.900896,
    south: -34.001801,
    west: 151.159828,
    east: 151.268247
  },
  {
    id: 'king',
    latitude: -35.119784,
    longitude: 138.5335163,
    north: -35.023294,
    south: -35.24736,
    west: 138.461721,
    east: 138.628128
  },
  {
    id: 'kooy',
    latitude: -37.8141176,
    longitude: 145.0662096,
    north: -37.776861,
    south: -37.861375,
    west: 144.999258,
    east: 145.118458
  },
  {
    id: 'ltro',
    latitude: -38.0838185,
    longitude: 145.5643287,
    north: -37.857701,
    south: -38.332457,
    west: 145.327163,
    east: 145.765096
  },
  {
    id: 'lalo',
    latitude: -37.8900223,
    longitude: 144.5951998,
    north: -37.781013,
    south: -38.004567,
    west: 144.444061,
    east: 144.757828
  },
  {
    id: 'leic',
    latitude: -14.3817024,
    longitude: 143.1244866,
    north: -9.142163,
    south: -17.045015,
    west: 141.415754,
    east: 145.97736
  },
  {
    id: 'lill',
    latitude: -27.3761696,
    longitude: 153.0726497,
    north: -27.276796,
    south: -27.443097,
    west: 152.975195,
    east: 153.160525
  },
  {
    id: 'lind',
    latitude: -33.7506428,
    longitude: 150.7106388,
    north: -33.612281,
    south: -33.875728,
    west: 150.588042,
    east: 150.812394
  },
  {
    id: 'ling',
    latitude: -19.4803588,
    longitude: 133.370283,
    north: -10.966819,
    south: -25.999482,
    west: 129.00044,
    east: 138.001198
  },
  {
    id: 'long',
    latitude: -27.0170429,
    longitude: 152.8641446,
    north: -26.79225,
    south: -27.250262,
    west: 152.651189,
    east: 153.207558
  },
  {
    id: 'lyne',
    latitude: -31.9583927,
    longitude: 152.0970259,
    north: -31.114,
    south: -32.760455,
    west: 151.303745,
    east: 152.915187
  },
  {
    id: 'lyon',
    latitude: -42.0904664,
    longitude: 147.0660202,
    north: -40.899176,
    south: -43.246553,
    west: 145.832501,
    east: 148.359261
  },
  {
    id: 'maca',
    latitude: -34.0713365,
    longitude: 150.8276297,
    north: -33.939866,
    south: -34.189606,
    west: 150.722734,
    east: 150.940791
  },
  {
    id: 'mack',
    latitude: -33.6726401,
    longitude: 151.2476286,
    north: -33.571858,
    south: -33.773127,
    west: 151.16076,
    east: 151.34302
  },
  {
    id: 'macn',
    latitude: -37.8521823,
    longitude: 144.9724622,
    north: -37.819122,
    south: -37.891737,
    west: 144.897093,
    east: 145.049635
  },
  {
    id: 'macq',
    latitude: -33.4750714,
    longitude: 150.6416256,
    north: -32.996069,
    south: -33.963447,
    west: 150.166036,
    east: 151.135811
  },
  {
    id: 'maki',
    latitude: -34.8019875,
    longitude: 138.6680433,
    north: -34.734253,
    south: -34.849857,
    west: 138.547515,
    east: 138.78019
  },
  {
    id: 'mall',
    latitude: -35.8654791,
    longitude: 142.383315,
    north: -33.980426,
    south: -37.449882,
    west: 140.961682,
    east: 144.418183
  },
  {
    id: 'mara',
    latitude: -25.8070344,
    longitude: 144.7172349,
    north: -21.308656,
    south: -29.177898,
    west: 137.998246,
    east: 152.492637
  },
  {
    id: 'mari',
    latitude: -37.7202014,
    longitude: 144.8727929,
    north: -37.64101,
    south: -37.802286,
    west: 144.797644,
    east: 144.940362
  },
  {
    id: 'mayo',
    latitude: -35.2688804,
    longitude: 138.7339166,
    north: -34.680483,
    south: -36.08659,
    west: 136.532949,
    east: 139.158312
  },
  {
    id: 'mcew',
    latitude: -37.425595,
    longitude: 144.9080431,
    north: -37.200891,
    south: -37.718879,
    west: 144.377801,
    east: 145.366412
  },
  {
    id: 'mcma',
    latitude: -33.8335872,
    longitude: 150.8652394,
    north: -33.776811,
    south: -33.885677,
    west: 150.758524,
    east: 150.997077
  },
  {
    id: 'mcph',
    latitude: -28.1475551,
    longitude: 153.3985823,
    north: -28.030988,
    south: -28.250311,
    west: 153.294263,
    east: 153.552171
  },
  {
    id: 'melb',
    latitude: -37.8045167,
    longitude: 144.9675463,
    north: -37.772661,
    south: -37.834519,
    west: 144.905452,
    east: 145.028365
  },
  {
    id: 'menz',
    latitude: -37.7645763,
    longitude: 145.1867864,
    north: -37.702443,
    south: -37.819847,
    west: 145.067113,
    east: 145.293932
  },
  {
    id: 'mitc',
    latitude: -33.711098,
    longitude: 150.9591749,
    north: -33.611787,
    south: -33.796705,
    west: 150.87402,
    east: 151.031156
  },
  {
    id: 'mona',
    latitude: -38.293837,
    longitude: 146.0595073,
    north: -37.580001,
    south: -39.159176,
    west: 145.109454,
    east: 146.707426
  },
  {
    id: 'monc',
    latitude: -28.0057664,
    longitude: 153.3827722,
    north: -27.936081,
    south: -28.076625,
    west: 153.285497,
    east: 153.447581
  },
  {
    id: 'moor',
    latitude: -31.7869029,
    longitude: 115.7648759,
    north: -31.711941,
    south: -31.874567,
    west: 115.706623,
    east: 115.820868
  },
  {
    id: 'more',
    latitude: -27.5634187,
    longitude: 153.0331137,
    north: -27.499829,
    south: -27.618228,
    west: 152.962002,
    east: 153.111147
  },
  {
    id: 'neng',
    latitude: -30.4532681,
    longitude: 151.2823056,
    north: -28.249244,
    south: -32.408795,
    west: 149.791608,
    east: 152.631445
  },
  {
    id: 'newc',
    latitude: -32.8926232,
    longitude: 151.7025577,
    north: -32.823917,
    south: -32.962974,
    west: 151.600846,
    east: 151.810103
  },
  {
    id: 'nich',
    latitude: -36.4233937,
    longitude: 145.1622999,
    north: -35.801997,
    south: -37.29412,
    west: 144.259311,
    east: 146.246547
  },
  {
    id: 'nsyd',
    latitude: -33.8159216,
    longitude: 151.1908593,
    north: -33.78525,
    south: -33.852686,
    west: 151.126708,
    east: 151.232907
  },
  {
    id: 'ocon',
    latitude: -29.0130847,
    longitude: 123.2310275,
    north: -23.440217,
    south: -35.191995,
    west: 115.336501,
    east: 129.002045
  },
  {
    id: 'oxle',
    latitude: -27.6087308,
    longitude: 152.933957,
    north: -27.528111,
    south: -27.686553,
    west: 152.852921,
    east: 153.025181
  },
  {
    id: 'page',
    latitude: -29.3343971,
    longitude: 152.8567211,
    north: -28.269555,
    south: -30.418897,
    west: 152.168299,
    east: 153.544472
  },
  {
    id: 'park',
    latitude: -30.926152,
    longitude: 145.5752299,
    north: -28.537157,
    south: -33.607151,
    west: 140.999475,
    east: 150.890605
  },
  {
    id: 'parr',
    latitude: -33.8079201,
    longitude: 151.0093606,
    north: -33.766481,
    south: -33.85369,
    west: 150.94763,
    east: 151.066376
  },
  {
    id: 'pate',
    latitude: -32.7666893,
    longitude: 151.7322332,
    north: -32.635733,
    south: -32.881649,
    west: 151.395759,
    east: 152.205519
  },
  {
    id: 'pear',
    latitude: -31.6259749,
    longitude: 115.7838764,
    north: -31.455129,
    south: -31.841348,
    west: 115.560761,
    east: 115.982838
  },
  {
    id: 'pert',
    latitude: -31.9200887,
    longitude: 115.8833609,
    north: -31.887224,
    south: -31.973738,
    west: 115.817993,
    east: 115.964319
  },
  {
    id: 'petr',
    latitude: -27.2464518,
    longitude: 153.0380593,
    north: -27.147816,
    south: -27.365258,
    west: 152.97751,
    east: 153.118992
  },
  {
    id: 'rank',
    latitude: -27.6422438,
    longitude: 153.0943039,
    north: -27.587311,
    south: -27.700167,
    west: 153.014871,
    east: 153.183562
  },
  {
    id: 'reid',
    latitude: -33.8563272,
    longitude: 151.0906282,
    north: -33.820371,
    south: -33.892749,
    west: 151.029782,
    east: 151.164849
  },
  {
    id: 'rich',
    latitude: -28.4798015,
    longitude: 153.4108357,
    north: -28.15702,
    south: -28.924898,
    west: 153.106738,
    east: 153.638722
  },
  {
    id: 'rive',
    latitude: -34.16477,
    longitude: 147.6548738,
    north: -32.368952,
    south: -35.57586,
    west: 146.0703,
    east: 149.257771
  },
  {
    id: 'robe',
    latitude: -33.3697989,
    longitude: 151.2063617,
    north: -33.10996,
    south: -33.570626,
    west: 150.984144,
    east: 151.45262
  },
  {
    id: 'ryan',
    latitude: -27.4594494,
    longitude: 152.8627093,
    north: -27.318469,
    south: -27.602502,
    west: 152.679693,
    east: 153.020626
  },
  {
    id: 'scul',
    latitude: -37.6469832,
    longitude: 145.0339467,
    north: -37.598964,
    south: -37.699983,
    west: 144.946461,
    east: 145.123397
  },
  {
    id: 'shor',
    latitude: -33.1678078,
    longitude: 151.585253,
    north: -32.929382,
    south: -33.247326,
    west: 151.507566,
    east: 151.737942
  },
  {
    id: 'solo',
    latitude: -12.432217,
    longitude: 130.9093671,
    north: -12.33006,
    south: -12.541256,
    west: 130.815126,
    east: 131.000678
  },
  {
    id: 'spen',
    latitude: -34.6816942,
    longitude: 138.6707614,
    north: -34.550657,
    south: -34.791796,
    west: 138.43615,
    east: 138.848044
  },
  {
    id: 'stur',
    latitude: -34.897584,
    longitude: 138.6691632,
    north: -34.837125,
    south: -34.976197,
    west: 138.612826,
    east: 138.756521
  },
  {
    id: 'swan',
    latitude: -31.9749093,
    longitude: 115.9506133,
    north: -31.915772,
    south: -32.033503,
    west: 115.844832,
    east: 116.041017
  },
  {
    id: 'sydn',
    latitude: -33.8893985,
    longitude: 151.1994415,
    north: -33.850907,
    south: -33.924332,
    west: 151.171465,
    east: 151.230883
  },
  {
    id: 'tang',
    latitude: -32.0537279,
    longitude: 115.872496,
    north: -32.001636,
    south: -32.115337,
    west: 115.776047,
    east: 115.951618
  },
  {
    id: 'wann',
    latitude: -37.8903139,
    longitude: 142.5457358,
    north: -37.087296,
    south: -38.85768,
    west: 140.965735,
    east: 144.234254
  },
  {
    id: 'warr',
    latitude: -33.7800839,
    longitude: 151.2596246,
    north: -33.751294,
    south: -33.853556,
    west: 151.204298,
    east: 151.307596
  },
  {
    id: 'wats',
    latitude: -33.9079608,
    longitude: 151.0745127,
    north: -33.86282,
    south: -33.943749,
    west: 151.035641,
    east: 151.132426
  },
  {
    id: 'went',
    latitude: -33.8835846,
    longitude: 151.2551908,
    north: -33.832663,
    south: -33.91483,
    west: 151.215031,
    east: 151.287848
  },
  {
    id: 'werr',
    latitude: -33.9285093,
    longitude: 150.8243979,
    north: -33.869416,
    south: -34.020952,
    west: 150.704656,
    east: 150.918927
  },
  {
    id: 'whit',
    latitude: -34.5225955,
    longitude: 150.5734685,
    north: -34.319652,
    south: -34.705492,
    west: 150.226638,
    east: 150.904456
  },
  {
    id: 'wbay',
    latitude: -26.0134135,
    longitude: 152.4764995,
    north: -24.696996,
    south: -26.597709,
    west: 151.7194,
    east: 153.360352
  },
  {
    id: 'will',
    latitude: -37.7301334,
    longitude: 144.9486204,
    north: -37.69094,
    south: -37.779319,
    west: 144.898012,
    east: 144.986865
  },
  {
    id: 'wrig',
    latitude: -27.9171492,
    longitude: 152.6740479,
    north: -27.385228,
    south: -28.363963,
    west: 151.942075,
    east: 153.370122
  }
];
