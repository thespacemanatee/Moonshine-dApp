import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import { VoterInfo } from "types";

type RegTableDetailProps = {
  rows: VoterInfo[];
  onVerifyClick: (address: string) => void;
  disableButtons?: boolean;
};

const RegTableDetail = ({
  rows,
  onVerifyClick,
  disableButtons,
}: RegTableDetailProps) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 300 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Account Address</TableCell>
            <TableCell align="right">Registered</TableCell>
            <TableCell align="right">Verified</TableCell>
            <TableCell align="right">Voted</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.address}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.address}
              </TableCell>
              <TableCell align="right">
                {row.isRegistered ? "True" : "False"}
              </TableCell>
              <TableCell align="right">
                {row.isVerified ? "True" : "False"}
              </TableCell>
              <TableCell align="right">
                {row.hasVoted ? "True" : "False"}
              </TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  disabled={row.isVerified || disableButtons}
                  onClick={() => {
                    onVerifyClick(row.address);
                  }}
                >
                  Verify
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RegTableDetail;
