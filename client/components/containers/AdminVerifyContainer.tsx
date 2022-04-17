import React, { useState } from "react";
import Lottie from "react-lottie-player";
import { TransactionReceipt } from "web3-core";

import { ContractDetailsCard } from "@components/ui";
import { RegTableDetails } from "@components/molecules";
import { useElection } from "@providers/index";

import emptyAnim from "../../public/empty.json";

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
      <div className="my-12 flex flex-col items-center">
        <RegTableDetails
          rows={voters}
          onVerifyClick={handleVerify}
          disableButtons={isSending}
        />
        {voters.length === 0 && (
          <Lottie loop animationData={emptyAnim} play className="h-64 w-64" />
        )}
      </div>
    </div>
  );
};

export default AdminVerifyContainer;
