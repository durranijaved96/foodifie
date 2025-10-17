import { Theme as MuiTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme extends MuiTheme {
    customShadows: {
      [x: string]: any;
      z8: '0px 0px 8px rgba(0, 0, 0, 0.12)',
      z20: '0px 0px 20px rgba(0, 0, 0, 0.16)',
      primary: 'box-shadow-value-for-primary', // custom shadow value for primary
      secondary: 'box-shadow-value-for-secondary',
    };
  }
}
