import { memo } from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useMockedUser } from '../../hooks/use-mocked-user';
import { HEADER } from '../config-layout';
import HeaderShadow from '../_common/header-shadow';
import { bgBlur } from '../../utils/cssStyles';
import NavSectionHorizontal from '../../components/nav-section/horizontal/nav-section-horizontal';
import  { useNavData } from './nav/config'; // Import your navigation configuration here

function NavHorizontal() {
  //const theme = useTheme();
  const { user } = useMockedUser();
  const navData = useNavData();

  return (
    <AppBar
      component="nav"
      sx={{
        top: HEADER.H_DESKTOP_OFFSET,
      }}
    >
      <Toolbar
  sx={(theme) => ({
    ...(bgBlur({
      color: theme.palette.background.default,
    }) as SxProps<Theme>), // Explicitly cast sx to SxProps<Theme>
  })}
>
        <NavSectionHorizontal
          data={navData} // Use the navConfig you imported
          config={{
            currentRole: user?.role || 'admin',
          }}
        />
      </Toolbar>
      <HeaderShadow />
    </AppBar>
  );
}

export default memo(NavHorizontal);
