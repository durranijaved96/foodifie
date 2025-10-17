import { forwardRef, HTMLAttributes } from 'react';
import { Box, SxProps } from '@mui/system';

interface SvgColorProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string;
  sx?: SxProps;
}

const SvgColor = forwardRef<HTMLSpanElement, SvgColorProps>((props, ref) => {
  const { src, sx, ...other } = props;
  
  return (
    <Box
      component="span"
      className="svg-color"
      ref={ref}
      sx={{
        width: 24,
        height: 24,
        display: 'inline-block',
        bgcolor: 'currentColor',
        mask: `url(${src}) no-repeat center / contain`,
        WebkitMask: `url(${src}) no-repeat center / contain`,
        ...sx,
      }}
      {...other}
    />
  );
});

export default SvgColor;
