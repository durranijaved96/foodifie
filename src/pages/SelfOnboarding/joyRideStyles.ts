import { type Theme } from '@mui/material/styles';

export const onboardingTokens = {
   borderRadius: 8,
   overlayBg: 'rgba(0,0,0,0.5)',
   paperMaxWidth: 500,
   paperPadding: 4,
};

export const getJoyrideStyles = (theme: Theme) => ({
   options: { zIndex: 2100 },
   tooltip: { borderRadius: onboardingTokens.borderRadius },
   tooltipContainer: { borderRadius: onboardingTokens.borderRadius },
   buttonNext: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderRadius: onboardingTokens.borderRadius,
   },
   buttonBack: {
      backgroundColor: 'transparent',
      color: theme.palette.primary.main,
      border: `1px solid ${theme.palette.primary.main}`,
      borderRadius: onboardingTokens.borderRadius,
      marginRight: 10,
   },
   buttonSkip: {
      backgroundColor: theme.palette.grey[200],
      color: theme.palette.text.primary,
      borderRadius: onboardingTokens.borderRadius,
   },
});
