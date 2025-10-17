import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

// SuccessPage component
const CancelMessage: React.FC = () => {
  const navigate = useNavigate();

  // Handler function to navigate the user to the dashboard
  const handleGoToDashboard = () => {
    navigate("/dashboard/subscription");
  };
  const handleContactSalesClick = () => {
    window.open("https://contact", "_blank");
  };

  return (
    <>
      <Typography
        variant="body2"
        sx={{
          width: "350px",
          color: "var(--Text-Secondary, #637381)",
          fontFamily: "Public Sans, sans-serif",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "22px",
          alignContent: "left"
          // marginBottom: theme.spacing(3),
        }}
      >
        There was a problem processing your payment.<br/>Please try again or contact support.
      </Typography>
      <br />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between", // Align buttons next to each other
          width: "100%", // Ensure the container is the full width of the parent
        }}
      >
        {/* Pay Again button */}
        <LoadingButton
          size="small"
          variant="contained"
          color="primary"
          onClick={handleGoToDashboard}
          sx={{
            fontFamily: "Public Sans, sans-serif",
            fontSize: "15px",
            fontStyle: "normal",
            fontWeight: 700,
            borderRadius: 2,
            backgroundColor: "#00A5AA",
            color: "white",
            width: "48%", // Adjust width for each button to fit side by side
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
                backgroundColor: "#32B7BB !important", // Hover state color
              },
              "&:active, &:focus": {
                backgroundColor: "#008B8F !important", // Pressed state color
              },
          }}
        >
          Pay Again
        </LoadingButton>

        {/* Contact Support button */}
        <LoadingButton
          size="small"
          variant="contained"
          color="primary"
          onClick={handleContactSalesClick}
          sx={{
            fontFamily: "Public Sans, sans-serif",
            fontSize: "15px",
            fontStyle: "normal",
            fontWeight: 700,
            borderRadius: 2,
            backgroundColor: "#00A5AA",
            color: "white",
            width: "48%", // Adjust width for each button to fit side by side
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
                backgroundColor: "#32B7BB !important", // Hover state color
              },
              "&:active, &:focus": {
                backgroundColor: "#008B8F !important", // Pressed state color
              },
          }}
        >
          Contact Sales
        </LoadingButton>
      </Box>
    </>
  );
};

export default CancelMessage;
