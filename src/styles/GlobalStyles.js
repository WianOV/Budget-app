import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }

  html, body {
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f5f5f5;
    color: #333;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    height: 100%;
  }

  input, select, button {
    font-family: inherit;
    font-size: 16px; /* Prevents zoom on focus in iOS */
  }

  /* Improve touch targets */
  button, a {
    min-height: 44px;
    min-width: 44px;
  }

  /* Remove default button styles */
  button {
    appearance: none;
    border: none;
    background: none;
    cursor: pointer;
  }
`

export default GlobalStyles
