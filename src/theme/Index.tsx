import { ReactNode, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider as MUIThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import palette from './palette';
import customShadows from './customShadow';



interface ThemeProviderProps {
  children: ReactNode;
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const themeOptions = useMemo(
    () => ({
      palette,
      shape: { borderRadius: 6 },
      customShadows: customShadows(),
    }),
    []
  );

  const theme = createTheme(themeOptions);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}

export {};
