import type { NextPage } from "next";

import { WalletDetailsCard } from "@components/ui";
import { AdminElectionContainer } from "@components/containers";
import { useWeb3 } from "@providers/index";

const Home: NextPage = () => {
  const { isAdmin } = useWeb3();

  return (
    <div className="flex flex-1 justify-center py-16">
      <div className="w-4/5 min-w-fit">
        {isAdmin ? (
          <div className="my-12">
            <AdminElectionContainer />
          </div>
        ) : (
          <div>voter</div>
        )}
      </div>
    </div>
  );
};

export default Home;
