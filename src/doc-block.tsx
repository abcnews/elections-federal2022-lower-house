import 'regenerator-runtime/runtime';
import { whenDOMReady } from '@abcnews/env-utils';
import { selectMounts } from '@abcnews/mount-utils';
import React from 'react';
import { render } from 'react-dom';
import './lib/theme.scss';
import DocBlock from './components/DocBlock';

whenDOMReady.then(() => render(<DocBlock />, selectMounts('lhdb')[0]));
