import React, { useEffect, useState } from "react";

import { useElection } from "@providers/index";
import { ContractDetailsCard } from "@components/ui";

const AdminVerifyContainer = () => {
  const [activeStep, setActiveStep] = useState(0);

  const { electionInfo, candidates } = useElection();

  useEffect(() => {
    if (electionInfo?.isInitialized) {
      setActiveStep(1);
    }
  }, [electionInfo?.isInitialized]);

  return (
    <div className="flex flex-1 flex-col">
      <ContractDetailsCard />
      <div className="flex flex-1 flex-col"></div>
    </div>
  );
};

export default AdminVerifyContainer;
