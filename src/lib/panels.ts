import type { PanelDefinition } from '@abcnews/scrollyteller';
import { ElectorateID, ELECTORATES, ELECTORATES_HELD_ALLOCATIONS } from './constants';
import { determineIfAllocationIsDefinitive } from './utils';
import blockStyles from '../components/Block/styles.scss';
import type { GraphicProps, PossiblyEncodedGraphicProps } from '../components/Graphic';

const SORTED_ELECTORATES = ELECTORATES.sort((a, b) => b.name.length - a.name.length);
const EMPHASISED_ELEMENTS_SELECTOR = 'strong,em,b,i';

export function applyColourToPanels(panels: PanelDefinition<PossiblyEncodedGraphicProps>[]) {
  const electorateIntroductionTracker: { [key: string]: boolean } = {};

  panels.forEach(({ data, nodes }) => {
    const elements = nodes.filter(node => node.nodeType === Node.ELEMENT_NODE) as Element[];
    const emphasisedElements = elements.reduce(
      (memo, element) => memo.concat(Array.from(element.querySelectorAll(EMPHASISED_ELEMENTS_SELECTOR))),
      [] as Element[]
    );
    const textNodes = emphasisedElements.reduce((memo, node) => memo.concat(textNodesUnder(node)), [] as Node[]);
    // const textNodes = nodes.reduce((memo, node) => memo.concat(textNodesUnder(node)), [] as Node[]);

    textNodes.forEach(node => {
      let text = node.textContent || '';

      SORTED_ELECTORATES.forEach(({ name }) => {
        const index = text.indexOf(name);
        if (index > -1 && text[index - 1] !== '|' && text[index + name.length] !== '|') {
          text = text.replace(name, `|||${name}|||`);
        }
      });

      if (text === node.textContent) {
        return;
      }

      const parentEl = node.parentElement;

      if (!parentEl) {
        return;
      }

      text.split('|||').forEach((part, index) => {
        const partTextNode = document.createTextNode(part);

        if (!(index % 2)) {
          return parentEl.insertBefore(partTextNode, node);
        }

        const electorate = ELECTORATES.find(({ name }) => name === part);

        if (!electorate) {
          return parentEl.insertBefore(partTextNode, node);
        }

        const partWrapperNode = document.createElement('span');
        const electorateID = ElectorateID[electorate.id];
        const { allocations, certainties } = data as GraphicProps;
        const allocation = allocations && allocations[electorateID];
        const hasDefinitiveAllocation = allocation && determineIfAllocationIsDefinitive(allocation);
        const certainty = certainties && certainties[electorateID];

        if (!electorateIntroductionTracker[electorateID]) {
          electorateIntroductionTracker[electorateID] = true;
          partWrapperNode.setAttribute('data-is-first-encounter', '');
        }

        if (allocation) {
          partWrapperNode.setAttribute('data-allocation', allocation);
        }

        if (hasDefinitiveAllocation) {
          partWrapperNode.setAttribute('data-has-definitive-allocation', '');
        }

        if (certainty) {
          partWrapperNode.setAttribute('data-certainty', certainty);
        }

        partWrapperNode.setAttribute('data-electorate', electorateID);
        partWrapperNode.className = blockStyles.electorate;
        partWrapperNode.appendChild(partTextNode);
        parentEl.insertBefore(partWrapperNode, node);
      });

      parentEl.removeChild(node);
    });
  });
}

function textNodesUnder(node: Node) {
  const textNodes: Node[] = [];
  const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
  let textNode: Node | null;

  while ((textNode = walk.nextNode())) {
    textNodes.push(textNode);
  }

  return textNodes;
}
