import 'regenerator-runtime/runtime';
import acto from '@abcnews/alternating-case-to-object';
import { getGeneration, GENERATIONS, getTier, TIERS } from '@abcnews/env-utils';
import { getMountValue, isMount, selectMounts } from '@abcnews/mount-utils';
import type { ScrollytellerDefinition } from '@abcnews/scrollyteller';
import { loadScrollyteller } from '@abcnews/scrollyteller';
import React from 'react';
import { render } from 'react-dom';
import './lib/theme.scss';
import { applyColourToPanels } from './lib/panels';
import { alternatingCaseToGraphicProps, decoders } from './lib/utils';
import Block from './components/Block';
import type { GraphicProps, PossiblyEncodedGraphicProps } from './components/Graphic';
import Graphic from './components/Graphic';
import Illustration, { IllustrationName } from './components/Illustration';

export type OdysseySchedulerClient = {
  hasChanged: boolean;
  fixedHeight: number;
};

export type OdysseySchedulerSubscriber = (client: OdysseySchedulerClient) => void;

type OdysseyAPI = {
  scheduler: {
    subscribe: (subscriber: OdysseySchedulerSubscriber) => void;
    unsubscribe: (subscriber: OdysseySchedulerSubscriber) => void;
  };
  utils: {
    dom: {
      detach: (el: Element) => void;
    };
  };
};

declare global {
  interface Window {
    __ODYSSEY__: OdysseyAPI;
  }
}

const whenEnvReady = new Promise<void>(resolve =>
  getGeneration() !== GENERATIONS.P1
    ? resolve()
    : import(/* webpackChunkName: "env" */ './polyfills').then(() => resolve())
);

const whenOdysseyLoaded = new Promise(resolve =>
  whenEnvReady.then(() =>
    window.__ODYSSEY__
      ? resolve(window.__ODYSSEY__)
      : window.addEventListener('odyssey:api', () => resolve(window.__ODYSSEY__))
  )
);

const whenScrollytellersLoaded = new Promise((resolve, reject) =>
  whenOdysseyLoaded.then(odyssey => {
    const names = selectMounts('scrollytellerNAME', { markAsUsed: false })
      .map(mountEl => (getMountValue(mountEl).match(/NAME([a-z]+)/) || [])[1])
      .filter(name => typeof name === 'string');
    const scrollytellerDefinitions: ScrollytellerDefinition<PossiblyEncodedGraphicProps>[] = [];

    for (const name of names) {
      let scrollytellerDefinition: ScrollytellerDefinition<PossiblyEncodedGraphicProps>;

      try {
        scrollytellerDefinition = loadScrollyteller(name, 'u-full');

        // Decode encoded props
        scrollytellerDefinition.panels.forEach(({ data }) => {
          Object.keys(decoders).forEach(key => {
            data[key] = decoders[key]((data[key] as string) || '');
          });

          if (typeof data.layout === 'number') {
            data.layout = String(data.layout);
          }
        });

        // Upgrade scrollyteller' content to show coloured electorate names
        applyColourToPanels(scrollytellerDefinition.panels);
      } catch (err) {
        return reject(err);
      }

      // Keep the DOM tidy.
      if (scrollytellerDefinition && scrollytellerDefinition.mountNode) {
        while (isMount(scrollytellerDefinition.mountNode.nextElementSibling)) {
          (odyssey as OdysseyAPI).utils.dom.detach(scrollytellerDefinition.mountNode.nextElementSibling);
        }
      }

      scrollytellerDefinitions.push(scrollytellerDefinition);
    }

    // Return scrollyteller definitions
    resolve(scrollytellerDefinitions);
  })
);

whenScrollytellersLoaded.then(scrollytellerDefinitions => {
  (scrollytellerDefinitions as ScrollytellerDefinition<GraphicProps>[]).forEach(scrollytellerDefinition =>
    render(<Block panels={scrollytellerDefinition.panels} />, scrollytellerDefinition.mountNode)
  );
});

whenOdysseyLoaded.then(() => {
  const illustrationMounts = selectMounts('lhillustration');

  illustrationMounts.forEach(mount => {
    const parentEl = mount.parentElement;

    if (!parentEl) {
      return;
    }

    const { name } = acto(getMountValue(mount)) as { name: IllustrationName };

    if (name && !Object.values(IllustrationName).includes(name)) {
      return;
    }

    const titleEl = parentEl.querySelector('h1');

    if (titleEl && titleEl.parentElement === parentEl) {
      mount.removeAttribute('class');
      parentEl.insertBefore(mount, titleEl);
    }

    render(<Illustration name={name} />, mount);
  });

  const graphicMounts = selectMounts('lhgraphic');

  graphicMounts.forEach(mount => {
    const graphicProps = alternatingCaseToGraphicProps(getMountValue(mount)) as GraphicProps;

    mount.classList.add('u-pull');
    render(<Graphic {...graphicProps} />, mount);
  });

  // Fallback exporter

  if (getTier() === TIERS.PREVIEW) {
    const titleEl = document.querySelector('.Header h1');

    if (titleEl) {
      (titleEl as HTMLElement).style.cursor = 'copy';
      titleEl.addEventListener('click', () => {
        import(/* webpackChunkName: "fallbacks" */ './fallbacks').then(module => module.default(titleEl, null));
      });
    }
  }
});
