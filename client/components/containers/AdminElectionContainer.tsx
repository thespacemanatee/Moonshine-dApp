import React, { useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { useWeb3 } from "@providers/index";
import { CreateElectionStepper, StepperControls } from "@components/molecules";

const AdminElectionContainer = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [electionName, setElectionName] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const {} = useWeb3();

  const handleStartDateChange = (newValue: Date | null) => {
    setStartDate(newValue);
  };

  const handleEndDateChange = (newValue: Date | null) => {
    setEndDate(newValue);
  };

  return (
    <div className="flex flex-1 flex-col">
      <CreateElectionStepper activeStep={activeStep} />
      <form ref={formRef} className="my-12 flex flex-1 flex-col">
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
        <div className="my-2 w-1/2 min-w-fit">
          <DateTimePicker
            label="Election Start"
            value={startDate}
            onChange={handleStartDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
        <div className="my-2 w-1/2 min-w-fit">
          <DateTimePicker
            label="Election End"
            value={endDate}
            onChange={handleEndDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
      </form>
      <StepperControls
        ref={formRef}
        activeStep={activeStep}
        onActiveStepChange={setActiveStep}
      />
    </div>
  );
};

export default AdminElectionContainer;
