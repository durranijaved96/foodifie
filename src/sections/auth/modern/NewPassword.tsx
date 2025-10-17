/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
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
import LockIcon from "@mui/icons-material/Lock";
import CheckIcon from "../../../assets/images/CheckCircleFilled.png";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase";
import { t } from "i18next";

interface TokenInfo {
  accessToken: string | null;
  expiresIn: string | null;
  refreshToken: string | null;
  tokenType: string | null;
  type: string | null;
}
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

const NewPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null); 
  // Use TokenInfo interface as the initial state type

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = urlParams.get('access_token');
    const expiresIn = urlParams.get('expires_in');
    const refreshToken = urlParams.get('refresh_token');
    const tokenType = urlParams.get('token_type');
    const type = urlParams.get('type');

    // Store token information in state
    setTokenInfo({
      accessToken,
      expiresIn,
      refreshToken,
      tokenType,
      type
    });
  }, []);
  const location = useLocation(); // Access location object
  useEffect(() => {
    // Parse parameters from the URL fragment
    const hashParams = new URLSearchParams(location.hash.slice(1));
    const accessToken = hashParams.get("access_token");
    // Use accessToken for any necessary actions
    // For security reasons, you should handle this token securely
    // For now, let's just console log it
    console.log("Access Token:", accessToken);
  }, [location.hash]); // Trigger effect when location.hash changes



  const [hash, setHash] = useState("");
  useEffect(() => {
    setHash(window.location.hash);
  },  []);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleSignUpDialog = () => {
    setOpenDialog(false);
    navigate("/"); // Navigate to the reset password page
  };
  const handleUpdatePassword = async () => {
    try {
      setIsLoading(true);
      if (supabase) {
        if (tokenInfo?.accessToken) {
          await supabase.auth.updateUser({ password });
          setOpenDialog(true);
        } else {
          throw new Error("User does not exist.");
        }
      }
    } catch (error: any) { // explicitly specify the type of error
      console.error("Password update error:", error.message);
    } finally {
      setIsLoading(false);
    }
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
      <StyledTextField
        name="password"
        label= {t("new-password-form.new-password-place-holder")}
        variant="outlined"
        sx={{
          width: 337,
        }}
        type="password"
        value={password}
        onChange={handlePasswordChange}
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
        onClick={() => handleUpdatePassword()} // Corrected onClick handler
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
         {t("new-password-form.new-password-button")}
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
      <Dialog
        open={openDialog}
        onClose={handleSignUpDialog}
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
            src={CheckIcon}
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
            {t("new-password-dialog.new-password-dialog-title")}
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
              {t("new-password-dialog.new-password-dialog-text")}
          </Typography>

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
            onClick={handleSignUpDialog} // Add onClick handler
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
               {t("new-password-dialog.new-password-button")}
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
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default NewPasswordForm;
