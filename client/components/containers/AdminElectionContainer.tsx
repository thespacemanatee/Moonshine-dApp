import React, { useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Button from "@mui/material/Button";
import addDays from "date-fns/addDays";

import { useElection } from "@providers/index";
import { CreateElectionStepper, StepperControls } from "@components/molecules";

const EnterElectionDetails = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [electionName, setElectionName] = useState("");
  const [organisationName, setOrganisationName] = useState("");

  const { createElection } = useElection();

  const handleCreate = () => {
    const isValid = formRef.current?.reportValidity();
    if (isValid) {
      createElection(electionName, organisationName);
    }
  };

  return (
    <form ref={formRef} className="flex flex-col">
      <div className="flex flex-1 flex-col">
        <TextField
          label="Election Name"
          variant="outlined"
          required
          onChange={(e) => setElectionName(e.target.value)}
          className="my-2 w-1/2 min-w-fit"
        />
        <TextField
          label="Organisation Name"
          variant="outlined"
          required
          onChange={(e) => setOrganisationName(e.target.value)}
          className="my-2 w-1/2 min-w-fit"
        />
      </div>
      <Button variant="outlined" className="mt-16" onClick={handleCreate}>
        Create Election
      </Button>
    </form>
  );
};

const AddCandidates = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [candidateName, setCandidateName] = useState("");
  const [candidateSlogan, setCandidateSlogan] = useState("");

  const handleAddCandidate = () => {};

  return (
    <form ref={formRef} className="flex flex-col">
      <div className="flex flex-1 flex-col">
        <TextField
          label="Candidate Name"
          variant="outlined"
          required
          onChange={(e) => setCandidateName(e.target.value)}
          className="my-2 w-1/2 min-w-fit"
        />
        <TextField
          label="Candidate Slogan"
          variant="outlined"
          required
          onChange={(e) => setCandidateSlogan(e.target.value)}
          className="my-2 w-1/2 min-w-fit"
        />
      </div>
      <Button variant="outlined" className="mt-16" onClick={handleAddCandidate}>
        Add Candidate
      </Button>
    </form>
  );
};

type StartElectionProps = {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (value: Date | null) => void;
  onEndDateChange: (value: Date | null) => void;
};

const StartElection = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: StartElectionProps) => {
  return (
    <div>
      <div className="my-2 w-1/2 min-w-fit">
        <DateTimePicker
          label="Election Start"
          value={startDate}
          onChange={onStartDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </div>
      <div className="my-4 w-1/2 min-w-fit">
        <DateTimePicker
          label="Election End"
          value={endDate}
          onChange={onEndDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </div>
    </div>
  );
};

const AdminElectionContainer = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(addDays(new Date(), 7));

  return (
    <div className="flex flex-1 flex-col">
      <CreateElectionStepper activeStep={activeStep} />
      <div className="my-12 flex flex-1 flex-col">
        {activeStep === 0 && <EnterElectionDetails />}
        {activeStep === 1 && <AddCandidates />}
        {activeStep === 2 && (
          <StartElection
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        )}
      </div>
      <StepperControls
        activeStep={activeStep}
        onActiveStepChange={setActiveStep}
      />
    </div>
  );
};

export default AdminElectionContainer;
