/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Link as MuiLink,
  Card,
  CardContent,
  Button,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import LogoImage from "../assets/images/Logo.png";
import SignupForm from "../sections/auth/modern/SignUpForm";
import { Link } from "react-router-dom"; // Assuming you are using react-router for navigation
import HeaderLanding from "../layouts/dashboard/header/HeaderLanding";
import { Close as CloseIcon } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { t } from "i18next";

const CookieBannerContainer = styled("div")(({ theme }) => ({
  display: "flex",
  position: "fixed",
  bottom: 20,
  left: 20,
  right: 20,
  width: "85%",
  margin: "0 auto",

  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  backgroundColor: "rgba(0, 165, 170, 0.1)",
  padding: "16px",

  borderRadius: "8px",
  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  zIndex: 9999,
  boxSizing: "border-box",
}));

const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

interface CookieBannerProps {
  onAccept: () => void;
  onReject: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onAccept, onReject }) => {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const hasAcceptedCookies = document.cookie.includes("cookiesAccepted=true");
    setAccepted(hasAcceptedCookies);
  }, []);

  const handleAccept = () => {
    setAccepted(true);
    onAccept();
    setCookie("cookiesAccepted", "true", 365);
  };

  const handleReject = () => {
    setAccepted(false);
    onReject();
  };

  const handleClose = () => {
    setAccepted(true);
  };

  if (accepted) {
    return null;
  }

  return (
    <CookieBannerContainer>
      <Typography
        variant="body1"
        sx={{
          marginBottom: 1,
          fontFamily: "Public Sans, sans-serif",
          fontSize: "12px",
          fontWeight: 400,
          lineHeight: "18px",
          fontStyle: "normal",
          color: "#000", // Set text color to black
          textAlign: "left", // Align text to the left
        }}
      >
        Our website employs cookies and Google Analytics to gather insights and
        statistical data. These cookies play a pivotal role in enhancing the
        overall customer experience on our platform. By continuing to navigate
        and utilize this website, you are giving your consent to the utilization
        of cookies. For more comprehensive information, please refer to our{" "}
        <MuiLink
          variant="subtitle2"
          sx={{
            color: "#00A5AA",
            marginBottom: 1,
            fontFamily: "Public Sans, sans-serif",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "18px",
            fontStyle: "normal",
          }}
          href="https://privacy-policy/"
        >
          Privacy Policy
        </MuiLink>{" "}
      </Typography>

      <Box mt={1} width="100%">
        <Stack direction="row" spacing={1}>
          <LoadingButton
            size="small"
            variant="outlined"
            style={{
              borderRadius: 8,
              backgroundColor: "#212B36",
              color: "white",
              fontFamily: "Public Sans, sans-serif",
              fontStyle: "normal",
              fontWeight: "700",
              fontSize: "13px",
              lineHeight: "22px",
              textTransform: "capitalize", // Capitalize the first letter only
            }}
            onClick={handleAccept}
          >
            Agree
          </LoadingButton>
          <LoadingButton
            size="small"
            variant="outlined"
            style={{
              borderRadius: 8,
              fontFamily: "Public Sans, sans-serif",
              fontStyle: "normal",
              fontWeight: "700",
              fontSize: "13px",
              lineHeight: "22px",
              borderColor: "#919EAB3D",
              color: "#212B36",
              textTransform: "capitalize", // Capitalize the first letter only
            }}
            onClick={handleReject}
          >
            Only necessary cookies
          </LoadingButton>
        </Stack>
      </Box>
      <Box onClick={handleClose} style={{ cursor: "pointer" }}></Box>
    </CookieBannerContainer>
  );
};

const StyledContent = styled("div")(({ theme }) => ({
  minHeight: "100vh",
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
  boxSizing: "border-box",
  textAlign: "center",
  fontFamily: "'Public Sans', sans-serif",
  alignItems: "stretch",
}));

const StyledImageContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "left",
  alignItems: "center",
  marginBottom: theme.spacing(4),
}));
const StyledImage = styled("img")(({ theme }) => ({
  marginTop: theme.spacing(2),
  maxWidth: "30%",
  height: "auto",
  [theme.breakpoints.up("md")]: {
    width: 150,
  },
}));

const StyledLoaderContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  // Adjust this margin as needed
  display: "flex",
  width: 390,
  padding: theme.spacing(0, 8), // Adjust this padding as needed
  flexDirection: "column",
  alignItems: "flex-start",
  margin: " 0 auto",
}));

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
 const [showCookieBanner, setShowCookieBanner] = useState(true);

  const handleCookieAccept = () => {
    setShowCookieBanner(false);
  };

  const handleCookieReject = () => {
    setShowCookieBanner(false);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#FFFF" // Set background color for the entire page
    >
      <Helmet>
        <title> Sign Up | foodifie </title>
      </Helmet>
      <br />

      <Container maxWidth="md">
        <HeaderLanding />

        <StyledContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <StyledCard>
              <CardContent>
                <StyledImageContainer>
                  <StyledImage src={LogoImage} alt="signup" />
                </StyledImageContainer>

                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    color: "212B36",
                    marginBottom: 2,
                    fontFamily: "Public Sans, sans-serif",
                    fontSize: "24px",
                    lineHeight: "36px",
                    fontWeight: 700,
                    fontStyle: "normal",
                  }}
                  textAlign={"left"}
                >
                   {t("signup.signup-page-title")}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#212B36",
                    textAlign: "left",
                    marginBottom: 2,
                    fontFamily: "Public Sans, sans-serif",
                    fontSize: "14px",
                    lineHeight: "22px",
                    fontWeight: 400,
                    fontStyle: "normal",
                  }}
                >
                  {t("signup.sub-text")}{" "}
                  <MuiLink
                    component={Link}
                    to="/"
                    sx={{
                      color: "#00A5AA",
                      fontFamily: "Public Sans, sans-serif",
                      fontSize: "14px",
                      lineHeight: "22px",
                      fontWeight: 700,
                      fontStyle: "normal",
                      textDecoration: "none",
                    }}
                  >
                    {t("signup.login-link")}
                  </MuiLink>
                </Typography>

                <SignupForm />
                {loading ? (
                  <StyledLoaderContainer>
                    <CircularProgress />
                  </StyledLoaderContainer>
                ) : (
                  <></>
                )}
              </CardContent>
            </StyledCard>
            {showCookieBanner && (
              <CookieBanner
                onAccept={handleCookieAccept}
                onReject={handleCookieReject}
              />
            )}

            {/* Links to privacy policy, terms and conditions, and imprint */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={3}
            >
              <Typography
                variant="body2"
                color="#637381"
                fontSize="12px"
                fontWeight={400}
                lineHeight="normal"
                textAlign="center"
                sx={{ "& > :not(:last-child)": { marginRight: "8px" } }}
              >
                <MuiLink
                  component={Link}
                  to="https://terms-and-conditions/"
                  target="_blank" 
                  color="#637381"
                  sx={{
                    fontFamily: "Public Sans, sans-serif",
                    fontSize: "12px",
                    lineHeight: "normal",
                    fontWeight: 400,
                    fontStyle: "normal",
                  }}
                >
                   {t("signup.terms-of-use")}
                </MuiLink>{" "}
                <MuiLink
                  component={Link}
                  to="https://app-privacy-policy/"
                  target="_blank" // Open link in a new tab
                  color="#637381"
                  sx={{
                    fontFamily: "Public Sans, sans-serif",
                    fontSize: "12px",
                    lineHeight: "normal",
                    fontWeight: 400,
                    fontStyle: "normal",
                  }}
                >
                   {t("signup.privacy-policy")}
                </MuiLink>{" "}
                <MuiLink
                  component={Link}
                  to="https://imprint-impressum/"
                  target="_blank" // Open link in a new tab
                  color="#637381"
                  sx={{
                    fontFamily: "Public Sans, sans-serif",
                    fontSize: "12px",
                    lineHeight: "normal",
                    fontWeight: 400,
                    fontStyle: "normal",
                  }}
                >
                   {t("signup.imprint")}
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </StyledContent>
      </Container>
    </Box>
  );
}
