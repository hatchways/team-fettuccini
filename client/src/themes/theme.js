import { createMuiTheme } from "@material-ui/core";

const primary = "#32be72"

export const theme = createMuiTheme({
  typography: {
    fontFamily:
      'Roboto',
    fontSize: 12,
    h4: {
      textAlign: "center",
      "&:after": {
        content: "close-quote",
        borderBottom: `2px solid ${primary}`,
        maxWidth: "80px",
        display: "block",
        margin: "0.5em auto"
      }
    },
    h6: {
      display: 'inline',
      cursor: "pointer"
    },
    body1: {
      display: 'inline'
    },
  },
  palette: {
    common: {
      gray: "#efeeee",
      darkGray: "#5d5d5d"
    },
    primary: {
      main: primary,
      contrastText: "#fff",
    },
    secondary: { main: "#DF1B1B" }
  },
  shape: {
    borderRadius: "7px"
  },
  overrides: {
    MuiPaper: {
      customPrimary: {
        textAlign: "center",
        margin: "50px auto",
        padding: "20px",
        width: "60%",
        maxWidth: "500px",
      }
    },
    MuiCard: {
      root: {
        padding: "10% 5%",
        "&:hover": {
          cursor: "pointer"
        }
      }
    },
    MuiCheck: {
      custom: {
        fill: 'primary'
      }
    },
    MuiButton: {
      root: {
        textTransform: "capitalize"
      },
      contained: {
        textAlign: "center",
        margin: "10px",
        padding: "10px 40px"
      }
    },
    MuiFormLabel: {
      root: {
        margin: "1em 0 0.5em 0",
        display: 'block',
        textAlign: "left",
        fontWeight: "bold",
        color: "black",
        fontSize: "1em"
      }
    },
    MuiTextField: {
      root: {
        width: "100%",
        margin: "8px 0",
        borderRadius: "4px",
        boxSizing: "border-box",
        fontSize: "20px"
      }
    }
  }
});
