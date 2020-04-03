import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Roboto"',
    fontSize: 12,
    h4: {
      textAlign: 'center',
      "&:after": {
        content: 'close-quote',
        borderBottom: "2px solid rgb(53, 229, 53)",
        maxWidth: "80px",
        display: "block",
        margin: "1em auto"
      }
    }
  },
  palette: {
    primary: {
      main: "rgb(53, 229, 53)",
      contrastText: "#fff"
    },
    secondary: { main: "#DF1B1B" }
  },
  overrides: {
    MuiPaper: {
      root: {
        textAlign: "center",
        margin: "50px auto",
        padding: "20px",
        width: "60%",
        maxWidth: "500px"
      }
    },
    MuiCheck: {
      custom: {
        fill: "rgb(53, 229, 53)"
      }
    },
    MuiButton: {
      contained: {
        textAlign: "center"
      }
    },
    MuiFormLabel: {
      root: {
        display: 'block',
        textAlign: "left"
      }
    }
  }
});
