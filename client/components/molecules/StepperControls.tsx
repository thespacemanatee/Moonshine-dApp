import React, { forwardRef, MutableRefObject, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { ELECTION_STEPS } from "@components/molecules";

type StepperControlsProps = {
  activeStep: number;
  onActiveStepChange: (step: number) => void;
};

const StepperControls = forwardRef<HTMLFormElement, StepperControlsProps>(
  ({ activeStep, onActiveStepChange }: StepperControlsProps, ref) => {
    const [skipped, setSkipped] = useState(new Set<number>());

    const handleNext = () => {
      const isValid = (
        ref as MutableRefObject<HTMLFormElement>
      )?.current.reportValidity();
      if (!isValid) return;

      onActiveStepChange(activeStep + 1);
    };

    const handleBack = () => {
      onActiveStepChange(activeStep - 1);
    };

    const handleReset = () => {
      onActiveStepChange(0);
    };

    return (
      <div>
        {activeStep === ELECTION_STEPS.length ? (
          <>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleNext}>
              {activeStep === ELECTION_STEPS.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        )}
      </div>
    );
  }
);

StepperControls.displayName = "StepperControls";

export default StepperControls;
