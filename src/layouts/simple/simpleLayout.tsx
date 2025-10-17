import { Outlet } from 'react-router-dom';
import { styled, Theme } from '@mui/material/styles';
import logoImg from '../../assets/images/Logo.png';

// ----------------------------------------------------------------------

const StyledHeader = styled('header')(({ theme }: { theme: Theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'relative',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up(theme.breakpoints.values.sm)]: {
    padding: theme.spacing(5, 5, 0),
  },
}));

const Logo = styled('img')({
  width: 100, // Set the width of the logo as you desire
  height: 'auto',
});

// ----------------------------------------------------------------------

export default function SimpleLayout() {
  return (
      <><StyledHeader>
      <Logo src={logoImg} alt="Logo" />
    </StyledHeader><Outlet /></>
  );
}

