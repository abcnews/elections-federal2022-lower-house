import { whenDOMReady } from '@abcnews/env-utils';
import { selectMounts } from '@abcnews/mount-utils';
import React from 'react';
import { render } from 'react-dom';
import './theme.scss';
import Illustration, { IllustrationName } from './components/Illustration';

const MarkerText = ({ text }) => (
  <button onClick={() => navigator.clipboard.writeText(text)} style={{ cursor: 'copy', padding: '0.25rem 0.5rem' }}>
    <code>{text}</code>
  </button>
);

const Article = () => (
  <article style={{ fontFamily: 'ABCSans' }}>
    <h1>Illustrations</h1>
    <div>
      {Object.values(IllustrationName).map((name, index) => (
        <div key={name} style={{ margin: '0 0 3rem' }}>
          <div style={{ margin: '0 0 2.5rem', maxWidth: '28rem' }}>
            <Illustration name={name} />
          </div>
          <MarkerText text={`#lhillustrationNAME${name}`}></MarkerText>
          {index === 0 && ' or '}
          {index === 0 && <MarkerText text="#lhillustration"></MarkerText>}
        </div>
      ))}
    </div>
  </article>
);

whenDOMReady.then(() => render(<Article />, selectMounts('lhallillustrations')[0]));
