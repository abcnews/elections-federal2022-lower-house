import { whenDOMReady } from '@abcnews/env-utils';
import { selectMounts } from '@abcnews/mount-utils';
import React from 'react';
import { render } from 'react-dom';
import './theme.scss';
import Editor from './components/Editor';

whenDOMReady.then(() => render(<Editor />, selectMounts('lheditor')[0]));
