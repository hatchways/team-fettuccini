import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";
import { Typography, Button, Box } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import PersonIcon from "@material-ui/icons/Person";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";

import auth from "./auth/auth";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  blue: {
    color: "#1E90FF",
    fontSize: "20px",
    fontWeight: "600",
    fontFamily: "Roboto",
  },
  header: {
    display: "flex",
    flexWrap: "wrap-reverse",
    justifyContent: "space-between",
    backgroundColor: "white",
    textAlign: "center",
  },
  invisible: {
    opacity: "0",
    "&:hover": {
      cursor: "default",
    },
  },
  navSides: {
    flexGrow: "1",
  },
  navMain: {
    flexGrow: "12",
  },
  red: {
    color: "#FA8072",
    fontSize: "20px",
    fontWeight: "600",
    fontFamily: "Roboto",
  },
  bar: {
    fontSize: "20px",
    fontWeight: "bold",
  },
});

export default function NavBar(props) {
  let history = useHistory();
  const classes = useStyles(props);
  const [anchorEl, setAnchorEl] = React.useState(false);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(false);
  };

  return (
    <Box className={classes.header}>
      <Grid container direction="row" alignItems="center">
        <Grid item xs>
          <Typography variant="h4" className={classes.navMain}>
            CLUEWORDS
          </Typography>
        </Grid>
        {auth.isAuthenticated() ? (
          <Fragment>
            {props.isMatchInProgres ? (
              <Fragment>
                <Grid item xs={2}>
                  <span className={classes.blue}>
                    {props.blueScore}
                    <br />
                    Blue Team
                  </span>
                </Grid>

                <Grid item xs={1}>
                  <span className={classes.bar}>-</span>
                </Grid>

                <Grid item xs={2}>
                  <span className={classes.red}>
                    {props.redScore}
                    <br />
                    Red Team
                  </span>
                </Grid>

                <Grid item xs>
                  <Button
                    className={classes.navSides}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      props.setIsMatchInProgres(false);
                      history.push("/welcome");
                    }}
                  >
                    New game
                  </Button>
                </Grid>
              </Fragment>
            ) : null}

            <Grid item xs alignContent="flex-end">
              <ListItem>
                <Avatar>
                  <PersonIcon />
                </Avatar>
                <Button onClick={handleOpenMenu}>My profile</Button>
              </ListItem>
              <Menu
                id="menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem
                  onClick={() => {
                    auth.signout(() => {
                      history.push("/");
                      setAnchorEl(false);
                      props.setIsMatchInProgres(false);
                    });
                  }}
                >
                  Signout
                </MenuItem>
              </Menu>
            </Grid>
          </Fragment>
        ) : null}
      </Grid>
    </Box>
  );
}
