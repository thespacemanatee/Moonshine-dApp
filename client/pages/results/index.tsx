import type { NextPage } from "next";
import Lottie from "react-lottie-player";

import { ResultContainer } from "@components/containers";
import { useWeb3 } from "@providers/index";

import loadingAnim from "../../public/loading.json";

const Results: NextPage = () => {
  const { isLoading, isAdmin } = useWeb3();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <Lottie loop animationData={loadingAnim} play className="h-32 w-32" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 justify-center">
      <div className="w-4/5 min-w-fit">
        <div className="my-12">
          <ResultContainer />
        </div>
      </div>
    </div>
  );
};
export default Results;
