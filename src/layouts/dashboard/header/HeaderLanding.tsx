import React from "react";
import PropTypes from "prop-types";
import { AppBar, Toolbar, IconButton, Box, Stack, styled } from "@mui/material";
import Iconify from "../../../components/iconify/Iconify";
import LanguagePopover from "./Language";
import Logo from "../../../assets/images/Logo.png";
import Scrollbar from "../../../components/scrollbar/Scrollbar";
//import SettingsButton from '../../_common/settingsButton';

// ----------------------------------------------------------------------

const StyledRoot = AppBar;
const APP_BAR_MOBILE = 64;

const StyledToolbar = Toolbar;
const StyledLogo = styled("img")(({ theme }) => ({
  width: 100,
  marginLeft: 20, // Adjust the left margin for logo positioning
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledLanguageIcon = styled(Iconify)(({ theme }) => ({
  fontSize: 20, // Adjust the size as needed
  marginRight: 20, // Adjust the right margin for icon positioning
}));
const navHeight = `calc(100% - ${APP_BAR_MOBILE}px)`;

interface HeaderProps {
  onOpenNav?: () => void;
}

const HeaderLanding: React.FC<HeaderProps> = ({ onOpenNav }) => {
  return (
    <Scrollbar
      sx={{
        height: navHeight,
      }}
    >
      <StyledRoot
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          boxShadow: "none",
          backgroundColor: "#FFFFFF", // Set background color to white
          borderBottom: "1px solid #FFFFFF", // Add bottom border
          borderTop: "1px solid #E00E0", // Add top border
          zIndex: 999,
        }}
      >
        <StyledToolbar>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "0 20px", // Add padding for space between logo and icon
            }}
          >
            <StyledLogo src={Logo} alt="Logo" />
            <IconButton
              onClick={onOpenNav}
              sx={{
                color: "white",
                display: { lg: "none" },
              }}
            >
              <Iconify icon="eva:menu-2-fill" />
            </IconButton>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2} // Adjust spacing as needed
            >
             <LanguagePopover />
            </Stack>
          </Box>
        </StyledToolbar>
      </StyledRoot>
    </Scrollbar>
  );
};

HeaderLanding.propTypes = {
  onOpenNav: PropTypes.func,
};

export default HeaderLanding;
