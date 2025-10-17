/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Stack,
  IconButton,
  TextField,
  Typography,
  Box,
  Dialog,
  DialogContent,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { styled } from "@mui/material/styles";
import EmailIcon from "../../../assets/images/email.png";
import {
  Link as RouterLink,
  redirect,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { supabase } from "../../../supabase";
import jwt from "jsonwebtoken"; // Import jsonwebtoken library
import { red } from "@mui/material/colors";
import { t } from "i18next";

const StyledTextField = styled(TextField)(({ theme, error }) => ({
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "#212B36", // Change border color on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "#212B36", // Change border color when focused
    },
    borderRadius: theme.spacing(1),
  },
  "& .MuiInputLabel-root": {
    color: error ? "#D32F2F" : "#919EAB", // Updated color for input label based on error state
    "&.Mui-focused": {
      color: error ? "#D32F2F" : "#212B36", // Updated color for input label when focused based on error state
    },
  },
  "& .MuiOutlinedInput-input": {
    "&::placeholder": {
      color: error ? "#D32F2F" : "#919EAB", // Updated color for placeholder
    },
    color: error ? "#D32F2F" : undefined, // Set text color to error color if there's an error
  },
  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    borderColor: "#D32F2F !important", // Change border color when there's an error
  },
}));

const StyledIconButton = styled(IconButton)({
  marginLeft: "-12px",
});

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const accessToken = queryParams.get("access_token");
  const hash = queryParams.get("hash");
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleResetPasswordDialog = () => {
    setOpenDialog(false);
    navigate("/resetpassword"); // Navigate to the reset password page
  };
  const handleSignUpDialog = () => {
    setOpenDialog(false);
    navigate("/signup"); // Navigate to the reset password page
  };
  const handleSignInDialog = () => {
    setOpenDialog(false);
    navigate("/"); // Navigate to the reset password page
  };
 
