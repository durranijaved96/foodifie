/* eslint-disable @typescript-eslint/no-unused-vars */
// @mui
import { useTheme } from '@mui/material/styles';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
// hooks

//
import { NAV } from '../config-layout';
import { useSettingsContext } from '../../components/settings/context/settings-context';
import { useResponsive } from '../../hooks/use-responsive';
import Iconify from '../../components/iconify/Iconify';
import { bgBlur } from '../../theme/css';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function NavToggleButton({ sx, ...other }: IconButtonProps) {
  const theme = useTheme();

  const settings = useSettingsContext();
  const [isMini, setIsMini] = useState(false);

  const handleToggle = () => {
    setIsMini((prev) => !prev);
};

  const lgUp = useResponsive('up', 'lg');

  if (!lgUp) {
    return null;
  }

  return (
    <IconButton
      size="small"
      onClick={() =>
       handleToggle()}
      sx={{
        p: 0.5,
        top: 32,
        position: 'fixed',
        left: NAV.W_VERTICAL - 12,
        zIndex: theme.zIndex.appBar + 1,
        border: `dashed 1px ${theme.palette.divider}`,
        ...bgBlur({ opacity: 0.48, color: theme.palette.background.default }),
        '&:hover': {
          bgcolor: 'background.default',
        },
        ...sx,
      }}
      {...other}
    >
      <Iconify
        width={16}
        icon={
          settings.themeLayout === 'vertical'
            ? 'eva:arrow-ios-back-fill'
            : 'eva:arrow-ios-forward-fill'
        }
      />
    </IconButton>
  );
}
