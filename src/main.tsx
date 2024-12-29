import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import "@/styles/index.css";
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {
    "100": "#E4F7E7",
    "200": "#BEECC4",
    "300": "#96E2A0",
    "400": "#6FD87C",
    "500": "#04A51E",
    "600": "#35A947",
    "700": "#26823A",
    "800": "#185B2A",
    "900": "#0B351A"
  },
  theme: {
    "100": "#d6d6d6",
    "200": "#909090",
    "300": "#7a7a7a",
    "400": "#5f5f5f",
    "500": "#3f3f3f",
    "600": "#2b2b2b",
    "700": "#262626",
    "800": "#1d1d1d",
    "900": "#121212"
  }  
}

const theme = extendTheme({ colors })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </StrictMode>
);
