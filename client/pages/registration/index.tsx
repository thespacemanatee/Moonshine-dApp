import { Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import RegTableDetail from "./RegTableDetails";

export type TableData = {
    accountAddr: string,
    name: string,
    phone: number,
    registered: boolean,
    verified: boolean,
    voted: boolean
}

export const Registration = () => {
  const isDetailsValid = true; //voter can only submit a registration request if details are in valid format

  const rows: TableData[] = [
      {accountAddr: "carey", 
      name: "0x1111", 
      phone: 81016335, 
      registered: false, 
      verified: true, 
      voted: true} //replace these values with Provider values
  ];

  return (
    <div>
      <div>
        <TextField id="acc-addr" label="Account Address" variant="outlined" />
        <TextField id="name" label="Name" variant="outlined" />
        <TextField id="phone-no" label="Phone Number" variant="outlined" />
        <Button variant="outlined" disabled={isDetailsValid}>
          Register
        </Button>
      </div>

      <div>
        <RegTableDetail rows={rows} />
      </div>
    </div>
  );
};
