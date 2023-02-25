type ScoreDTO = {
  name: string;
  date: number;
  score: number;
}

type UserData = Omit<ScoreDTO, 'date'>;