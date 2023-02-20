import { createTheme } from '@mui/material/styles'

const mainPalette = {
  primary: {
    main: '#750D37'
  },
  success: {
    main: '#04A777'
  },
  error: {
    main: '#CA165E'
  }
}

const mainTypography = {
  fontFamily: [
    'ui-monospace', 'Menlo', 'Monaco', 'Cascadia Mono', 'Segoe UI Mono',
    'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace', 'Source Code Pro',
    'Fira Mono', 'Droid Sans Mono', 'Courier New', 'monospace'
  ].join(','),
  fontSize: 14,
  color: "#0B3C49"
}


export const mainTheme = createTheme({
  palette: mainPalette,
  typography: mainTypography,
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#750D37'
            }
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '0.5rem 1rem',
        },
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          '&:last-child': {
            paddingBottom: 'inherit',
          }
        }
      }
    }
  }
})



