import 'regenerator-runtime/runtime';
import { whenDOMReady } from '@abcnews/env-utils';
import { selectMounts } from '@abcnews/mount-utils';
import React from 'react';
import { render } from 'react-dom';
import './lib/theme.scss';
import Editor from './components/Editor';

whenDOMReady.then(() => render(<Editor />, selectMounts('lheditor')[0]));
