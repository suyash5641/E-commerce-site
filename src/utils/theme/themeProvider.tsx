import { type PaletteMode, type Theme } from '@mui/material'
import {
  createTheme as createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles'
import * as React from 'react'
import { createPalette } from './palette'
import { createTypography } from './typography'
type ThemeProviderProps = {
  children: React.ReactNode
}
function createTheme(mode: PaletteMode): Theme {
  return createMuiTheme({
    palette: createPalette(mode),
    typography: createTypography(),
  })
}
const ToggleThemeContext = React.createContext(() => {})
function ThemeProvider(props: ThemeProviderProps): JSX.Element {
  const [theme, setTheme] = React.useState(() => createTheme('light'))
  const toggleTheme = React.useCallback(() => {
    setTheme((theme) => createTheme(theme.palette.mode === 'light' ? 'dark' : 'light'))
  }, [])
  return (
  <MuiThemeProvider theme={theme}>
    <ToggleThemeContext.Provider value={toggleTheme}>
      {props.children}
    </ToggleThemeContext.Provider>
  </MuiThemeProvider>)
}
export { ThemeProvider, ToggleThemeContext }