const handleSendRequest = async () => {
  setIsLoading(true);
  try {
    if (supabase) {
      // Construct the new URL without the access token and other parameters
     //const redirectUrl = `https://www.beta.com/newpassword`;
      //console.log("Reset Password Link:", redirectUrl);
      const { error } = await supabase.auth.resetPasswordForEmail(
        email,
     // { redirectTo: redirectUrl }
      );
      if (error) {
        throw error;
      }
      setOpenDialog(true);
    }
  } catch (error: any) {
    console.error("Error sending password reset request:", error.message);
    navigate("/resetpassword");
  } finally {
    setIsLoading(false);
  }
};


  const removeAccessTokenFromUrl = () => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    url.hash = ""; // Clear the hash portion of the URL
    return url.toString();
  };

  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 2,
      }}
    >
      <Typography
        sx={{
          width: 337,
          color: "var(--Text-Secondary, #637381)",
          fontFamily: "Public Sans, sans-serif",
          fontSize: 14,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "22px",
          textAlign: "left",
        }}
      >
       {t("reset-password-form.reset-password-text")}
      </Typography>
      <StyledTextField
        name="email"
        label= {t("signup-form.signup-email")}
        variant="outlined"
        sx={{
          width: 337,
        }}
        value={email}
        onChange={handleEmailChange}
      />
      <LoadingButton
        size="large"
        type="submit"
        variant="contained"
        loading={isLoading}
        style={{
          borderRadius: 8,
          backgroundColor: "#00A5AA",
          color: "white",
          width: "100%",
          textTransform: "none",
          boxShadow: "none", // Remove the shadow
        }}
        sx={{
          "&:hover": {
            backgroundColor: "#32B7BB !important", // Hover state color
          },
          "&:active, &:focus": {
            backgroundColor: "#008B8F !important", // Pressed state color
          },
        }}
        onClick={handleSendRequest} // Add onClick handler
      >
        <span
          style={{
            flex: 1,
            color: "var(--Components-Button-Contained-Inherit-Text, #FFF)", // Text color from Figma
            textAlign: "center",
            fontFamily: "Public Sans, sans-serif",
            fontSize: "15px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "26px",
          }}
        >
           {t("reset-password-form.reset-password-button")}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M9.99981 19C9.76616 19.0005 9.53972 18.9191 9.35981 18.77C9.1553 18.6005 9.02666 18.3565 9.00227 18.092C8.97788 17.8274 9.05975 17.5641 9.22981 17.36L13.7098 12L9.38981 6.63001C9.22204 6.42341 9.14354 6.15846 9.17169 5.89382C9.19985 5.62918 9.33233 5.38668 9.53981 5.22001C9.74898 5.03597 10.0254 4.94753 10.3026 4.976C10.5797 5.00448 10.8324 5.14728 10.9998 5.37001L15.8298 11.37C16.1331 11.739 16.1331 12.271 15.8298 12.64L10.8298 18.64C10.6263 18.8855 10.318 19.0192 9.99981 19Z"
            fill="white"
          />
        </svg>
      </LoadingButton>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <StyledIconButton onClick={handleSignInDialog}>
          {" "}
          {/* Add onClick handler */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M9.21978 12.6667C9.01806 12.6674 8.82687 12.5767 8.69978 12.42L5.47978 8.42004C5.27757 8.17404 5.27757 7.81937 5.47978 7.57337L8.81312 3.57337C9.04876 3.28986 9.46961 3.25106 9.75312 3.4867C10.0366 3.72234 10.0754 4.1432 9.83978 4.4267L6.85978 8.00004L9.73978 11.5734C9.90625 11.7732 9.94132 12.0516 9.82961 12.2864C9.71791 12.5213 9.47983 12.6697 9.21978 12.6667Z"
              fill="#212B36"
            />
          </svg>
        </StyledIconButton>
        <Typography
          variant="subtitle2"
          sx={{
            color: "var(--Text-Primary, #212B36)",
            fontFamily: "Public Sans, sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            lineHeight: "22px",
            cursor: "pointer",
            marginLeft: "8px",
          }}
          onClick={handleSignInDialog}
        >
           {t("reset-password-form.reset-password-link-text")}
        </Typography>
      </Box>

      {/* Dialog for password reset confirmation */}
      <Dialog
        open={openDialog}
        onClose={handleResetPasswordDialog}
        aria-labelledby="dialog-title"
        sx={{
          // Replace #ccc with your desired grey color
          boxShadow: "none", // Remove the box shadow
          border: "#E0E0E0",
          //background: "var(--primary-contrast, #FFF)",
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "24px",
            padding: "32px 64px",
            borderRadius: "4px",
            border: "1px #E0E0E0", // Replace #ccc with your desired grey color
            boxShadow: "none", // Remove the box shadow
            background: "var(--primary-contrast, #FFF)",
          }}
        >
          <img
            src={EmailIcon}
            alt="Email Icon"
            style={{ marginRight: "8px" }}
          />

          <Typography
            variant="h4"
            sx={{
              color: "var(--Text-Primary, #212B36)",
              fontFamily: "Public Sans, sans-serif",
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "36px",
              alignSelf: "flex-start", // Align header to the left
            }}
          >
             {t("reset-password-dialog.reset-password-dialog-title")}
          </Typography>
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
            {t("reset-password-dialog.reset-password-dialog-text")}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "var(--Text-Primary, #212B36)",
              fontFamily: "Public Sans, sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "22px",
            }}
          >
             {t("reset-password-dialog.reset-password-dialog-body")}{" "}
            <RouterLink
              to="/resetpassword"
              style={{
                color: "var(--primary-main, #00A5AA)",
                fontFamily: "Public Sans, sans-serif",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "22px",
                textDecoration: "none",
              }}
              onClick={handleResetPasswordDialog}
            >
             {t("reset-password-dialog.reset-password-dialog-link")}
            </RouterLink>
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton sx={{ marginLeft: "-12px" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M9.21978 12.6667C9.01806 12.6674 8.82687 12.5767 8.69978 12.42L5.47978 8.42004C5.27757 8.17404 5.27757 7.81937 5.47978 7.57337L8.81312 3.57337C9.04876 3.28986 9.46961 3.25106 9.75312 3.4867C10.0366 3.72234 10.0754 4.1432 9.83978 4.4267L6.85978 8.00004L9.73978 11.5734C9.90625 11.7732 9.94132 12.0516 9.82961 12.2864C9.71791 12.5213 9.47983 12.6697 9.21978 12.6667Z"
                  fill="#212B36"
                />
              </svg>
            </IconButton>
            <Typography
              variant="subtitle2"
              sx={{
                color: "var(--Text-Primary, #212B36)",
                fontFamily: "Public Sans, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                lineHeight: "22px",
                cursor: "pointer",
                marginLeft: "8px",
              }}
              onClick={handleSignUpDialog}
            >
               {t("reset-password-dialog.reset-password-dialog-link-text")}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default ForgotPasswordForm;
