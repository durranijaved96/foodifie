import { useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
// hooks

// components
import Logo from "../../../assets/images/Logo.png";

//
import { NAV } from '../config-layout';

import { styled } from "@mui/material/styles";
import { useMockedUser } from '../../hooks/use-mocked-user';
import useResponsive from '../../hooks/useResponsoive';
import { usePathname } from '../../hooks/use-pathname';
import Scrollbar from '../../components/scrollbar/Scrollbar';
import NavSectionVertical from '../../components/nav-section/vertical/nav-section-vertical';
import { useNavData } from './nav/config';
import NavToggleButton from '../_common/nav-toggle-button';

// ----------------------------------------------------------------------

type Props = {
  openNav: boolean;
  onCloseNav: VoidFunction;
};
const StyledLogo = styled("img")(({ theme }) => ({
    width: 100,
    position: "absolute",
    top: -50,
    left: "50%", // Center the logo horizontally
    transform: "translateX(-50%)", // Center the logo horizontally
  }));
export default function NavVertical({ openNav, onCloseNav }: Props) {
  const { user } = useMockedUser();

  const pathname = usePathname();

  const lgUp = useResponsive('up', 'lg');

  const navData = useNavData();

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
       <StyledLogo sx={{ mx: 'auto', my: 2 }} src={Logo} alt="Logo" />

      <NavSectionVertical
        data={navData}
        config={{
          currentRole: user?.role || 'admin',
        }}
      />

      <Box sx={{ flexGrow: 1 }} />

    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
      }}
    >
      <NavToggleButton />

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.W_VERTICAL,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
