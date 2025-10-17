import PropTypes from 'prop-types';
import { memo, ReactNode } from 'react';
// @mui
import { SxProps } from '@mui/system';
import { Box } from '@mui/material';

import { StyledRootScrollbar, StyledScrollbar } from './Styles';

interface ScrollbarProps {
  sx?: SxProps;
  children: ReactNode;
}

function Scrollbar({ children, sx, ...other }: ScrollbarProps) {
  const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  if (isMobile) {
    return (
      <Box sx={{ overflowX: 'auto', ...sx }} {...other}>
        {children}
      </Box>
    );
  }

  return (
    <StyledRootScrollbar>
      <StyledScrollbar clickOnTrack={false} sx={sx} {...other}>
        {children}
      </StyledScrollbar>
    </StyledRootScrollbar>
  );
}

Scrollbar.propTypes = {
  sx: PropTypes.object,
  children: PropTypes.node.isRequired,
};

export default memo(Scrollbar);

