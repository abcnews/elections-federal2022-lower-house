import type { PanelDefinition } from '@abcnews/scrollyteller';
import { Allocation, ElectorateID, ELECTORATES, ELECTORATES_HELD_ALLOCATIONS } from './constants';
import { determineIfAllocationIsDefinitive } from './utils';
import blockStyles from '../components/Block/styles.scss';
import type { GraphicProps, PossiblyEncodedGraphicProps } from '../components/Graphic';

const PARTIES_ALLOCATIONS = {
  Coalition: Allocation.LIB,
  'L/NP': Allocation.LIB,
  Labor: Allocation.ALP,
  'Liberal Party': Allocation.LIB,
  Liberals: Allocation.LIB,
  Liberal: Allocation.LIB,
  'Country Liberals': Allocation.CLP,
  'Country Liberal': Allocation.CLP,
  'National Party': Allocation.NAT,
  Nationals: Allocation.NAT,
  National: Allocation.NAT,
  Greens: Allocation.GRN,
  Green: Allocation.GRN,
  'One Nation': Allocation.ONP,
  'United Australia': Allocation.UAP,
  'Center Alliance': Allocation.KAP,
  Katter: Allocation.KAP,
  'teal Independents': Allocation.Teal,
  'teal independents': Allocation.Teal,
  'teal Independent': Allocation.Teal,
  'teal independent': Allocation.Teal,
  Independents: Allocation.IND,
  independents: Allocation.IND,
  Independent: Allocation.IND,
  independent: Allocation.IND,
  CA: Allocation.CA,
  CLP: Allocation.CLP,
  GRN: Allocation.GRN,
  IND: Allocation.IND,
  KAP: Allocation.KAP,
  LIB: Allocation.LIB,
  LNP: Allocation.LNP,
  ONP: Allocation.ONP,
  UAP: Allocation.UAP
};
const SORTED_PARTIES = Object.keys(PARTIES_ALLOCATIONS).sort((a, b) => b.length - a.length);
const SORTED_ELECTORATES = ELECTORATES.sort((a, b) => b.name.length - a.name.length);
const EMPHASISED_ELEMENTS_SELECTOR = 'strong,em,b,i';

export function applyColourToPanels(panels: PanelDefinition<PossiblyEncodedGraphicProps>[]) {
  panels.forEach(({ data, nodes }) => {
    const elements = nodes.filter(node => node.nodeType === Node.ELEMENT_NODE) as Element[];
    const emphasisedElements = elements.reduce(
      (memo, element) => memo.concat(Array.from(element.querySelectorAll(EMPHASISED_ELEMENTS_SELECTOR))),
      [] as Element[]
    );

    applyColourToElectorates(emphasisedElements, data);
    applyColorToParties(emphasisedElements);
  });
}

export function applyColourToElectorates(emphasisedElements: Element[], data: PossiblyEncodedGraphicProps) {
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
}

export function applyColorToParties(emphasisedElements: Element[]) {
  const textNodes = emphasisedElements.reduce((memo, node) => memo.concat(textNodesUnder(node)), [] as Node[]);

  textNodes.forEach(node => {
    let text = node.textContent || '';

    SORTED_PARTIES.forEach(name => {
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

      const partyName = SORTED_PARTIES.find(name => name === part);

      if (!partyName) {
        return parentEl.insertBefore(partTextNode, node);
      }

      const partWrapperNode = document.createElement('span');
      const allocation = PARTIES_ALLOCATIONS[partyName];

      partWrapperNode.setAttribute('data-allocation', allocation);
      partWrapperNode.className = blockStyles.party;
      partWrapperNode.appendChild(partTextNode);
      parentEl.insertBefore(partWrapperNode, node);
    });

    parentEl.removeChild(node);
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
