export type ElectionInfo = {
  electionName: string;
  organisationName: string;
  isInitialized: boolean;
};

export type CandidateInfo = {
  id: number;
  candidateName: string;
  slogan: string;
  voteCount: number;
};
