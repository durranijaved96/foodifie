import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Box } from '@mui/material';

type IconifyProps = {
  icon: string;
  color?: string; // Add the color prop
  width?: number;
  height?: number;
};

const Iconify = forwardRef<HTMLSpanElement, IconifyProps>(
  ({ icon, color = 'inherit', width = 20, height = 20, ...other }, ref) => (
    <Box ref={ref} component="span" sx={{ color, width, height }} {...other}>
      <Icon icon={icon} />
    </Box>
  )
);

Iconify.propTypes = {
  icon: PropTypes.string.isRequired,
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default Iconify;
