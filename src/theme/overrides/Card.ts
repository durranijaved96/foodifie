import { Theme } from '@mui/material/styles';

export default function Card(theme: Theme) {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: theme.customShadows.card,
          borderRadius: Number(theme.shape.borderRadius) * 2,
          position: 'relative',
          zIndex: 0, // Fix Safari overflow: hidden with border radius
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: 'h6' },
        subheaderTypographyProps: { variant: 'body2' },
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(3, 3, 0),
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3),
        },
      },
    },
    // Apply custom styles for AppSummary component (main grid items)
    AppSummary: {
      styleOverrides: {
        root: {
          borderRadius: theme.shape.borderRadius, // Use default card border radius
          boxShadow: theme.customShadows.card, // Use default card boxShadow
        },
      },
    },
  };
}
