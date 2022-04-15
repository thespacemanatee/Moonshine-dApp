import type { NextPage } from "next";

import { WalletDetailsCard } from "@components/ui";

const Home: NextPage = () => {
  return (
    <div className="flex flex-1 justify-center py-16">
      <div className="w-4/5 min-w-fit">
        <WalletDetailsCard />
      </div>
    </div>
  );
};

export default Home;
