import 'regenerator-runtime/runtime';
import { whenDOMReady } from '@abcnews/env-utils';
import { getMountValue, selectMounts } from '@abcnews/mount-utils';
import React from 'react';
import { render } from 'react-dom';
import './theme.scss';
import { alternatingCaseToGraphicProps } from './utils';
import type { GraphicProps } from './components/Graphic';
import Graphic from './components/Graphic';

whenDOMReady.then(() => {
  const mounts = selectMounts('lhgraphic');

  mounts.forEach(mount => {
    const graphicProps = alternatingCaseToGraphicProps(getMountValue(mount)) as GraphicProps;

    render(<Graphic {...graphicProps} />, mount);
  });
});
