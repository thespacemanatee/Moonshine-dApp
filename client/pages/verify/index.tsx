import type { NextPage } from "next";

import { AdminVerifyContainer } from "@components/containers";

const Verify: NextPage = () => {
  return (
    <div className="flex justify-center">
      <div className="w-3/5 min-w-fit p-8">
        <AdminVerifyContainer />
      </div>
    </div>
  );
};

export default Verify;
