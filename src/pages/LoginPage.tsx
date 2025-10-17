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
import Header from "../layouts/dashboard/header/HeaderLanding";
import { LoadingButton } from "@mui/lab";
import HeaderLanding from "../layouts/dashboard/header/HeaderLanding";
import { t } from "i18next";

const AvatarSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
  >
    <path
      d="M20.0002 3.33334C10.8002 3.33334 3.3335 10.8 3.3335 20C3.3335 29.2 10.8002 36.6667 20.0002 36.6667C29.2002 36.6667 36.6668 29.2 36.6668 20C36.6668 10.8 29.2002 3.33334 20.0002 3.33334ZM20.0002 8.33334C22.7668 8.33334 25.0002 10.5667 25.0002 13.3333C25.0002 16.1 22.7668 18.3333 20.0002 18.3333C17.2335 18.3333 15.0002 16.1 15.0002 13.3333C15.0002 10.5667 17.2335 8.33334 20.0002 8.33334ZM20.0002 32C15.8335 32 12.1502 29.8667 10.0002 26.6333C10.0502 23.3167 16.6668 21.5 20.0002 21.5C23.3168 21.5 29.9502 23.3167 30.0002 26.6333C27.8502 29.8667 24.1668 32 20.0002 32Z"
      fill="#00A5AA"
    />
  </svg>
);

const StyledContent = styled("div")(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 2), // Adjusted left and right padding
  boxSizing: "border-box",
  textAlign: "center",
  fontFamily: "'Public Sans', sans-serif",
  alignItems: "stretch",
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
/*const CookieBannerContainer = styled("div")(({ theme }) => ({
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
*/
export default function LoginPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  /* const [showCookieBanner, setShowCookieBanner] = useState(true);

  const handleCookieAccept = () => {
    setShowCookieBanner(false);
  };

  const handleCookieReject = () => {
    setShowCookieBanner(false);
  };
*/
  return (
    <>
      <Helmet>
        <title>Login | Test</title>
      </Helmet>
      <br />
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
                    <StyledAvatar>{AvatarSVG}</StyledAvatar>
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
                    {t("signin.signin-page")}
                  </Typography>

                  <Typography
                    variant="body2" /* Changed to body2 for "New user" */
                    sx={{
                      color: "var(--Text-Primary, #212B36)",
                      textAlign: "left",
                      marginBottom: 2,
                      fontFamily: "Public Sans, sans-serif",
                      fontSize: "14px",
                      fontWeight: "400",
                      lineHeight: "22px",
                    }} /* Updated color and alignment */
                  >
                    {t("signin.create-account")}{" "}
                    <MuiLink
                      component={Link}
                      to="/signup"
                      sx={{
                        color: "#00A5AA",
                        fontFamily: "Public Sans, sans-serif",
                        fontSize: "14px",
                        lineHeight: "22px",
                        fontWeight: 600,
                        fontStyle: "normal",
                        textDecoration: "none", // Remove underline
                      }}
                    >
                     {t("signin.account-link")}
                    </MuiLink>
                  </Typography>

                  <LoginForm />
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
                   {t("signin.privacy-policy")}
                  </MuiLink>{" "}
                  <MuiLink
                    component={Link}
                    to="https://imprint-impressum/"
                    target="_blank"
                    color="#637381"
                  >
                    {t("signin.imprint")}
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
