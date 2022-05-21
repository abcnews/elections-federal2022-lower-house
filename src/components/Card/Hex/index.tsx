import React from 'react';
import { Allocation, NoYes } from '../../../lib/constants';
import styles from './styles.scss';

interface HexProps {
  allocation?: Allocation;
  certainty?: NoYes;
}

const Hex: React.FC<HexProps> = ({ allocation, certainty }) => (
  <div className={styles.root} data-allocation={allocation || undefined} data-certainty={certainty || undefined}>
    <svg viewBox="0 0 51.3012701892 58">
      <g transform="translate(4 4)">
        <polygon points="0,37.5 21.65,50 43.3,37.5 43.3,12.5 21.65,0 0,12.5 0,37.5"></polygon>
      </g>
    </svg>
  </div>
);

export default Hex;
