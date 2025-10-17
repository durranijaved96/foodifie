import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useState } from 'react';

export default function useResponsive(
  query: 'up' | 'down' | 'between',
  start?: string,
  end?: string
): boolean {
  const theme = useTheme();

  const mediaUp = useMediaQuery(theme.breakpoints.up(start as any));
  const mediaDown = useMediaQuery(theme.breakpoints.down(start as any));
  const mediaBetween = useMediaQuery(theme.breakpoints.between(start as any, end as any));
  const mediaOnly = useMediaQuery(theme.breakpoints.only(start as any));

  if (query === 'up') {
    return mediaUp;
  }

  if (query === 'down') {
    return mediaDown;
  }

  if (query === 'between') {
    return mediaBetween;
  }

  return mediaOnly;
}

export function useWidth(): string {
  const theme = useTheme();
  const [width, setWidth] = useState<string>('');

  useEffect(() => {
    const handleResize = () => {
      const keys = [...theme.breakpoints.keys].reverse();

      for (const key of keys) {
        if (theme.breakpoints.up(key)) {
          setWidth(key);
          break;
        }
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [theme.breakpoints]);

  return width || 'xs';
}

