import React, { forwardRef, MutableRefObject, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { ELECTION_STEPS } from "@components/molecules";

type StepperControlsProps = {
  activeStep: number;
  optionalSteps?: number[];
  onActiveStepChange: (step: number) => void;
};

const StepperControls = forwardRef<HTMLFormElement, StepperControlsProps>(
  (
    { activeStep, optionalSteps, onActiveStepChange }: StepperControlsProps,
    ref
  ) => {
    const [skipped, setSkipped] = useState(new Set<number>());

    const isStepOptional = (step: number) => {
      return optionalSteps?.indexOf(step) === -1;
    };

    const isStepSkipped = (step: number) => {
      return skipped.has(step);
    };

    const handleNext = () => {
      const isValid = (
        ref as MutableRefObject<HTMLFormElement>
      )?.current.reportValidity();
      if (!isValid) return;
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }

      onActiveStepChange(activeStep + 1);
      setSkipped(newSkipped);
    };

    const handleBack = () => {
      onActiveStepChange(activeStep - 1);
    };

    const handleSkip = () => {
      if (!isStepOptional(activeStep)) {
        // You probably want to guard against something like this,
        // it should never occur unless someone's actively trying to break something.
        throw new Error("You can't skip a step that isn't optional.");
      }

      onActiveStepChange(activeStep + 1);
      setSkipped((prevSkipped) => {
        const newSkipped = new Set(prevSkipped.values());
        newSkipped.add(activeStep);
        return newSkipped;
      });
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
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}
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
