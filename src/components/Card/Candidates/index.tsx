import React from 'react';
import { Allocation } from '../../../lib/constants';
import type { Candidate, LiveResultsElectorate } from '../../../lib/data';
import Hex from '../Hex';
import styles from './styles.scss';

const MIN_PCT = 15;

interface CandidateView {
  party: Allocation;
  pct: number;
}

interface CandidatesProps {
  result: LiveResultsElectorate;
  is2CP: boolean;
}

const Candidates: React.FC<CandidatesProps> = ({ is2CP, result }) => {
  const { leadingCandidate, runners, trailingCandidate } = result;

  if (!leadingCandidate) {
    return (
      <div className={styles.root}>
        <em>Too early for results</em>
      </div>
    );
  }

  const has2CP = !!(trailingCandidate && trailingCandidate.simple2CP);

  const shortlistedCandidates = (is2CP && has2CP
    ? [leadingCandidate, trailingCandidate]
    : [...runners].sort((a, b) => b.simple.votes - a.simple.votes).slice(0, 3)) as Candidate[];

  const candidatesViews = shortlistedCandidates.map(
    candidate =>
      ({
        party: candidate.party.code,
        pct: parseFloat(
          (is2CP && candidate.simple2CP
            ? candidate.predicted2CP || candidate.simple2CP
            : candidate.predicted || candidate.simple
          ).pct
        )
      } as CandidateView)
  );

  if (!is2CP && candidatesViews.length > 2 && candidatesViews[2].pct < MIN_PCT) {
    candidatesViews.pop();
  }

  return (
    <div className={styles.root}>
      {candidatesViews.map((candidateView, index) => {
        return (
          <div key={index} className={styles.candidate}>
            <Hex allocation={Allocation[candidateView.party] || Allocation.OTH} />
            <strong>{candidateView.party}</strong>
            <span>{`${candidateView.pct}%`}</span>
          </div>
        );
      })}{' '}
      {/* {is2CP && has2CP && <strong>(2PP)</strong>} */}
    </div>
  );
};

export default Candidates;
