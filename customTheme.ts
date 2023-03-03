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
          color: '#0B3C49',
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
          color: '#0B3C49',
          '&:last-child': {
            paddingBottom: 'inherit',
          }
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#0B3C49'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#D0DDD5',
          padding: '24px',
          color: '#0B3C49'
        }
      }
    }
  }
})



