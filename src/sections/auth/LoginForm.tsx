// Signin:
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ChangeEvent, FocusEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Iconify from "../../components/iconify/Iconify";
import { styled } from "@mui/material/styles";
import { supabase } from "../../supabase";
import LastScreen from "../../../src/assets/gifs/Last screen.gif";

// Import the function

import { Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
import RHFTextField from "../../components/hook-form/rhf-text-field";
import { FormProvider } from "react-hook-form";
import { createUserAndTenant } from "../userManagement";
import { t } from "i18next";
import i18n from "../../i18n";

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
  marginBottom: theme.spacing(2),
}));

const ErrorMessage = styled(Typography)(({ theme }) => ({
  color: "#D32F2F", // Set color to the desired error color
  fontFamily: "Public Sans, sans-serif", // Set font family to Public Sans
  fontSize: "12px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "18px",
  display: "flex",
  alignItems: "center",
}));

const LoginForm = () => {
  // React router navigation
  const navigate = useNavigate();

  // State variables
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordFieldFocused, setPasswordFieldFocused] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [formErrors, setFormErrors] = useState<{
    email: string;
    password: string;
    terms: string;
  }>({
    email: "",
    password: "",
    terms: "",
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Handle click event for login
  // Handle click event for login
  const handleClick = async () => {
    if (!username || !password) {
      if (!formErrors.email && !formErrors.password) {
        setFormError("");
        setFormErrors({
          email: i18n.t("signin-form.signin-error.email-error"),
          password: i18n.t("signin-form.signin-error.password-error"),
          terms: "", // Add the missing 'terms' property
        });
      }
      return;
    }
    setIsLoggingIn(true);
    
    if (supabase) {
      // Authenticate with Supabase using signIn
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });

      if (error) {
        if (!formErrors.email && !formErrors.password) {
          setFormError("");
          setFormErrors({
            email: i18n.t("signin-form.signin-error.login-email-error"),
            password: i18n.t("signin-form.signin-error.login-password-error"),
            terms: "", // Add the missing 'terms' property
          });
        }
      } else {
        // Successful login
        const authId = data?.user?.id;
        if (authId) {
          const { data: dataUser, error: userError } = await supabase
            .from("User")
            .select("language")
            .eq("auth_id", authId)
            .limit(1);

          // If user does not exist, create user and tenant
          if (dataUser && dataUser.length === 0) {
            await createUserAndTenant(authId); // Use the imported function
          }

          // Redirect to dashboard or another page
          navigate("/dashboard/home");
        } else {
          console.error("User id not found.");
        }
      }
    } else {
      // Handle the case where supabase is null
      console.error("Supabase is not initialized.");
    }
    setIsLoggingIn(false);
  };


  const handlePasswordFieldFocus = () => {
    // Set the password field focused state to true
    setPasswordFieldFocused(true);
    // Validate email if it's not already validated
    if (!formErrors.email && !validateInput(username, "email")) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        email: t("signin-form.signin-error.email-error"),
      }));
    }
  };
  const validateInput = (input: string, fieldName: string) => {
    if (!input.trim()) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: `${fieldName} ${t("signup-form.signup-error.fieldname-error")}`,
      }));
      return false;
    }

    if (fieldName === "email") {
      // Check if the field is blurred or empty before validating email format
      if (formErrors.email || !input.includes("@")) {
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [fieldName]: i18n.t("signin-form.signin-error.email-error"),
        }));
        return false;
      }
    }

    if (fieldName === "password" && input.length < 8) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: "",
      }));
      return false;
    }

    setFormErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));
    return true;
  };
  // Handle change event for username field
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    // Clear username error when user starts typing
    setUsernameError("");
    // Clear form-level error
    setFormError("");
    // If password field has been focused, validate email immediately
    if (passwordFieldFocused) {
      validateInput(event.target.value, "email");
    }
  };
  const handleFieldFocus = (fieldName: string) => {
    // Show error message for invalid email when focusing on the password field
    if (
      fieldName === "password" &&
      !formErrors.email &&
      !validateInput(username, "email")
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        email: i18n.t("signin-form.signin-error.email-error"),
      }));
    }
  };

  // Handle change event for password field

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setPasswordError("");
    validateInput(newPassword, "password");
  };

  const handleUsernameBlur: FocusEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    const emailValue = event.target.value;
    if (!emailValue.trim()) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        email: t("signin-form.emai-required"),
      }));
    } else {
      validateInput(emailValue, "email");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const validateEmail = (email: string) => {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setUsernameError("Invalid email address.");
      return false;
    }
    setUsernameError("");
    return true;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const validatePassword = (password: string) => {
    if (password.length < passwordMinLength) {
      setPasswordError(
        `Password must be at least ${passwordMinLength} characters long.`
      );
      return false;
    }

    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character."
      );
      return false;
    }

    setPasswordError("");
    return true;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isCorrectCredentials = (username: string, password: string) => {
    //check if the username and password are correct.
    // You can make an API call or check against a database, etc.
    return username === "admin" && password === "password";
  };

  const passwordMinLength = 8;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~]).{8,}$/; // Requires at least 8 characters, one lowercase letter, one uppercase letter, one digit, and one special character
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        alignSelf: "stretch",
        gap: 2, // Adjust as needed
        backgroundColor: "var(--Background-Paper, #FFF)",
      }}
    >
      <StyledTextField
        name="email"
        label= {t("signin-form.signin-email")}
        variant="outlined"
        sx={{
          fontFamily: "Public Sans, sans-serif",
          fontSize: "14px",
          lineHeight: "22px",
          fontWeight: 400,
          fontStyle: "normal",
          marginBottom: "8px",
          width: "352px",
          borderColor: formErrors.email ? "#D32F2F" : "#212B36", // Adjust border color based on error state
        }}
        onBlur={handleUsernameBlur}
        onFocus={() =>
          setFormErrors((prevErrors) => ({ ...prevErrors, email: "" }))
        }
        onChange={handleUsernameChange}
        helperText={<ErrorMessage>{formErrors.email}</ErrorMessage>}
        error={!!formErrors.email} // Check form-level error
      />
      <StyledTextField
        name="password"
        label={t("signin-form.signin-password")}
        type={showPassword ? "text" : "password"}
        variant="outlined"
        sx={{
          fontFamily: "Public Sans, sans-serif",
          fontSize: "14px",
          lineHeight: "22px",
          fontWeight: 400,
          fontStyle: "normal",
          marginBottom: "8px",
          width: "352px",
          borderColor: formErrors.password ? "#D32F2F" : "#212B36", // Adjust border color based on error state
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                <Iconify
                  icon={
                    showPassword ? "solar:eye-bold" : "solar:eye-closed-bold"
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
        value={password}
        onChange={handlePasswordChange}
        onFocus={handlePasswordFieldFocus} // Call the function when the password field is focused
        onBlur={() => validateInput(password, "password")}
        helperText={<ErrorMessage>{formErrors.password}</ErrorMessage>}
        error={!!formErrors.password}
      />
      {formError && (
        <Typography
          variant="body2"
          sx={{
            color: "#D32F2F", // Set color to the desired error color
            fontFamily: "Public Sans, sans-serif", // Set font family to Public Sans
            fontSize: "12px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "18px",
            display: "flex",
            alignItems: "center",
            marginBottom: "8px", // Add margin bottom to create space between error message and button
          }}
        >
          {formError}
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          my: 1, // Reduce the margin top and bottom
          width: "100%",
        }}
      >
        <div style={{ flex: 1 }} />
        <MuiLink
          component={RouterLink}
          to="/resetpassword"
          variant="body2"
          sx={{
            color: "var(--Text-Primary, #212B36)",
            fontFamily: "Public Sans, sans-serif",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "22px",
            textDecorationLine: "underline",
            textDecorationColor: "#212B36"
          }}
        >
         {t("signin-form.forgot-password")}
        </MuiLink>
      </Box>{" "}
      {/* Move the login button up */}
      <LoadingButton
        size="large"
        type="submit"
        variant="contained"
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
        onClick={handleClick}
        loading={isLoggingIn}
        loadingIndicator={<img src={LastScreen} alt="Loading..." />}
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
         {t("signin-form.signin-button")}
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
    </Box>
  );
};

export default LoginForm;
