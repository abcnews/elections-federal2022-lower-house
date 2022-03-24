import { whenDOMReady } from '@abcnews/env-utils';
import { selectMounts } from '@abcnews/mount-utils';
import React from 'react';
import { render } from 'react-dom';
import './lib/theme.scss';
import Illustration, { IllustrationName } from './components/Illustration';
import MarkerCopyButton from './components/MarkerCopyButton';

const Article = () => (
  <article style={{ fontFamily: 'ABCSans' }}>
    <h1>Illustrations</h1>
    <div>
      {Object.values(IllustrationName).map((name, index) => (
        <div key={name} style={{ margin: '0 0 3rem' }}>
          <div style={{ margin: '0 0 2.5rem', maxWidth: '28rem' }}>
            <Illustration name={name} />
          </div>
          <MarkerCopyButton text={`#lhillustrationNAME${name}`}></MarkerCopyButton>
          {index === 0 && ' or '}
          {index === 0 && <MarkerCopyButton text="#lhillustration"></MarkerCopyButton>}
        </div>
      ))}
    </div>
  </article>
);

whenDOMReady.then(() => render(<Article />, selectMounts('lhallillustrations')[0]));
