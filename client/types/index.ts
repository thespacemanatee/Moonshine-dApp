export type ElectionInfo = {
  electionName: string;
  organisationName: string;
  isInitialized: boolean;
};

export type ElectionStatus = {
  startTime: Date;
  endTime: Date;
  isTerminated: boolean;
};

export enum ElectionProgress {
  NotCreated = "Not Created",
  NotStarted = "Not Started",
  InProgress = "In Progress",
  Ended = "Ended",
}

export type CandidateInfo = {
  id: number;
  candidateName: string;
  slogan: string;
  voteCount: number;
};
