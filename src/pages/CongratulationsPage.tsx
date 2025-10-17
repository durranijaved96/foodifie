import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom"; // Assuming you are using react-router for navigation
import HeaderLanding from "../layouts/dashboard/header/HeaderLanding";

const CongratulationsPage = () => {
  return (
    <>
      <HeaderLanding />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        gap={2}
        padding={2}
        borderRadius={4}
        border="1px solid var(--grey-300, #E0E0E0)"
        bgcolor="var(--primary-contrast, #FFF)"
        maxWidth={480}
        margin="auto"
        marginTop={10}
      >
        <Typography variant="h5" fontWeight={700} marginBottom={2}>
          Congratulations!
        </Typography>
        <Typography variant="body1" marginBottom={2}>
          You’ve successfully started the 14-days trial period.
          It ends on 14.02.2023. Enjoy exploring all the features during this trial.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
        >
          Go to sign in
        </Button>
      </Box>
    </>
  );
};

export default CongratulationsPage;
