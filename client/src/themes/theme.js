import { createMuiTheme } from "@material-ui/core";

import { teal } from '@material-ui/core/colors';

const primary = teal[500]

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Roboto"',
    fontSize: 12,
    h4: {
      textAlign: 'center',
      "&:after": {
        content: 'close-quote',
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
    primary: {
      main: primary,
      contrastText: "#fff"
    },
    secondary: { main: "#DF1B1B" }
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
    MuiCheck: {
      custom: {
        fill: 'primary'
      }
    },
    MuiButton: {
      contained: {
        textAlign: "center",
        margin: "10px",
        padding: "10px 40px",
        textTransform: "capitalize"
      }
    },
    MuiFormLabel: {
      root: {
        marginTop: "1em",
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
