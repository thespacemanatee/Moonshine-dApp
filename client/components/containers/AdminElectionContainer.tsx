import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TransactionReceipt } from "web3-core";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import addDays from "date-fns/addDays";
import { getUnixTime } from "date-fns";

import { useElection } from "@providers/index";
import { CreateElectionStepper, StepperControls } from "@components/molecules";
import {
  CandidateDetailsCard,
  ContractDetailsCard,
  ElectionDetailsCard,
} from "@components/ui";
import { ElectionProgress } from "types";

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
    <form ref={formRef} className="flex flex-col items-center">
      <TextField
        label="Election Name"
        variant="outlined"
        required
        onChange={(e) => setElectionName(e.target.value)}
        className="w-1/2 min-w-fit"
      />
      <TextField
        label="Organisation Name"
        variant="outlined"
        required
        onChange={(e) => setOrganisationName(e.target.value)}
        className="mt-4 w-1/2 min-w-fit"
      />
      <Button
        variant="outlined"
        disabled={isSending || electionInfo?.isInitialized}
        className="m-4"
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
          setIsSending(true);
        })
        .once("transactionHash", (hash: string) => {
          setTransactionHash(hash);
        })
        .then((receipt: TransactionReceipt) => {
          console.log("Candidate added! Receipt:", receipt);
          setTransactionReceipt(receipt);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsSending(false);
          setCandidateName("");
          setCandidateSlogan("");
        });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <form ref={formRef} className="flex flex-col items-center">
        <TextField
          label="Candidate Name"
          variant="outlined"
          required
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          className="w-full"
        />
        <TextField
          label="Candidate Slogan"
          variant="outlined"
          required
          value={candidateSlogan}
          onChange={(e) => setCandidateSlogan(e.target.value)}
          className="mt-4 w-full"
        />
        <Button
          variant="outlined"
          className="m-4"
          onClick={handleAddCandidate}
          disabled={isSending}
        >
          Add Candidate
        </Button>
      </form>
      <div>
        <Typography variant="h6" gutterBottom className="px-4">
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

const StartElection = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(addDays(new Date(), 7));
  const [isSending, setIsSending] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [transactionReceipt, setTransactionReceipt] =
    useState<TransactionReceipt>();

  const { startElection, electionProgress } = useElection();

  const handleStartElection = () => {
    if (!startDate || !endDate) {
      return;
    }
    startElection(getUnixTime(startDate), getUnixTime(endDate))
      .once("sending", () => {
        setIsSending(true);
      })
      .once("transactionHash", (hash: string) => {
        setTransactionHash(hash);
      })
      .then((receipt: TransactionReceipt) => {
        console.log("Election started! Receipt:", receipt);
        setTransactionReceipt(receipt);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-1/2 flex-col">
        <DateTimePicker
          label="Election Start"
          value={startDate}
          onChange={setStartDate}
          renderInput={(params) => <TextField {...params} />}
        />
        <DateTimePicker
          label="Election End"
          value={endDate}
          onChange={setEndDate}
          renderInput={(params) => <TextField className="mt-4" {...params} />}
        />
      </div>
      <Button
        variant="outlined"
        className="m-4"
        onClick={handleStartElection}
        disabled={
          isSending ||
          electionProgress === ElectionProgress.InProgress ||
          electionProgress === ElectionProgress.Ended
        }
      >
        Start Election
      </Button>
    </div>
  );
};

const AdminElectionContainer = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  const { electionInfo, electionStatus, candidates } = useElection();

  useEffect(() => {
    if (electionInfo?.isInitialized) {
      setActiveStep(1);
    }
  }, [electionInfo?.isInitialized]);

  useEffect(() => {
    switch (activeStep) {
      case 0: {
        setIsDisabled(!electionInfo?.isInitialized);
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
  }, [activeStep, candidates.length, electionInfo?.isInitialized]);

  return (
    <div className="flex flex-1 flex-col">
      <ContractDetailsCard />
      <div className="mt-12 w-1/2 self-center">
        <ElectionDetailsCard />
      </div>
      <div className="my-12">
        <CreateElectionStepper activeStep={activeStep} />
      </div>
      <div>
        {activeStep === 0 && <EnterElectionDetails />}
        {activeStep === 1 && <AddCandidates />}
        {activeStep === 2 && <StartElection />}
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
