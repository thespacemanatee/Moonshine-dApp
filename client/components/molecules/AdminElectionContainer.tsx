import React from "react";
import { Card, CardContent, TextField, Typography } from "@mui/material";

import { useWeb3 } from "@providers/index";

const AdminElectionContainer = () => {
  const {} = useWeb3();

  return (
    <div className="flex flex-1 flex-col">
      <Typography className="text-2xl" gutterBottom>
        Election Details
      </Typography>
      <TextField
        label="Election Name"
        variant="outlined"
        className="my-2 w-1/2 min-w-fit"
      />
      <TextField
        label="Organisation Name"
        variant="outlined"
        className="my-2 w-1/2 min-w-fit"
      />
    </div>
  );
};

export default AdminElectionContainer;
