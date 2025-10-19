/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Link as MuiLink,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Close as CloseIcon } from "@mui/icons-material";

import LoginForm from "../sections/auth/LoginForm";
import HeaderLanding from "../layouts/dashboard/header/HeaderLanding";
import { LoadingButton } from "@mui/lab";
import PasswordReset from "../sections/auth/modern/PasswordReset";
import { t } from "i18next";

const LockSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
  >
    <path
      d="M30.0003 13.3334H28.3337V10.0001C28.3337 5.40008 24.6003 1.66675 20.0003 1.66675C15.4003 1.66675 11.667 5.40008 11.667 10.0001V13.3334H10.0003C8.16699 13.3334 6.66699 14.8334 6.66699 16.6667V33.3334C6.66699 35.1667 8.16699 36.6667 10.0003 36.6667H30.0003C31.8337 36.6667 33.3337 35.1667 33.3337 33.3334V16.6667C33.3337 14.8334 31.8337 13.3334 30.0003 13.3334ZM20.0003 28.3334C18.167 28.3334 16.667 26.8334 16.667 25.0001C16.667 23.1667 18.167 21.6667 20.0003 21.6667C21.8337 21.6667 23.3337 23.1667 23.3337 25.0001C23.3337 26.8334 21.8337 28.3334 20.0003 28.3334ZM25.167 13.3334H14.8337V10.0001C14.8337 7.15008 17.1503 4.83341 20.0003 4.83341C22.8503 4.83341 25.167 7.15008 25.167 10.0001V13.3334Z"
      fill="#00A5AA"
    />
  </svg>
);

const StyledContent = styled("div")(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  // Adjusted left and right padding
  boxSizing: "border-box",
  textAlign: "center",
  fontFamily: "'Public Sans', sans-serif",
  alignItems: "stretch",
  margin: " 0 auto",
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

const StyledImageContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "left",
  alignItems: "center",
  marginBottom: theme.spacing(4),
}));

const StyledAvatar = styled("div")(({ theme }) => ({
  width: 40,
  height: 40,
}));
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

export default function LoginPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(true);

  const handleCookieAccept = () => {
    setShowCookieBanner(false);
  };

  const handleCookieReject = () => {
    setShowCookieBanner(false);
  };

  return (
    <>
      <Helmet>
        <title>Password Reset| foodifie</title>
      </Helmet>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="#FAFAFA" // Set background color for the entire page
      >
        <Container maxWidth="md">
          <HeaderLanding />

          <StyledContent>
            <Box display="flex" flexDirection="column" alignItems="center">
              <StyledCard>
                <CardContent>
                  <StyledImageContainer>
                    <StyledAvatar>{LockSVG}</StyledAvatar>
                  </StyledImageContainer>

                  <Typography
                    variant="h4" /* Changed to h4 for "Sign in" */
                    gutterBottom
                    sx={{
                      color: "var(--Text-Primary, #212B36)",
                      marginBottom: 2,
                      fontFamily: "Public Sans, sans-serif",
                      fontSize: "24px",
                      fontWeight: "700",
                      lineHeight: "36px",
                    }} /* Updated color */
                    textAlign={"left"}
                  >
                    {t("reset-password-page.reset-password-page-title")}
                  </Typography>

                  <PasswordReset />
                  <br />
                  {loading ? (
                    <StyledImageContainer>
                      <CircularProgress />
                    </StyledImageContainer>
                  ) : (
                    <Typography variant="body2"></Typography>
                  )}
                </CardContent>
              </StyledCard>
              {/*{showCookieBanner && (
                <CookieBanner
                  onAccept={handleCookieAccept}
                  onReject={handleCookieReject}
                />
              )}*/}
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt={5}
              >
                <Typography
                  variant="body2"
                  color="#637381"
                  fontSize="12px"
                  fontWeight={400}
                  lineHeight="normal"
                  textAlign="center" // Align the text in the center
                  sx={{ "& > :not(:last-child)": { marginRight: "8px" } }}
                >
                  <MuiLink
                    component={Link}
                    to="https://terms-and-conditions/"
                    target="_blank" 
                    color="#637381"
                  >
                    {t("signup.terms-of-use")}
                  </MuiLink>{" "}
                  <MuiLink
                    component={Link}
                    to="https://app-privacy-policy/"
                    target="_blank" 
                    color="#637381"
                  >
                     {t("signup.privacy-policy")}
                  </MuiLink>{" "}
                  <MuiLink
                    component={Link}
                    to="https://imprint-impressum/"
                    target="_blank" 
                    color="#637381"
                  >
                     {t("signup.imprint")}
                  </MuiLink>
                </Typography>
              </Box>
            </Box>
          </StyledContent>
        </Container>
      </Box>
    </>
  );
}
