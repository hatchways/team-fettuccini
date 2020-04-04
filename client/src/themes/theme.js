import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Roboto"',
    fontSize: 12,
    h1: {
      textAlign: 'center'
    }
  },
  palette: {
    primary: { main: "#DF1B1B" }
  }
});
