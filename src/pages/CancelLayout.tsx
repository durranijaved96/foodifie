/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
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
  
} from "@mui/material";
import { Link } from "react-router-dom";



import HeaderLanding from "../layouts/dashboard/header/HeaderLanding";
import CancelMessage from "../sections/subscription/CancelMessage";



const LockSVG = (
  
  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none">
  <path opacity="0.32" fill-rule="#D32F2F" clip-rule="#D32F2F" d="M20.9114 8.22695C19.4717 8.5891 17.7718 8.61315 16.3035 8.1646C15.6828 7.97495 15.1988 7.4914 14.9893 6.8771C14.4674 5.34677 14.3385 3.47362 14.722 2.0318C13.9279 2.01186 13.0248 2 12 2C8.51575 2 6.43945 2.13682 5.26285 2.26379C4.39116 2.35785 3.71902 2.94826 3.5558 3.80967C3.30175 5.15055 3 7.65725 3 12C3 16.3428 3.30175 18.8494 3.5558 20.1903C3.71902 21.0518 4.39116 21.6422 5.26285 21.7362C6.43945 21.8631 8.51575 22 12 22C15.4843 22 17.5606 21.8631 18.7372 21.7362C19.6089 21.6422 20.281 21.0518 20.4442 20.1903C20.6982 18.8494 21 16.3428 21 12C21 10.5445 20.9661 9.2952 20.9114 8.22695ZM8 13C7.4477 13 7 12.5523 7 12C7 11.4477 7.4477 11 8 11H12C12.5523 11 13 11.4477 13 12C13 12.5523 12.5523 13 12 13H8ZM8 17.5C7.4477 17.5 7 17.0523 7 16.5C7 15.9477 7.4477 15.5 8 15.5H15C15.5523 15.5 16 15.9477 16 16.5C16 17.0523 15.5523 17.5 15 17.5H8Z" fill="#D32F2F"/>
  <path d="M7 16.5C7 17.0523 7.4477 17.5 8 17.5H15C15.5523 17.5 16 17.0523 16 16.5C16 15.9477 15.5523 15.5 15 15.5H8C7.4477 15.5 7 15.9477 7 16.5Z" fill="#D32F2F"/>
  <path d="M7 12C7 12.5523 7.4477 13 8 13H12C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11H8C7.4477 11 7 11.4477 7 12Z" fill="#D32F2F"/>
  <path d="M20.9114 8.22695C19.4717 8.5891 17.7718 8.61315 16.3036 8.1646C15.6828 7.97495 15.1988 7.4914 14.9893 6.8771C14.4674 5.34675 14.3384 3.47357 14.722 2.03174C14.722 2.03174 15.9461 2.49994 18.1961 4.74994C20.4461 6.99995 20.9114 8.22695 20.9114 8.22695Z" fill="#D32F2F"/>
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
  width: 420,
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

export default function CancelLayout() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Helmet>
        <title>Failed page| foodifie</title>
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
                      color: "var(--Text-Primary, #D32F2F)",
                      marginBottom: 2,
                      fontFamily: "Public Sans, sans-serif",
                      fontSize: "24px",
                      fontWeight: "700",
                      lineHeight: "36px",
                    }} /* Updated color */
                    textAlign={"center"}
                  >
                   Your payment failed 
                  </Typography>

                  <CancelMessage/>
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
             {/* {showCookieBanner && (
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
                    Terms of Use
                  </MuiLink>{" "}
                  <MuiLink
                    component={Link}
                    to="https://app-privacy-policy/"
                    target="_blank" 
                    color="#637381"
                  >
                    Privacy Policy
                  </MuiLink>{" "}
                  <MuiLink
                    component={Link}
                    to="https://imprint-impressum/"
                    target="_blank" 
                    color="#637381"
                  >
                    Imprint
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
