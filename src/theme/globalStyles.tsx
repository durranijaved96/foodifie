import { useEffect } from 'react';
import { CssBaseline } from '@mui/material';

export default function GlobalStyles() {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        box-sizing: border-box;
      }
  
      html {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        -webkit-overflow-scrolling: touch;
      }
  
      body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
      }
  
      #root {
        width: 100%;
        height: 100%;
      }
  
      input[type='number'] {
        appearance: textfield;
  
        &::-webkit-outer-spin-button {
          margin: 0;
          -webkit-appearance: none;
        }
  
        &::-webkit-inner-spin-button {
          margin: 0;
          -webkit-appearance: none;
        }
      }
  
      img {
        display: block;
        max-width: 100%;
      }
  
      ul {
        margin: 0;
        padding: 0;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return <CssBaseline />;
}
