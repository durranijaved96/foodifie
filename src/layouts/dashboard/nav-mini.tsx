// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// theme

import { useMockedUser } from '../../hooks/use-mocked-user';
import { useNavData } from './nav/config';
import NavToggleButton from '../_common/nav-toggle-button';
import { NAV } from '../config-layout';
import { hideScroll } from '../../theme/css';
import { styled } from "@mui/material/styles";
import NavSectionMini from '../../components/nav-section/mini/nav-section-mini';
import Logo from "../../../assets/images/Logo.png";
// hooks


// ----------------------------------------------------------------------

const StyledLogo = styled("img")(({ theme }) => ({
    width: 100,
    position: "absolute",
    top: -50,
    left: "50%", // Center the logo horizontally
    transform: "translateX(-50%)", // Center the logo horizontally
  }));
export default function NavMini() {
  const { user } = useMockedUser();

  const navData = useNavData();

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
      }}
    >
      <NavToggleButton
        sx={{
          top: 22,
          left: NAV.W_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        <StyledLogo sx={{ mx: 'auto', my: 2 }} src={Logo} alt="Logo" />

        <NavSectionMini
          data={navData}
          config={{
            currentRole: user?.role || 'admin',
          }}
        />
      </Stack>
    </Box>
  );
}
