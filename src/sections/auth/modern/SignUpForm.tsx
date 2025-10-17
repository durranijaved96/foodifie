/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-lone-blocks */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useEffect,
  ChangeEvent,
  FocusEventHandler,
} from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Checkbox,
  Button,
  Box,
  Link as MuiLink,
  Dialog,
  DialogContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Iconify from "../../../components/iconify/Iconify";
import { supabase } from "../../../supabase";
import EmailIcon from "../../../assets/images/email.png";
import { t } from "i18next";

interface StyledCheckboxProps {
  formErrors: {
    email: string;
    password: string;
    terms: string;
  };
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
  marginBottom: theme.spacing(2),
}));

const StyledCheckbox = styled(
  ({ formErrors, ...other }: StyledCheckboxProps) => <Checkbox {...other} />
)(({ theme, formErrors }) => ({
  color: formErrors.terms ? "#D32F2F" : "#637381",
  "&.Mui-checked": {
    color: "#212B36",
  },
  "& .MuiIconButton-root": {
    padding: "8px",
    borderRadius: "8px", // Add borderRadius here to round the edges
  },
  "& .MuiSvgIcon-root": {
    fontSize: "18px",
  },
  marginLeft: 0,
  "&:hover": {
    backgroundColor: "transparent",
    outline: "none",
  },
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

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false);
  const [buttonColor, setButtonColor] = useState<string>("#00A5AA"); // Updated default button color to primary
  const [formErrors, setFormErrors] = useState<{
    email: string;
    password: string;
    terms: string;
  }>({
    email: "",
    password: "",
    terms: "",
  });
  const [formError, setFormError] = useState("");
  const [, setIsSigningUp] = useState<boolean>(false);
  const [, setPasswordHintsVisible] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false); // State to control dialog open/close
  const navigate = useNavigate();

  useEffect(() => {
    updateButtonColor();
  }, [termsAgreed, username, password]);

  const updateButtonColor = () => {
    if (!termsAgreed || !username || !password) {
      setButtonColor("#00A5AA"); // Disabled state color
    } else {
      setButtonColor("#00A5AA"); // Enabled state color
    }
  };

  const handleSignup = async () => {
    const isValidEmail = validateInput(username, "email");
    const isValidPassword = validateInput(password, "password");
    const isValidCheckbox = validateCheckbox();

    if (!isValidEmail || !isValidPassword || !isValidCheckbox) {
      return;
    }
    if (!username || !password) {
      setFormError("Please enter both username and password.");
      setFormErrors({
        email: "Please enter both username and password.",
        password: "Please enter both username and password.",
        terms: "", // Add the missing 'terms' property
      });
      return;
    }
    setIsSigningUp(true);

    try {
      if (!supabase) {
        throw new Error("Supabase client not initialized");
      }

      // Check if the email domain is allowed
      const allowedDomain = "foodifie.com";
      const emailDomain = username.split("@")[1];
      if (emailDomain !== allowedDomain) {
        throw new Error("Signup is limited to foodifie internal users for now.");
      }

      const { data, error }: { data: any; error: any } =
        await supabase.auth.signUp({
          email: username,
          password: password,
        });

      if (data && !error) {
        // Display dialog box
        setOpenDialog(true);
      } else {
        setFormErrors({
          ...formErrors,
          email: error.message || "Error during signup.",
        });
      }
    } catch (error: any) {
      console.error("Error during signup:", error.message);
      setFormErrors({
        ...formErrors,
        email: error.message || "Error during signup.",
      });
    }

    setIsSigningUp(false);
  };

  const validateCheckbox = () => {
    if (!termsAgreed) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        terms: t("signup-form.signup-error.checkbox-error"),
      }));
      return false;
    } else {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        terms: "",
      }));
      return true;
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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidCompanyEmail = /^[^\s@]+@(?!.*\.\d+$)[^\s@]+\.[^\s@]+$/.test(
        input
      );

      if (!emailRegex.test(input) || !isValidCompanyEmail) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [fieldName]: t("signup-form.signup-error.signup-email-error"),
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

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleUsernameBlur: FocusEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    const emailValue = event.target.value;
    if (!emailValue.trim()) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        email: t("signup-form.signup-error.signup-password-error"),
      }));
    } else {
      validateInput(emailValue, "email");
    }
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setPasswordHintsVisible(newPassword.length >= 8);
    validateInput(newPassword, "password");
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
        email: t("signup-form.signup-error.signup-email-error"),
      }));
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setTermsAgreed(isChecked);
    if (!isChecked) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        terms:t("signup-form.signup-error.checkbox-error"),
      }));
    } else {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        terms: "",
      }));
    }
    // Toggle error class based on checkbox state
    const checkbox = event.target;
    const checkboxContainer = checkbox.closest(".MuiCheckbox-root");
    if (checkboxContainer) {
      if (!isChecked) {
        checkboxContainer.classList.add("Mui-error");
      } else {
        checkboxContainer.classList.remove("Mui-error");
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate("/signup");
  };

  return (
    <>
      <Stack direction="column" alignItems="center" gap={1}>
        <StyledTextField
          name="email"
          label= {t("signup-form.signup-email")}
          variant="outlined"
          sx={{
            fontFamily: "Public Sans, sans-serif",
            fontSize: "14px",
            lineHeight: "22px",
            fontWeight: 400,
            fontStyle: "normal",
            width: "352px",
          }}
          value={username}
          onChange={handleUsernameChange}
          onBlur={handleUsernameBlur}
          onFocus={() =>
            setFormErrors((prevErrors) => ({ ...prevErrors, email: "" }))
          }
          error={!!formErrors.email} // Show error only if the field is blurred or empty
          helperText={<ErrorMessage>{formErrors.email}</ErrorMessage>} // Apply styling to error message
        />

        <StyledTextField
          name="password"
          label={t("signup-form.signup-password")}
          type={showPassword ? "text" : "password"}
          sx={{
            fontFamily: "Public Sans, sans-serif",
            fontSize: "14px",
            lineHeight: "22px",
            fontWeight: 400,
            fontStyle: "normal",
            marginBottom: "8px",
            width: "352px", // Add marginBottom to match Figma style
          }}
          variant="outlined"
          size="medium"
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
          onFocus={() => handleFieldFocus("password")}
          onBlur={() => validateInput(password, "password")}
          error={!!formErrors.password}
          helperText={<ErrorMessage>{formErrors.password}</ErrorMessage>} // Apply styling to error message
        />

        {password.length > 0 && password.length < 8 && (
          <Typography
            variant="body2"
            sx={{
              color: "var(--text-secondary, rgba(0, 0, 0, 0.60))",
              fontFamily: "Public Sans, sans-serif",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "18px",
              textAlign: "left",
            }}
          >
            {t("signup-form.password-hint")}
          </Typography>
        )}
      </Stack>
      <Box
  sx={{
    display: "flex",
    alignItems: "flex-start",
    gap: "0px", // Adjust as needed
    marginBottom: "9px", // Add margin bottom for spacing
    marginLeft: "-11px" // Adjust margin for alignment
  }}
>
  <StyledCheckbox
    formErrors={formErrors}
    checked={termsAgreed}
    onChange={handleCheckboxChange}
    sx={{ alignSelf: "flex-start", marginTop: "-9px" }} 
  />
  <Typography
    component="div"
    variant="caption"
    color="#637381"
    fontFamily="Public Sans, sans-serif"
    fontSize="12px"
    lineHeight="18px"
    fontWeight={400}
    sx={{
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center", // Align text to the center vertically
    }}
  >
    {t("signup-form.checkbox-text")}{" "}
    <MuiLink
      component={RouterLink}
      to="https://terms-and-conditions/"
      target="_blank"
      color="#000000DE"
      sx={{ textDecoration: "underline", marginLeft: "2px", marginRight: "2px" }} // Add underline and margin for consistency
    >
      {t("signup-form.t-c")}
    </MuiLink>
    {" "}
    
    <MuiLink
      component={RouterLink}
      to="https://data-processing-agreement/"
      target="_blank"
      color="#000000DE"
      sx={{ textDecoration: "underline", marginLeft: "2px", marginRight: "2px" }} // Add underline and margin for consistency
    >
      {t("signup-form.dpa")}
    </MuiLink>
    {" "}
    {t("signup-form.checkbox-text-3")}{" "}
    <MuiLink
      component={RouterLink}
      to="https://app-privacy-policy"
      target="_blank"
      color="#000000DE"
      sx={{ textDecoration: "underline", marginLeft: "2px", marginRight: "2px" }} // Add underline and margin for consistency
    >
      {t("signup-form.privacy-policy")}
    </MuiLink>
    {t("signup-form.checkbox-text-4")}{" "}
  </Typography>
</Box>

      {formErrors.terms && <ErrorMessage>{formErrors.terms}</ErrorMessage>}
      {formError && <ErrorMessage>{formError}</ErrorMessage>}
      <br />
      <Box textAlign="center" width="100%">
        <Button
          size="large"
          type="submit"
          variant="contained"
          style={{
            borderRadius: "8px",
            backgroundColor: buttonColor, // Set button color dynamically
            color: "white",
            textTransform: "none",
            width: "100%", // Make the button full width
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "none", // Remove box shadow
          }}
          onClick={handleSignup}
          // Disable button based on conditions
          // Button hover and pressed states
          sx={{
            "&:hover": {
              backgroundColor: "#32B7BB !important", // Hover state color
            },
            "&:active, &:focus": {
              backgroundColor: "#008B8F !important", // Pressed state color
            },
          }}
        >
          {/* Button label */}
          <span style={{ flex: 1 }}>
            <Typography
              fontFamily="Public Sans, sans-serif"
              fontSize="15px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="26px"
            >
               {t("signup-form.signup-button")}
            </Typography>
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
        </Button>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="dialog-title"
        sx={{
          // Replace #ccc with your desired grey color
          boxShadow: "none", // Remove the box shadow
          border: "#E0E0E0",
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
           {t("signup-form.signup-dialog-title")}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              width: "350px",
              color: "var(--Text-Secondary, #637381)",
              fontFamily: "Public Sans, sans-serif",
              fontSize: "14px",
              lineHeight: "22px",
            }}
          >
             {t("signup-form.signup-dialog-text")}
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
              onClick={handleCloseDialog}
            >
              {t("signup-form.signup-dialog-link")}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignupForm;
