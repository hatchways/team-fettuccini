import React from "react";
import { useHistory } from "react-router-dom";
import { Typography, Button, Box } from "@material-ui/core";

import auth from './auth/auth'

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  header: {
    display: "flex",
    flexWrap: 'wrap-reverse',
    justifyContent: "space-between",
    backgroundColor: "white",
    textAlign: "center"
  },
  invisible: {
    opacity: "0",
    "&:hover": {
      cursor: "default"
    }
  },
  navSides: {
    flexGrow: '1'
  },
  navMain: {
    flexGrow: "12"
  }
});

export default function (props) {
  let history = useHistory();
  const classes = useStyles(props);

  return (
    <Box className={classes.header}>
      {auth.isAuthenticated() ? <Button
        className={`${classes.invisible} ${classes.navSides}`}>
        Sign out
      </Button> : null}

      <Typography variant="h2" className={classes.navMain}>
        CODINGWORDS
      </Typography>

      {auth.isAuthenticated() ? <Button
        className={classes.navSides}
        variant="contained"
        color="primary"
        onClick={() => {
          auth.signout(() => history.push("/"));
        }}>
        Sign out
      </Button> : null}
    </Box>)
}
