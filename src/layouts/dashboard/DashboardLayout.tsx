/* eslint-disable @typescript-eslint/no-unused-vars */
// DashboardLayout.tsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Header from "./header/Header";
import Nav from "./nav/nav";

//import Home from '../../sections/home/Home';
//import {loadStripe} from '@stripe/stripe-js';

//import { Elements } from '@stripe/react-stripe-js';

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled("div")({
  display: "flex",
  minHeight: "100%",
  overflow: "hidden",
});

const Main = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  minHeight: "100%",
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up("lg")]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

interface BackdropProps {
  open: boolean;
}

const Backdrop = styled("div")<BackdropProps>(({ open }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "#FFFF",
  zIndex: open ? 9999 : -1,
  pointerEvents: open ? "auto" : "none",
  opacity: open ? 1 : 0,
  transition: "opacity 0.9s",
}));

export default function DashboardLayout() {
  const [openNav, setOpenNav] = useState(false);
  const handleOpenNav = () => {
    setOpenNav(true);
  };

  const handleCloseNav = () => {
    setOpenNav(false);
  };

  return (
    <StyledRoot>
      <Header onOpenNav={() => setOpenNav(true)} />
      <Nav openNav={openNav} onCloseNav={handleCloseNav} />

      <Backdrop open={openNav} onClick={handleCloseNav} />
      <Main>
        <Outlet />
      </Main>
    </StyledRoot>
  );
}
