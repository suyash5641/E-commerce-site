import { type ThemeOptions } from '@mui/material/styles'
import { colors } from './palette'
type Func = () => NonNullable<ThemeOptions['typography']>
const createTypography: Func = () => ({
  fontFamily: [
    `Roboto`,
    `system-ui`,
    `-apple-system`,
    `BlinkMacSystemFont`,
    `'Segoe UI'`,
    `Helvetica`,
    `Arial`,
    `sans-serif`,
    `'Apple Color Emoji'`,
    `'Segoe UI Emoji'`,
    `'Segoe UI Symbol'`,
    'Montserrat',
  ].join(','),
  h1: {
    fontSize: '36px',
    fontWeight: 500,
    color: colors.primaryText,
    fontFamily: 'Roboto',
  },
  h2: {
    fontSize: '24px',
    fontWeight: 500,
    color: colors.primaryText,
    fontFamily: 'Roboto',
  },
  h3: {
    fontSize: '18px',
    fontWeight: 500,
    color: colors.primaryText,
    fontFamily: 'Roboto',
  },
  h6: {
    fontSize: '14px',
    fontWeight: 400,
    color: colors.primaryText,
    fontFamily: 'Roboto',
  },
  h4: {
    fontSize: '58px',
    fontWeight: 700,
    color: colors.primaryHeadingText,
    fontFamily: 'Roboto',
  },
})
export { createTypography }