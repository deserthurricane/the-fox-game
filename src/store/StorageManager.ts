/**
 * Scores storage manager singleton
 */
export class ScoresManager {
  private static instance: ScoresManager;

  // Disable calling constructor from the outer code
  private constructor() {}

  static getInstance(): ScoresManager {
    if (!ScoresManager.instance) {
      ScoresManager.instance = new ScoresManager();
    }

    return ScoresManager.instance;
  }

  getScores(): ScoreDTO[] {
    try {
      const scores = localStorage.getItem('scores');
      return scores ? JSON.parse(scores) : [];
    } catch(error) {
      console.log(error);
      alert(`Error on getting scores`);
      return [];
    }
  }

  addScore(newScore: ScoreDTO): void {
    try {
      const scores = this.getScores();
      scores.push(newScore);
      localStorage.setItem('scores', JSON.stringify(scores));
    } catch(error) {
      alert(`Error on adding new score`);
    }
  }
}