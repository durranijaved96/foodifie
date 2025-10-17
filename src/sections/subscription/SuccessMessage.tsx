/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { supabase } from "../../supabase";

const SuccessPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Define checkAuthAndRedirect function
  const checkAuthAndRedirect = async () => {
    if (!supabase) {
      console.error("Supabase instance is not available.");
      return;
    }
    // Check if user is authenticated
    const { data: authData, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error checking authentication status:", error);
      return;
    }
    setIsAuthenticated(authData?.user !== null);
  };

  useEffect(() => {
    // Check authentication status on component mount
    checkAuthAndRedirect();

    // Add event listener for cross-tab communication
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      // Remove event listener on component unmount
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);

  // Function to handle changes in local storage (cross-tab communication)
  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === "authToken") {
      // If authentication token changes in local storage, recheck authentication status
      checkAuthAndRedirect();
    }
  };

  const handleGoToDashboard = async () => {
    // Check if user is authenticated before navigating to the dashboard
    if (isAuthenticated) {
      navigate("/dashboard/app");
    } else {
      // If user is not authenticated, redirect to login page
      navigate("/");
    }
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
        }}
      >
        Your transaction was successful. Enjoy the features of your new
        subscription!
      </Typography>
      <br />
      <LoadingButton
        size="small"
        variant="contained"
        color="primary"
        onClick={handleGoToDashboard}
        style={{
          fontFamily: "Public Sans, sans-serif",
          fontSize: "15px",
          fontStyle: "normal",
          fontWeight: 700,
          borderRadius: 8,
          backgroundColor: "#00A5AA",
          color: "white",
          width: "100%",
          textTransform: "none",
          boxShadow: "none",
        }}
      >
        Go to Dashboard
      </LoadingButton>
    </>
  );
};

export default SuccessPage;
