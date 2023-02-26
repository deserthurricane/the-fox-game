import { useMemo } from 'react';

import './styles.css';

type ScoreboardComponentProps = {
  scores: ScoreDTO[];
};

export function ScoreboardComponent({ scores }: ScoreboardComponentProps) {
  const ScoresRows = useMemo(() => {
    return scores.map(({ name, date, score }, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{name}</td>
        <td>
          {new Date(date).getFullYear()},&nbsp;
          {new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </td>
        <td>{score}</td>
      </tr>
    ));
  }, [scores]);

  return (
    <table className="scores_table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>Date</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>{ScoresRows}</tbody>
    </table>
  );
}
