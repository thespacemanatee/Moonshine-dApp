import type { NextPage } from "next";
import Container from "@mui/material/Container";

import { AdminVerifyContainer } from "@components/containers";

const Verify: NextPage = () => {
  return (
    <Container maxWidth="xl" className="p-8">
      <AdminVerifyContainer />
    </Container>
  );
};

export default Verify;
