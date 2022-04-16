import React, { useState } from "react";
import { TransactionReceipt } from "web3-core";

import { ContractDetailsCard } from "@components/ui";
import { RegTableDetails } from "@components/molecules";
import { useElection } from "@providers/index";

const AdminVerifyContainer = () => {
  const [isSending, setIsSending] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [transactionReceipt, setTransactionReceipt] =
    useState<TransactionReceipt>();

  const { voters, verifyVoter } = useElection();

  const handleVerify = (address: string) => {
    verifyVoter(address)
      .once("sending", () => {
        setIsSending(true);
      })
      .once("transactionHash", (hash: string) => {
        setTransactionHash(hash);
      })
      .then((receipt: TransactionReceipt) => {
        console.log("Voter verified! Receipt:", receipt);
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
    <div className="flex flex-1 flex-col">
      <ContractDetailsCard />
      <div className="my-12">
        <RegTableDetails
          rows={voters}
          onVerifyClick={handleVerify}
          disableButtons={isSending}
        />
      </div>
    </div>
  );
};

export default AdminVerifyContainer;
