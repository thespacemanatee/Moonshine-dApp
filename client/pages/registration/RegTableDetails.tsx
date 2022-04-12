import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableData } from ".";

export default function RegTableDetail({ rows }: { rows: TableData[] }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 300 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Account Addr</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Phone Number</TableCell>
            <TableCell align="right">Registered</TableCell>
            <TableCell align="right">Verified</TableCell>
            <TableCell align="right">Voted</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.accountAddr}
              </TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.phone}</TableCell>
              <TableCell align="right">
                {row.registered ? "True" : "False"}
              </TableCell>
              <TableCell align="right">
                {row.verified ? "True" : "False"}
              </TableCell>
              <TableCell align="right">
                {row.voted ? "True" : "False"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
