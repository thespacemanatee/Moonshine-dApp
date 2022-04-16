import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TransactionReceipt } from "web3-core";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import addDays from "date-fns/addDays";

import { useElection } from "@providers/index";
import { CreateElectionStepper, StepperControls } from "@components/molecules";
import { CandidateDetailsCard, ContractDetailsCard } from "@components/ui";

const EnterElectionDetails = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [electionName, setElectionName] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [transactionReceipt, setTransactionReceipt] =
    useState<TransactionReceipt>();

  const { createElection, electionInfo } = useElection();

  const handleCreate = async () => {
    const isValid = formRef.current?.reportValidity();
    if (isValid) {
      createElection(electionName, organisationName)
        .once("sending", () => {
          setIsSending(true);
        })
        .once("transactionHash", (hash: string) => {
          setTransactionHash(hash);
        })
        .then((receipt: TransactionReceipt) => {
          console.log("Election created! Receipt:", receipt);
          setTransactionReceipt(receipt);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsSending(false);
        });
    }
  };

  return (
    <form ref={formRef} className="flex w-1/2 flex-col">
      <div className="flex flex-col">
        <TextField
          label="Election Name"
          variant="outlined"
          required
          onChange={(e) => setElectionName(e.target.value)}
          className="min-w-fit"
        />
        <TextField
          label="Organisation Name"
          variant="outlined"
          required
          onChange={(e) => setOrganisationName(e.target.value)}
          className="mt-4 min-w-fit"
        />
      </div>
      <Button
        variant="outlined"
        disabled={
          isSending ||
          !!electionInfo?.electionName ||
          !!electionInfo?.organisationName
        }
        className="mt-16"
        onClick={handleCreate}
      >
        Create Election
      </Button>
    </form>
  );
};

const AddCandidates = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [candidateName, setCandidateName] = useState("");
  const [candidateSlogan, setCandidateSlogan] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [transactionReceipt, setTransactionReceipt] =
    useState<TransactionReceipt>();

  const { addCandidate, candidates } = useElection();

  const handleAddCandidate = () => {
    const isValid = formRef.current?.reportValidity();
    if (isValid) {
      addCandidate(candidateName, candidateSlogan)
        .once("sending", () => {
          console.log("sending");

          setIsSending(true);
        })
        .once("transactionHash", (hash: string) => {
          setTransactionHash(hash);
        })
        .then((receipt: TransactionReceipt) => {
          console.log("Election created! Receipt:", receipt);
          setTransactionReceipt(receipt);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsSending(false);
        });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <form ref={formRef}>
        <div className="flex flex-col">
          <TextField
            label="Candidate Name"
            variant="outlined"
            required
            onChange={(e) => setCandidateName(e.target.value)}
            className="min-w-fit"
          />
          <TextField
            label="Candidate Slogan"
            variant="outlined"
            required
            onChange={(e) => setCandidateSlogan(e.target.value)}
            className="mt-4 min-w-fit"
          />
        </div>
        <Button
          variant="outlined"
          className="mt-16 w-full"
          onClick={handleAddCandidate}
          disabled={isSending}
        >
          Add Candidate
        </Button>
      </form>
      <div>
        <Typography variant="h6" gutterBottom>
          {`Candidates: ${candidates.length}`}
        </Typography>
        <motion.div layout className="max-h-80 overflow-scroll">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="px-4 py-2">
              <CandidateDetailsCard
                candidateName={candidate.candidateName}
                slogan={candidate.slogan}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
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
    <div className="w-1/2">
      <div className="min-w-fit">
        <DateTimePicker
          label="Election Start"
          value={startDate}
          onChange={onStartDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </div>
      <div className="mt-4 min-w-fit">
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
  const [isDisabled, setIsDisabled] = useState(false);

  const { electionInfo, candidates } = useElection();

  useEffect(() => {
    if (electionInfo?.electionName) {
      setActiveStep(1);
    } else {
    }
  }, [electionInfo?.electionName]);

  useEffect(() => {
    switch (activeStep) {
      case 0: {
        setIsDisabled(!electionInfo?.electionName);
        return;
      }
      case 1: {
        setIsDisabled(candidates.length < 2);
        return;
      }
      default: {
        setIsDisabled(false);
      }
    }
  }, [activeStep, candidates.length, electionInfo?.electionName]);

  return (
    <div className="flex flex-1 flex-col">
      <ContractDetailsCard />
      <div className="my-12">
        <CreateElectionStepper activeStep={activeStep} />
      </div>
      <div className="flex flex-1 flex-col">
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
        disabled={isDisabled}
      />
    </div>
  );
};

export default AdminElectionContainer;
