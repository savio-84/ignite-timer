import { useState } from 'react'
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from './styles/themes/default';
import { GlobalStyle } from './styles/global';
import { Router } from './Router';
import { BrowserRouter } from 'react-router-dom';

export function App() {
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider theme={defaultTheme} >
      <BrowserRouter>
        <Router />
      </BrowserRouter>
      <GlobalStyle />
    </ThemeProvider>
  )
}

